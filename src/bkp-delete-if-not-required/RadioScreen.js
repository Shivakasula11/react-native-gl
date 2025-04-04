import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const lastPlayedTracksData = [
  { id: 1, title: 'Track 1', artist: 'Artist 1' },
  { id: 2, title: 'Track 2', artist: 'Artist 2' },
  { id: 3, title: 'Track 3', artist: 'Artist 3' },
];

const RadioScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    setupPlayer();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const setupPlayer = async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: 'https://a9.asurahosting.com:8060/radio.mp3' },
        { shouldPlay: false }
      );
      setSound(audioSound);
    } catch (error) {
      console.error('Failed to load sound', error);
    }
  };

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderTrackItem = ({ item }) => (
    <View style={styles.trackItem}>
      <Text>{item.title}</Text>
      <Text>{item.artist}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GodLync Streaming</Text>
      </View>
      <View style={styles.player}>
        <Button title={isPlaying ? 'Pause' : 'Play'} onPress={togglePlayback} />
      </View>
      <View style={styles.lastPlayed}>
        <Text style={styles.sectionTitle}>Last Played Tracks</Text>
        <FlatList
          data={lastPlayedTracksData}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>GodLync All rights reserved 2024</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
    marginTop: 50,
    height: 100,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  player: {
    alignItems: 'center',
    margin: 20,
  },
  lastPlayed: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  trackItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  footer: {
    padding: 20,
    backgroundColor: '#6200ee',
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default RadioScreen;
