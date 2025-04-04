import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const tabs = [
    { name: 'Music', route: 'Music', image: require('../../../assets/music-background.png') },
    { name: 'Kids Stories', route: 'KidsStories', image: require('../../../assets/stories-background.png') },
    // { name: 'Recent Played', route: 'RecentPlayed', image: require('../../assets/recent.jpg') },
    // { name: 'Bible Promises', route: 'BiblePromise', image: require('../../assets/bible.jpg') },
    // { name: 'Music Admin', route: 'MusicAdmin', image: require('../../assets/music.jpg') }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.box}
            onPress={() => navigation.navigate(tab.route)}
          >
            <ImageBackground source={tab.image} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
              <Text style={styles.boxText}>{tab.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#085b87',
    justifyContent: 'top',
    alignItems: 'center',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '45%',
    height: 150,
    marginVertical: 10,
    marginHorizontal: '2.5%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 10,
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default HomeScreen;
