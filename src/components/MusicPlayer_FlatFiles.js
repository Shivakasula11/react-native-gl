import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '../services/supabase-db/SupabaseClient';

const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(new Audio.Sound());

  useEffect(() => {
    fetchTracks();
    return () => {
      soundRef.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (currentTrack) {
      playCurrentTrack();
    }
  }, [currentTrack]);

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

  const playCurrentTrack = async () => {
    try {
      await soundRef.current.unloadAsync();
      await soundRef.current.loadAsync({ uri: currentTrack.url });
      await soundRef.current.playAsync();
      setIsPlaying(true);
      soundRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const onPlaybackStatusUpdate = status => {
    if (status.didJustFinish) {
      playNextTrack();
    }
  };

  const playNextTrack = () => {
    const currentIndex = tracks.findIndex(track => track.url === currentTrack.url);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Player</Text>
      {currentTrack && (
        <View style={styles.currentTrackContainer}>
          <Image source={{ uri: currentTrack.cover }} style={styles.coverImage} />
          <Text style={styles.trackName}>{currentTrack.name}</Text>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <Text style={styles.playPauseButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={tracks}
        keyExtractor={item => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setCurrentTrack(item)} style={styles.trackContainer}>
            <Image source={{ uri: item.cover }} style={styles.trackCoverImage} />
            <Text style={styles.trackName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currentTrackContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  trackName: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  playPauseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff6f00',
    borderRadius: 5,
  },
  playPauseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  trackCoverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default MusicPlayer;
