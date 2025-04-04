// BiblePromise.js
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import PromiseView from './PromiseView';

const fetchBiblePromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope. - Jeremiah 29:11'
      });
    }, 0);
  });
};

const BiblePromise = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <PromiseView
          promise={fetchBiblePromise()}
          renderSuccess={(data) => (
            <ImageBackground
              source={require('../../assets/pexels-pacific-3783385.jpg')} // Use require to load the image from assets
              style={styles.backgroundImage}
            >
              <View style={styles.centered}>
                <Text style={styles.promiseText}>{data.text}</Text>
              </View>
            </ImageBackground>
          )}
          renderError={(error) => (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to make the text more readable
    borderRadius: 10,
  },
  promiseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'serif', // Use a stylish font
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
});

export default BiblePromise;
