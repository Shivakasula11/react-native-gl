import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PostForm from './PostsForm';
import WallPosts from './WallPosts'; // Extracted Wall posts display logic
import { LinearGradient } from 'expo-linear-gradient';

const WallScreen = () => {
  const [refresh, setRefresh] = useState(false);

  return (
  <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.gradientBackground} >
    <View style={styles.container}>
    <ScrollView>
      <PostForm onPostCreated={() => setRefresh(!refresh)} />
      <WallPosts refresh={refresh} />
    </ScrollView>
    </View>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject, // Covers entire screen
    position: 'absolute', // Stays behind content
  },
});

export default WallScreen;