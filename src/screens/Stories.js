import { Dimensions, Platform } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AudioContext } from '../contexts/AudioContext';

const windowWidth = Dimensions.get('window').width;

const MusicItem = ({ id, title, cover, audioUrl }) => {
  const {
    playSound,
    pauseSound,
    stopSound,
    togglePlayback,
    isPlaying,
    currentAudioUrl,
  } = useContext(AudioContext);

  // const togglePlayback = () => {
  //   if (isPlaying &&  currentAudioUrl === audioUrl) {
  //     stopSound();
  //   } else {
  //     playSound(audioUrl);
  //   }
  // };

  return (
    <View key={id} style={[styles.musicFileContainer, Platform.OS === 'web' && styles.webMusicFileContainer]}>
      {typeof cover === 'string' ? (
        <Image source={{ uri: cover }} style={styles.coverImage} />
      ) : (
        <Image source={cover} style={styles.coverImage} />
      )}
      {audioUrl && (
        <TouchableOpacity
          onPress={() => togglePlayback(audioUrl)}
          style={[styles.playButton, { padding: 10, position: 'absolute', right: 10, bottom: 10, zIndex: 1 }]}>
          {isPlaying && currentAudioUrl === audioUrl ? (
            <MaterialIcons name="stop" size={30} color="#000" />
          ) : (
            <MaterialIcons name="play-arrow" size={30} color="#000" />
          )}
        </TouchableOpacity>
      )}
      <View style={styles.titleOverlay}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  );
};


const fetchMusicFiles = () => {
  return Promise.resolve([
    // { id: 1, title: 'The Good neighbour', cover: require('../../assets/tree.png'), audioUrl: 'https://mldtimypnbudwihsnesc.supabase.co/storage/v1/object/public/stories/A%20Good%20Neibour.m4a' },
    { id: 2, title: 'The Love of Jesus', cover: '../../assets/Screenshot 2024-07-12 at 10.27.10 PM.png', audioUrl: 'https://mldtimypnbudwihsnesc.supabase.co/storage/v1/object/public/stories/SthuthinchiPaadedam.mp3' },
    { id: 3, title: 'Jesus Died For Us', cover: require('../../assets/jesus-died-for-us.png') },
    { id: 4, title: 'Story 4', cover: '../../assets/GameGraphic.jpg' },
    { id: 5, title: 'The Love of Jesus', cover: '../../assets/Screenshot 2024-07-12 at 10.27.10 PM.png' },
    { id: 6, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 7, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 8, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 9, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 10, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
  ]);
};

const fetcKidsStories = () => {
  return Promise.resolve([
    { id: 1, title: 'The Good Neighbour', cover: require('../../assets/jesus-with-kids.png'), audioUrl: 'https://mldtimypnbudwihsnesc.supabase.co/storage/v1/object/public/stories/A%20Good%20Neibour.m4a' },
    { id: 2, title: 'Daniel in Lion\'s Den', cover: '../../assets/Daniel-in-lions-den.png' },
    { id: 3, title: 'Jesus Died For Us', cover: require('../../assets/jesus-died-for-us.png') },
    { id: 4, title: 'Story 4', cover: '../../assets/GameGraphic.jpg' },
    { id: 5, title: 'The Love of Jesus', cover: '../../assets/Screenshot 2024-07-12 at 10.27.10 PM.png' },
    { id: 6, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 7, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 8, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 9, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
    { id: 10, title: 'Story 6', cover: 'https://example.com/cover3.jpg' },
  ]);
};

const Stories = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [kidsStories, setKidStories] = useState([]);

  useEffect(() => {
    fetchMusicFiles().then(files => {
      setMusicFiles(files);
    });

    fetcKidsStories().then(files => {
      setKidStories(files);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation</Text>
      <ScrollView style={[styles.scrollContainer, Platform.OS === 'web' && styles.webScrollContainer]} horizontal={true}>
        {musicFiles.map(file => (
          <MusicItem key={file.id} {...file} />
        ))}
      </ScrollView>

      <Text style={styles.title}>Kids Stories</Text>
      <ScrollView style={[styles.scrollContainer, Platform.OS === 'web' && styles.webScrollContainer]} horizontal={true} showsHorizontalScrollIndicator={Platform.OS !== 'web'}>
        {kidsStories.map(file => (
          <MusicItem key={file.id} {...file} />
        ))}
      </ScrollView>

      <Text style={styles.title}>Recent Played</Text>
      <ScrollView style={[styles.scrollContainer, Platform.OS === 'web' && styles.webScrollContainer]} horizontal={true} showsHorizontalScrollIndicator={Platform.OS !== 'web'}>
        {musicFiles.map(file => (
          <View key={file.id} style={[styles.musicFileContainer, Platform.OS === 'web' && styles.webMusicFileContainer]}>
            {typeof file.cover === 'string' ? (
              <Image source={{ uri: file.cover }} style={styles.coverImage} />
            ) : (
              <Image source={file.cover} style={styles.coverImage} />
            )}
            <View style={styles.titleOverlay}>
              <Text style={styles.titleText}>{file.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#085b87',
    paddingBottom: 20,
    paddingHorizontal: 0,
    paddingVertical: 20,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  webScrollContainer: {
    overflowX: 'auto',
    paddingHorizontal: 0,
  },
  musicFileContainer: {
    width: Platform.OS === 'web' ? '20%' : '10%',
    height: '100%',
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    overflow: 'hidden',
  },
  webMusicFileContainer: {
    display: 'inline-block',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  titleOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  titleText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'left',
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    zIndex: 1,
  },
});

export default Stories;