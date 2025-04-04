import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Slider } from 'react-native';
import { AudioContext } from '../contexts/AudioContext';

const ExMusicPlayer = () => {
  const {
    playSound,
    pauseSound,
    stopSound,
    isPlaying,
    currentTrack,
    playbackPosition,
    playbackDuration
  } = useContext(AudioContext);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (playbackDuration > 0) {
      setProgress((playbackPosition / playbackDuration) * 100);
    }
  }, [playbackPosition, playbackDuration]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Player</Text>
      {currentTrack ? (
        <Text style={styles.trackTitle}>{currentTrack}</Text>
      ) : (
        <Text style={styles.trackTitle}>No track selected</Text>
      )}

      <Slider
        style={styles.progressBar}
        value={progress}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
      />

      <View style={styles.controls}>
        <Button title={isPlaying ? "Pause" : "Play"} onPress={isPlaying ? pauseSound : () => playSound(currentTrack)} />
        <Button title="Stop" onPress={stopSound} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#085b87',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 40,
    marginVertical: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});
export default ExMusicPlayer;
