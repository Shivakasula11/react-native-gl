import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Share, Platform } from 'react-native';
import TrackPlayer, { usePlaybackState, useProgress, State } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import { setupPlayer, addTracks } from '../services/TrackPlayerService';
import { downloadAndgetLocalCoverUrl, downloadAndGetLocalMediaFileUrl } from '../services/FileService';

const MusicPlayerMobile = ({ isVisible, onClose, currentIndex, files, isCollapsed, onToggleCollapse }) => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  
  
  useEffect(() => {
    async function initializePlayer() {
      try {
        if (!files || files.length === 0) return;

        // console.log('Setting up player...');
        // await setupPlayer();  // Ensure the player is set up before adding tracks

        // console.log('Adding tracks...');
        const tracks = await Promise.all(
          files.map(async (file) => {
            let localUrl = await downloadAndGetLocalMediaFileUrl(file.file_path, file.file_url);
            // console.log('Local URL:', localUrl);
        
            // Fallback if local URL is not valid
            if (!localUrl || typeof localUrl !== 'string') {
              localUrl = file.file_url;
            }

            let localCoverUrl = await downloadAndgetLocalCoverUrl(file.cover_url);
            // console.log('Local cover URL:', localCoverUrl);

            if (!localCoverUrl || typeof localCoverUrl !== 'string') {
              localCoverUrl = file.cover_url;
            }
        
            return {
              id: String(file.id),
              url: localUrl,
              title: file.title || 'Unknown Title',
              artist: file.name || 'Unknown Artist',
              artwork: localCoverUrl,
            };
          })
        );
        
        await addTracks(tracks);

        // console.log('Skipping to track:', currentIndex);
        await TrackPlayer.skip(currentIndex);
        await TrackPlayer.play();
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    }

    if (isVisible) {
      initializePlayer();
    }

    return () => {
      // console.log('Stopping and resetting player');
      TrackPlayer.stop();
      TrackPlayer.reset();
    };
  }, [files, currentIndex, isVisible]);

  useEffect(() => {
    async function updateCurrentTrack() {
      try {
        const trackIndex = await TrackPlayer.getCurrentTrack();
        if (trackIndex !== null) {
          const queue = await TrackPlayer.getQueue();
          // console.log('Current track:', queue[trackIndex]);
          setCurrentTrack(queue[trackIndex]);
        }
      } catch (error) {
        console.error('Error fetching current track:', error);
      }
    }
    updateCurrentTrack();

    if (playbackState.state === State.Playing){
      setIsPlaying(true);
    }
    else{
      setIsPlaying(false);
    }
  }, [playbackState]);

  const togglePlayback = async () => {
    try {
      const currentState = await TrackPlayer.getState();
      // console.log('Current playback state before toggle:', currentState);
  
      if (currentState === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      } 
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };
  
  // // Log playback state changes
  // useEffect(() => {
  //   if (playbackState.state === State.Playing){
  //     setIsPlaying(true);
  //   }
  //   else{
  //     setIsPlaying(false);
  //   }
  // }, [playbackState]);

  const handleBackPress = async () => {
    console.debug('Closing player and stopping playback');
    await TrackPlayer.stop();
    onClose();
  };

  const handleShare = async () => {
    try {
      if (!currentTrack) return;
  
      const trackData = files.find(file => String(file.id) === currentTrack.id);
      // console.log('Sharing track:', currentTrack.id);
      // console.log('files:', trackData);
      const message = `🎵 Now listening to "${trackData.title}" by ${trackData.name}. Listen here: ${trackData.file_url}`;
      
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFavorite = async () => {

  };

  if (!isVisible) return null;

  return (
    <View style={isCollapsed ? styles.collapsedContainer : styles.expandedContainer}>
      {isCollapsed ? (
        <Pressable onPress={onToggleCollapse}>
          {currentTrack && (
            <View style={styles.collapsedContent}>
              {currentTrack.artwork && (
                <Image source={{ uri: currentTrack.artwork }} style={styles.collapsedCoverImage} />
              )}
              <View style={styles.collapsedTextContainer}>
                <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">
                  {currentTrack.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">
                  {currentTrack.artist}
                </Text>
              </View>
              <Pressable onPress={togglePlayback}>
                <Icon 
                  name={isPlaying ? 'pause' : 'play-arrow'} 
                  size={50} 
                  color="#1DB954" 
                />
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
            <Icon name="expand-more" size={40} color="#fff" />
          </Pressable>
          <Pressable style={styles.closeButton} onPress={handleBackPress}>
            <Icon name="close" size={20} color="#fff" />
          </Pressable>

          {currentTrack && (
            <>
              <Image source={{ uri: currentTrack.artwork }} style={styles.coverImage} />
              <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">{currentTrack.title}</Text>
              <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">{currentTrack.artist}</Text>
              <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton} onPress={handleFavorite}>
                  <Icon name="favorite-border" size={30} color="#1DB954" />
                </Pressable>
                <Pressable style={styles.actionButton} onPress={handleShare} >
                  <Icon name="share" size={30} color="#1DB954" />
                </Pressable>
              </View>
              <Slider
                  style={styles.slider}
                  value={progress.position}
                  minimumValue={0}
                  maximumValue={progress.duration || 1}
                  onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
                />
              <View style={styles.controls}>
                <Pressable onPress={() => TrackPlayer.skipToPrevious()}>
                  <Icon name="skip-previous" size={50} color="#1DB954" />
                </Pressable>
                <Pressable onPress={togglePlayback}>
                  <Icon 
                    name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'} 
                    size={50} 
                    color="#1DB954" 
                  />
                </Pressable>
                <Pressable onPress={() => TrackPlayer.skipToNext()}>
                  <Icon name="skip-next" size={50} color="#1DB954" />
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
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#0e2113',
  },
  collapsedContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? '7%' : Platform.OS === 'ios' ? '8.5%' : '6%',
    width: '100%',
    backgroundColor: '#0e2113',
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },
  collapseButton: {
    alignSelf: 'flex-start',
    margin: 10,
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
    marginTop: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
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
  },
  collapsedTextContainer: {
    flex: 1,
    marginLeft: 30,
  },
  playButton: {
    marginLeft: 10,
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%', // Adjust width to fit content
    marginTop: 140, // Adjust spacing from cover image
    marginBottom: 0, // Spacing before controls
  },
  actionButton: {
    marginHorizontal: 30, // Spacing between icons
  },

});

export default MusicPlayerMobile;
