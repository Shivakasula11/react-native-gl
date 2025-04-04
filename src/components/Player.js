import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Implement your playback logic here
  };

  return (
    <View style={styles.playerContainer}>
      <Text style={styles.playerTitle}>Now Playing</Text>
      <Text style={styles.songTitle}>Song Title</Text>
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={togglePlayback} />
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Player;
