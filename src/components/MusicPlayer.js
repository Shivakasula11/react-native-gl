import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Dimensions, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import {getWasabiFileUrl, fetchSignedUrlFromSupabaseEdgeFunction} from '../services/WasabiClient';

const MusicPlayer = ({ isVisible, onClose, currentIndex, files, isCollapsed, onToggleCollapse }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(currentIndex);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState([files]);
  const soundRef = useRef(null);
  const [localCoverUri, setLocalCoverUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentTrack = isShuffle ? shuffledPlaylist[currentTrackIndex] : currentPlaylist[currentTrackIndex];

  useEffect(() => {
    setCurrentTrackIndex(currentIndex);
    setCurrentPlaylist(files);
  }, [currentIndex, files]);

  useEffect(() => {
    if (currentTrack) {
        setupPlayer();
        fetchCoverImage();
        updateMediaSession();
    }

    return () => {
        if (soundRef.current) {
            soundRef.current.unloadAsync().then(() => {
                console.log('Sound unloaded successfully');
            }).catch(error => {
                console.error('Error unloading sound:', error);
            });
        }
    };
}, [currentTrackIndex,currentTrack]);

  useEffect(() => {
    if (Platform.OS === 'android') {
        const interval = setInterval(() => {
            if (soundRef.current) {
                soundRef.current.getStatusAsync().then((status) => {
                    if (status.isLoaded) {
                        setPosition(status.positionMillis);
                        setDuration(status.durationMillis || 1);
                    }
                });
            }
        }, 250); // ✅ Update every second for Android

        return () => clearInterval(interval);
    }
  }, [sound]);

  const setupPlayer = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
      });
      if (sound) {
        try {
          await sound.unloadAsync();
        } catch (error) {}
      }

      if (currentTrack && currentTrack.file_url) {
        setIsLoading(true);
        const localUri = await getLocalUri(currentTrack.file_path, currentTrack.file_url);
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: localUri },
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );
          setSound(newSound);
          soundRef.current = newSound;
          setIsPlaying(true);
          newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        } catch (error) {
          console.log('Error setting up new sound:', error);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

const onPlaybackStatusUpdate = (status) => {
  if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 1);
      setIsPlaying(status.isPlaying);

      // ✅ Check if playback finished and move to next track manually
      if (status.didJustFinish && !status.isLooping) {
        playNext();
    }
  }
};

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const updateMediaSession = () => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.name,
        artwork: [
          { src: currentTrack.cover_url || '', sizes: '512x512', type: 'image/png' }
        ]
      });
    }
  };


  const playPrevious = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex === 0 ? files.length - 1 : prevIndex - 1));
  };

  const playNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex === files.length - 1 ? 0 : prevIndex + 1));
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      setShuffledPlaylist(shuffleArray([...files]));
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleBackPress = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
    
    onClose();
  };

  const seekTo = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const fetchCoverImage = async () => {
    if (currentTrack?.cover_url) {
      const localUri = await getLocalCoverUri(currentTrack.cover_url);
      setLocalCoverUri(localUri);
    }
  };

  const getLocalUri = async (uri, file_url) => {
    if (file_url.startsWith('https://mldtimypnbudwihsnesc.supabase.co')) {
      console.log('File is hosted on Supabase:', file_url);
      return file_url;
    } else if (file_url.startsWith("https://s3.wasabisys.com")) {
      console.log('File is hosted on Wasabi:', file_url);
      return fetchSignedUrlFromSupabaseEdgeFunction(uri);
    } else {
      console.log('Could not locate the file', uri);
    }

    //TODO: Investigate the logic implemneted previously and resolve issue downloading the file from wasabi
    //Implement the logic to download the file to the local storage
    // if (Platform.OS === 'web') {
    //   console.log('getLocalUri');
    //   return fetchSignedUrlFromSupabaseEdgeFunction('files/song/Prana_Priyuda_copy.mp3')
    //   // return "https://s3.wasabisys.com/test-gl/files/song/Prana_Priyuda_copy.mp3?AWSAccessKeyId=CO7SVMLFH759QOMPGKAB&Expires=1738352747&Signature=z7bqPOBh4V0R5%2BTrY%2BXAJ7Leaeo%3D";
    // }
  
    // const fileName = uri.split('/').pop();
    // const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
    // const { exists } = await FileSystem.getInfoAsync(fileUri);
    // if (exists) {
    //   console.log('File already exists:', fileUri);
    //   return fileUri;
    // }
    // console.log('Downloading file:', uri);
    // const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri);
    // return downloadedUri;
  };

  const getLocalCoverUri = async (uri) => {
    if (Platform.OS === 'web') {
      return uri; // No need to download on web
    }
  
    const fileName = uri.split('/').pop();
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        return fileUri;
      }

      const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri);
      return downloadedUri;
    } catch (error) {
      return uri; // Fallback to original URI if download fails
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={isCollapsed ? styles.collapsedContainer : styles.expandedContainer}>

      {isCollapsed ? (
        <Pressable onPress={onToggleCollapse}>
          {currentTrack && (
            <View style={styles.collapsedContent}>
              {currentTrack.cover_url && (
                <Image source={{ uri: localCoverUri || currentTrack.cover_url }} style={styles.collapsedCoverImage} />
              )}
              <View style={styles.collapsedTextContainer}>
                <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">{currentTrack.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">{currentTrack.name}</Text>
              </View>
              <Pressable onPress={togglePlayback} style={styles.playButton}>
                <Icon name={isPlaying ? "pause" : "play-arrow"} size={40} color="#1DB954" />
              </Pressable>
              <Pressable style={styles.closeButton} onPress={handleBackPress}>
                <Icon name="close" size={20} color="#fff" />
              </Pressable>
            </View>
          )}
        </Pressable>
      ) : (
        
        <View style={styles.sheetContent}>
      <Pressable style={styles.collapseButton} onPress={onToggleCollapse}>
        <Icon name={!isCollapsed ? "expand-more" : ""} size={40} color="#fff" />
      </Pressable>
      <Pressable style={styles.closeButton} onPress={handleBackPress}>
        <Icon name="close" size={20} color="#fff" />
      </Pressable>
          {currentTrack && (
            <>
              {currentTrack.cover_url && (
                <Image source={{ uri: localCoverUri || currentTrack.cover_url }} style={styles.coverImage} />
              )}
              <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">{currentTrack.title}</Text>
              <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">{currentTrack.name}</Text>
              <Slider
                style={styles.slider}
                value={position}
                minimumValue={0}
                maximumValue={duration > 0 ? duration : 1} 
                onSlidingStart={() => setIsPlaying(false)}  // Pause while seeking
                onSlidingComplete={(value) => {
                  seekTo(value);
                  setIsPlaying(true); // Resume after seeking
                }}
              />
              <View style={styles.controls}>
                <Pressable onPress={toggleShuffle}>
                  <Icon name="shuffle" size={50} color={isShuffle ? "#1DB954" : "#888"} />
                </Pressable>
                <Pressable onPress={isLoading ? null : playPrevious}>
                <Icon name="skip-previous" size={50} color={isLoading ? "#888" : "#1DB954"} />
              </Pressable>
                <Pressable onPress={togglePlayback}>
                  <Icon name={isPlaying ? "pause-circle-filled" : "play-circle-filled"} size={50} color="#1DB954" />
                </Pressable>
                <Pressable onPress={isLoading ? null : playNext}>
                <Icon name="skip-next" size={50} color={isLoading ? "#888" : "#1DB954"} />
              </Pressable>

                <Pressable onPress={toggleAutoPlay}>
                  <Icon name="autorenew" size={50} color={isAutoPlay ? "#1DB954" : "#888"} />
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  expandedContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? '0%' : '0%',
    width: '100%',
    height: '100%',
    backgroundColor: '#0e2113',
    borderTopEndRadius: 0,
    borderTopLeftRadius: 0,
    overflow: 'hidden',
  },
  collapsedContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? '7%' : '7%',
    width: '100%',
    backgroundColor: '#0e2113',
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
  },
  collapseButton: {
    alignSelf: 'left',
    marginTop: 0,
    marginLeft: 0,
    paddingLeft: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  sheetContent: {
    alignItems: 'center',
    padding: 5,
    height: '100%',
    top: 30,
  },
  coverImage: {
    width: '89%',
    height: '38%',
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  songArtist: {
    fontSize: 14,
    color: '#fff',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 120,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 0,
    marginTop: 20,
  },
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 30,
    height: '90%',
    paddingTop: 10,
  },
  collapsedCoverImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    paddingLeft: 30,
    bottom: 10,
  },
  collapsedTextContainer: {
    flex: 1,
    marginLeft: 30,
    bottom: 20,
    width: '100%',
    height: '100%',
    paddingTop: 5,
  },
  playButton: {
    marginLeft: 10,
    bottom: 12,
  },
});

export default MusicPlayer;