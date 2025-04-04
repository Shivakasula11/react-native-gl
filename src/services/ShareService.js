import { Share } from 'react-native';

export const handleShare = async (id, title, artist, url, artwork) => { 
    try {
      const message = `🎵 Now listening to "${title}" by ${artist}. Listen here: ${url}`;
      
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
};