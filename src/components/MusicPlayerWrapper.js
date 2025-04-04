import { Platform } from 'react-native';

const MusicPlayer = Platform.OS === 'web'
  ? require('./MusicPlayer').default
  : require('./MusicPlayerMobile').default;

export default MusicPlayer;