import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { fetchSignedUrlFromSupabaseEdgeFunction } from '../services/WasabiClient';


/**
 * Takes cover_url and returns the local URI for the cover image
 * @param {*} url 
 * @returns 
 */
export const downloadAndgetLocalCoverUrl = async (cover_url) => {
    if (Platform.OS === 'web') {
      return cover_url; // No need to download on web
    }
  
    const fileName = cover_url.split('/').pop();
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        return fileUri;
      }

      const { cover_url: downloadedUri } = await FileSystem.downloadAsync(cover_url, fileUri);
      return downloadedUri;
    } catch (error) {
      return cover_url; // Fallback to original URI if download fails
    }
};

export const downloadAndGetLocalMediaFileUrl = async (path, file_url) => {

    if (file_url.startsWith('https://mldtimypnbudwihsnesc.supabase.co')) {
      let localUrl = cacheFileLocally(file_url);
      return localUrl;

    } else if (file_url.startsWith("https://s3.wasabisys.com")) {
      signedUrl = await fetchSignedUrlFromSupabaseEdgeFunction(path);
      return signedUrl;
    } else {
        console.error('Could not locate the file', path);
    }
};

export const updateTrackUrl = async (trackId) => {
    try {
      // Fetch the latest URL (You may need an API call or Supabase query)
      const updatedFileUrl = await fetchUpdatedUrl(trackId); // Implement this function
  
      // Update the track with the new URL
      await TrackPlayer.updateMetadataForTrack(trackId, {
        url: updatedFileUrl,
      });
    } catch (error) {
      console.error('Error updating track URL:', error);
    }
};

export const cacheFileLocally = async (fileUrl) => {
    if (Platform.OS === 'web') {
      return fileUrl; // No need to download on web
    }
  
    const fileName = fileUrl.split('/').pop();
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        return fileUri;
      }

      const { fileUrl: downloadedUri } = await FileSystem.downloadAsync(fileUrl, fileUri);
      return downloadedUri;
    } catch (error) {
      return fileUrl; // Fallback to original URI if download fails
    }
};

  


