import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { AudioContext } from '../contexts/AudioContext';

const ProgressSlider = () => {
  const { playbackPosition, playbackDuration, isPlaying } = useContext(AudioContext);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (playbackDuration > 0) {
      setProgress(playbackPosition / playbackDuration);
    }
  }, [playbackPosition, playbackDuration]);

  if (!isPlaying) {
    return null;
  }

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(playbackPosition)}</Text>
      <Slider
        style={styles.slider}
        value={progress}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="springgreen"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
      />
      <Text style={styles.time}>{formatTime(playbackDuration)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  time: {
    color: 'black',
    fontSize: 10,
  },
});

export default ProgressSlider;
