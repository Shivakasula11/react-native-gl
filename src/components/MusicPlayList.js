import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av'; // Assuming Expo's Audio library for playback

const MusicPlayList = () => {
  const [playlist, setPlaylist] = useState([
    'track1.mp3', // Replace with actual music file URLs or paths
    'track2.mp3',
    // Add more tracks as needed
  ]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playTrack = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: playlist[currentTrackIndex] },
      { shouldPlay: true }
    );
    setSound(newSound);
    setIsPlaying(true);
    await newSound.playAsync();

    newSound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        nextTrack();
      }
    });
  };

  const pauseTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const nextTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    playTrack();
  };

  const prevTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
    );
    playTrack();
  };

  return (
    <View>
      <TouchableOpacity onPress={isPlaying ? pauseTrack : playTrack}>
        <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={nextTrack}>
        <Text>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={prevTrack}>
        <Text>Previous</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MusicPlayList;