// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import MusicPlayer from '../components/MusicPlayer';
// import MusicBrowser from '../components/MusicBrowser';

// const MusicScreen = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isPlayerVisible, setPlayerVisible] = useState(false);
//   const [isPlayerCollapsed, setPlayerCollapsed] = useState(true);
//   const [musicFiles, setMusicFiles] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleItemPress = (file, index) => {
//     setSelectedFile(file);
//     setPlayerVisible(true);
//     setPlayerCollapsed(false);
//     setCurrentIndex(index);
//   };

//   const togglePlayerCollapse = () => {
//     setPlayerCollapsed(!isPlayerCollapsed);
//   };

//   return (
//     <View style={styles.container}>
//       <MusicBrowser onItemPress={handleItemPress} setMusicFiles={setMusicFiles} />
//       {/* {selectedFile && (
//         <MusicPlayer
//           isVisible={isPlayerVisible}
//           onClose={() => setPlayerVisible(false)}
//           file={selectedFile}
//           files={musicFiles}
//           currentIndex={currentIndex}
//           isCollapsed={isPlayerCollapsed}
//           onToggleCollapse={togglePlayerCollapse}
//         />
//       )} */}
//     </View>
//   );
// };

// // Define styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#085b87',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   subHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   section: {
//     marginBottom: 20,
//   },
// });

// export default MusicScreen;
