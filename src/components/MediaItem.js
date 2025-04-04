import { Dimensions, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

const MediaItem = ({ item, index, mediaFiles, onItemPress }) => {
  const [localCoverUri, setLocalCoverUri] = useState(null);

  useEffect(() => {
    if (item?.cover_url) {
      fetchCoverImage();
    }
  }, [item?.cover_url]);

  const fetchCoverImage = async () => {
    const localUri = await getLocalCoverUri(item.cover_url);
    setLocalCoverUri(localUri);
  };

  const getLocalCoverUri = async (uri) => {
    if (Platform.OS === 'web') {
      return uri; // No need to download on web
    }

    const fileName = uri.split('/').pop();
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        return fileUri;
      }

      const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri);
      return downloadedUri;
    } catch (error) {
      console.error('Error downloading cover:', error);
      return uri; // Fallback to original URI if download fails
    }
  };

  return (
    <Pressable 
      onPress={() => onItemPress(item, index, mediaFiles)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]} // Press effect
    >
      <View style={styles.itemContainer}>
        {/* Image with a subtle gradient for better text visibility */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: localCoverUri || item.cover_url }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.itemSubText} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
        </View>

        {/* Play Button with a better touch area */}
        <Pressable style={styles.playButton}>
          <Icon name="play-circle-fill" size={25} color="#1DB954" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: 180,
    height: 160, 
    alignItems: 'center',
    padding: 2,
    marginRight: 10,
    backgroundColor: '#cfe6d3',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  // imageOverlay: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  // },
  textContainer: {
    width: '100%', 
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 0, // More space for text
  },
  itemText: {
    fontSize: 12, 
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },
  itemSubText: {
    fontSize: 11, 
    color: '#666',
    textAlign: 'center',
    width: '100%',
  },
  playButton: {
    position: 'absolute',
    right: 0,
    bottom: 35,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)', // Soft background
    borderRadius: 20,
    padding: 0,
  },
});

export default MediaItem;