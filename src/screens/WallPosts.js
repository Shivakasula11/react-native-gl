import React, { useEffect, useState, useContext } from "react";
import {View,Text,FlatList,TouchableOpacity,Image,StyleSheet,Alert,TextInput,} from "react-native";
import { supabase } from "../services/supabase-db/SupabaseClient";
import { Ionicons } from "@expo/vector-icons";
import CommentModal from "./CommentModal";
import { UserContext } from "../contexts/UserContext";
import { formatDistanceToNow } from "date-fns"; // Importing date-fns
import { useWindowDimensions, Platform } from "react-native";

const WallPosts = ({ refresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);

  const fetchPosts = async (offset, limit) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wall_posts")
      .select(
        `
        id, content, media_url, created_at, edited_at, user_id,
        profiles(first_name,last_name),
        wall_likes!wall_likes_post_id_fkey(count),
        wall_comments!wall_comments_post_id_fkey(count)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    } else {
      const formattedPosts = data.map((post) => ({
        ...post,
        username:
          post.profiles?.first_name && post.profiles?.last_name
            ? `${post.profiles.first_name} ${post.profiles.last_name}`
            : "Unknown",
        likeCount: post.wall_likes[0]?.count || 0,
        commentCount: post.wall_comments[0]?.count || 0,
        isEdited:
          post.edited_at &&
          new Date(post.edited_at) > new Date(post.created_at),
        timeAgo: formatDistanceToNow(new Date(post.created_at)) + " ago", // Add time ago
      }));

      setPosts((prevPosts) => [...prevPosts, ...formattedPosts]);
      setHasMore(data.length === limit);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(offset, limit);

    const likeSubscription = supabase
      .channel("wall_likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wall_likes" },
        fetchPosts
      )
      .subscribe();

    const commentSubscription = supabase
      .channel("wall_comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wall_comments" },
        fetchPosts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likeSubscription);
      supabase.removeChannel(commentSubscription);
    };
  }, [refresh]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
      fetchPosts(offset + limit, limit);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PostItem post={item} setPosts={setPosts} />}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      ListFooterComponent={
        loading ? <Text>Loading...</Text> : <View style={{ height: 50 }} />
      }
      onEndReached={loadMorePosts}
      onEndReachedThreshold={0.5}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const PostItem = ({ post, setPosts }) => {
  console.log("PostItem post: =======>", post); // Debugging line
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const { user } = useContext(UserContext);

  const handleNewComment = () => {
    setCommentCount(commentCount + 1);
  };

  const editPost = async () => {
    if (!newContent.trim()) {
      Alert.alert("Post content cannot be empty!");
      return;
    }

    const { error } = await supabase
      .from("wall_posts")
      .update({
        content: newContent,
        edited_at: new Date().toISOString(),
      })
      .eq("id", post.id);

    if (error) {
      console.error("Error updating post:", error);
    } else {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                content: newContent,
                isEdited: true,
                edited_at: new Date().toISOString(),
              }
            : p
        )
      );
      setIsEditing(false);
    }
  };

  const handleDeletePost = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const { error } = await supabase
            .from("wall_posts")
            .delete()
            .eq("id", post.id);
          if (!error) {
            setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
          } else {
            console.error("Error deleting post:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.username}>{post.username}</Text>
        {post.isEdited && <Text style={styles.editedText}>(Edited)</Text>}
        {user?.id === post.user_id && (
          <View style={styles.postActions}>
            {isEditing ? (
              <>
                <TouchableOpacity onPress={editPost} style={styles.iconButton}>
                  <Ionicons name="checkmark-outline" size={20} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  style={styles.iconButton}
                >
                  <Ionicons name="close-outline" size={20} color="red" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.iconButton}
                >
                  <Ionicons name="create-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeletePost}
                  style={styles.iconButton}
                >
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={newContent}
          onChangeText={setNewContent}
          multiline
        />
      ) : (
        <Text style={styles.text}>{post.content}</Text>
      )}

      {/* Render the image if media_url exists */}
      {post.media_url && (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: post.media_url }}
            style={styles.media}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.actions}>
        <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        <View style={styles.actionRow}>
          <LikeButton postId={post.id} likeCount={post.likeCount} />
          <TouchableOpacity
            onPress={() => setCommentModalVisible(true)}
            style={styles.actionButton}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#555" />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CommentModal
        postId={post.id}
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        onNewComment={handleNewComment}
      />
    </View>
  );
};

const LikeButton = ({ postId, likeCount }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);
  const { user } = useContext(UserContext);

  const toggleLike = async () => {
    if (liked) {
      setCount(count - 1);
      await supabase
        .from("wall_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      setCount(count + 1);
      await supabase
        .from("wall_likes")
        .insert([{ post_id: postId, user_id: user.id }]);
    }
    setLiked(!liked);
  };

  return (
    <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
      <Ionicons
        name={liked ? "thumbs-up" : "thumbs-up-outline"}
        size={22}
        color={liked ? "#007AFF" : "#B0B0B0"}
      />
      <Text style={styles.actionText}>{count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 4,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 8,
    marginVertical: 10,
    marginRight: 5,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    width: "95%",
    height: "200px",
    paddingBottom: 10,
    alignSelf: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
  },
  media: {
    width: "100px", // Ensures image fills the container's width
    height: "100%", // Adjust the height as needed
    aspectRatio: 1.5, // Adjust the aspect ratio to control the height of the image relative to the width
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "cover",
  },
  actions: {
    // thumps up btns
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 8,
    position: "absolute",
    marginBottom: 10,
    bottom: 10,
    left: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    maxWidth: 120,
  },
  actionText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  postActions: {
    // edit and delete btns
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    padding: 5,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  timeAgo: {
    fontSize: 12,
    color: "#888",
  },
  mediaContainer: {
    width: "100%",
    aspectRatio: 16 / 9, // Adjust aspect ratio as needed
    marginBottom: 8,
  },

  media: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
    resizeMode: "cover",
    alignSelf: "center", // centers the image horizontally
  },
});
export default WallPosts;   




