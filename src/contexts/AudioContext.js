import React, { createContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Utility function to get a local file path
const getLocalUri = async (uri) => {
  if (Platform.OS === 'web') {
    return uri;
  }

  const fileName = uri.split('/').pop();
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

  const { exists } = await FileSystem.getInfoAsync(fileUri);
  if (exists) {
    console.log('File already exists:', fileUri);
    return fileUri;
  }

  const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri);
  return downloadedUri;
};

const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  };

  const playSound = async (uri) => {
    const localUri = await getLocalUri(uri);
    console.log('isPlaying:', isPlaying);
    console.log('sound:', sound);
    try {
      if (isPlaying && sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
    } catch (error) {
      console.error('Failed to stop sound:', error);
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: localUri },
      {},
      onPlaybackStatusUpdate
    );
    setSound(newSound);
    setCurrentTrack(uri);
    setCurrentAudioUrl(uri);
    console.log('currentAudioUrl:', currentAudioUrl);
    await newSound.playAsync();
    setIsPlaying(true);
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      try {
        if (isPlaying) {
          await sound.stopAsync();
        }
        await sound.unloadAsync();
      } catch (error) {
        console.error('Failed to stop sound:', error);
      }
      setIsPlaying(false);
      setCurrentAudioUrl(null);
    }
  };

  const togglePlayback = (audioUrl) => {
    if (isPlaying &&  currentAudioUrl === audioUrl) {
      stopSound();
    } else {
      playSound(audioUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <AudioContext.Provider
      value={{
        playSound,
        pauseSound,
        stopSound,
        togglePlayback,
        isPlaying,
        currentTrack,
        playbackPosition,
        playbackDuration,
        currentAudioUrl,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext, AudioProvider };
