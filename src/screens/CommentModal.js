import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { UserContext } from '../contexts/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icons

const CommentModal = ({ postId, visible, onClose, onNewComment }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const { user } = useContext(UserContext);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wall_comments')
      .select(`
        id, comment, created_at, edited_at, user_id,
        profiles(first_name, last_name)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible) fetchComments();

    const commentSubscription = supabase
      .channel('wall_comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wall_comments' }, (payload) => {
        setComments((prev) => [payload.new, ...prev]); // Optimistically update UI
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wall_comments' }, (payload) => {
        setComments((prev) => prev.map((comment) => comment.id === payload.new.id ? payload.new : comment));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'wall_comments' }, (payload) => {
        setComments((prev) => prev.filter((comment) => comment.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(commentSubscription);
    };
  }, [visible]);

  const submitComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('wall_comments')
      .insert([{ post_id: postId, comment: newComment, user_id: user.id }]);

    if (!error) {
      onNewComment(); // Update comment count
      setNewComment('');
    }
  };

  const updateComment = async () => {
    if (!editingComment || !editingComment.comment.trim()) return;

    const { error } = await supabase
      .from('wall_comments')
      .update({ 
        comment: editingComment.comment, 
        edited_at: new Date().toISOString() // Update the edited_at field
      })
      .eq('id', editingComment.id);

    if (!error) {
      setEditingComment(null); // Reset after editing
      onNewComment(); // Refresh comment list
    }
  };

  const deleteComment = async (commentId) => {
    const { error } = await supabase
      .from('wall_comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId)); // Optimistic update
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
  };

  const handleCancelEdit = () => {
    setEditingComment(null); // Reset editing state
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Comments</Text>

        {loading ? (
          <ActivityIndicator size="large" color="gray" />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentAuthor}>
                  {item.profiles?.first_name} {item.profiles?.last_name || ''}
                </Text>
                <Text style={styles.commentText}>
                  {item.comment}
                  {item.edited_at && <Text style={styles.editSign}> (Edited)</Text>}
                </Text>

                {item.user_id === user.id && (
                  <View style={styles.commentActions}>
                    <TouchableOpacity onPress={() => handleEditClick(item)}>
                      <Icon name="pencil" size={20} color="blue" style={styles.actionIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteComment(item.id)}>
                      <Icon name="trash" size={20} color="red" style={styles.actionIcon} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        )}

        {editingComment ? (
          <View style={styles.editContainer}>
            <TextInput
              value={editingComment.comment}
              onChangeText={(text) => setEditingComment({ ...editingComment, comment: text })}
              style={styles.input}
            />
            <Button title="Save" onPress={updateComment} />
            <Button title="Cancel" onPress={handleCancelEdit} />
          </View>
        ) : (
          <View style={styles.newCommentContainer}>
            <TextInput
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
              style={styles.input}
            />
            <Button title="Post" onPress={submitComment} />
          </View>
        )}

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  commentContainer: { marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  commentAuthor: { fontWeight: 'bold', fontSize: 16 },
  commentText: { fontSize: 14, marginVertical: 5 },
  editSign: { fontSize: 12, color: 'gray' },
  commentActions: { flexDirection: 'row', marginTop: 5 },
  actionIcon: { marginHorizontal: 5 },
  editContainer: { marginBottom: 10 },
  newCommentContainer: { marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  closeButton: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'blue' },
});

export default CommentModal;