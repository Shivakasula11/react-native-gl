import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { Icon } from 'react-native-elements';

const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const soundRef = useRef(new Audio.Sound());

  // useEffect(() => {
  //   fetchTracks();
  //   return () => {
  //     soundRef.current.unloadAsync();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (currentTrack) {
  //     playCurrentTrack();
  //   }
  // }, [currentTrack]);

  const fetchTracks = async () => {
    const { data, error } = await supabase.storage.from('music').list('');
    if (error) {
      console.error('Error fetching tracks:', error);
      
    } else {
      console.log('Fetched tracks:', data);
      console.log(supabase.storage.from('music').getPublicUrl(data[0].name).data.publicUrl);
      //console.log(supabase.storage.from('music').getPublicUrl(data[0].name).publicURL);
      const trackUrls = data.map(file => ({
        name: file.name,
        url: supabase.storage.from('music').getPublicUrl(file.name).data.publicUrl,
        cover: require('../../assets/music-player-backround.png'), // Replace with actual cover URL if available
      }));
      setTracks(trackUrls);
      if (trackUrls.length > 0) {
        setCurrentTrack(trackUrls[0]);
      }
    }
  };

  useEffect(() => {
    fetchTracks();
    return soundRef.current ? () => soundRef.current.unloadAsync() : undefined;
  }, []);

  // Existing fetchTracks function remains unchanged

  const playCurrentTrack = async () => {
    try {
      await soundRef.current.unloadAsync();
      await soundRef.current.loadAsync({ uri: currentTrack.url });
      await soundRef.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const stopPlayback = async () => {
    try {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex(track => track.url === currentTrack.url);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    playCurrentTrack();
  };

  const prevTrack = () => {
    const currentIndex = tracks.findIndex(track => track.url === currentTrack.url);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    playCurrentTrack();
  };

  const onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      setPlaybackProgress(status.positionMillis / status.durationMillis);
      if (status.didJustFinish) {
        nextTrack();
      }
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    soundRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  }, [currentTrack]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <TouchableOpacity onPress={prevTrack}>
          <Icon name="skip-previous" size={30} color="#4F8EF7" />
        </TouchableOpacity>
        {isPlaying ? (
            <Button title="Stop" onPress={stopPlayback} />
          ) : (
            <Button title="Play" onPress={playCurrentTrack} />
          )
        }
        <TouchableOpacity onPress={nextTrack}>
          <Icon name="skip-next" size={30} color="#4F8EF7" />
        </TouchableOpacity>
      </View>
      <Slider
        style={styles.progress}
        value={playbackProgress}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <Text>{currentTrack ? currentTrack.name : 'No track selected'}</Text>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  progress: {
    width: '80%',
    height: 40,
  },
});

export default MusicPlayer;
