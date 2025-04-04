import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Platform } from 'react-native';
import PromiseView from './PromiseView';
import { getBiblePromise } from '../../services/supabase-db/BiblePromisesService';

const windowWidth = Dimensions.get('window').width;

const fetchBiblePromise = async () => {
  try {
    const promiseResult = await getBiblePromise(); // Wait for the promise to resolve
    return { text: promiseResult }; // Return the resolved value
  } catch (error) {
    console.error("Failed to fetch Bible promise:", error);
    return { text: "Error fetching promise" }; // Handle any errors
  }
};

const BiblePromise = () => {
  const [promise, setPromise] = useState(null); // Step 2: Initialize state

  useEffect(() => { // Step 3: Fetch the Bible promise on component mount
    fetchBiblePromise().then(fetchedPromise => {
      setPromise(fetchedPromise.text); // Assuming getBiblePromise() returns a string
    });
  }, []);
  

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {promise ? ( // Step 4: Conditionally render the fetched promise
          <ImageBackground
            source={require('../../../assets/pexels-pacific-3783385.jpg')}
            style={styles.backgroundImage} imageStyle={styles.imageStyle}
          >
            <View style={styles.centered}>
              <Text style={styles.promiseText}>{promise}</Text>
            </View>
          </ImageBackground>
        ) : (
          <Text>Loading Promise...</Text> // Display a loading message or spinner
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 365,
    height: 233,
    alignItems: 'center',
    padding: 1,
    marginRight: 10,
    backgroundColor: '#cfe6d3',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%', // Ensure full width
    height: '100%', // Fixed height or use aspect ratio for responsiveness
    justifyContent: 'flex-end', // Align text to bottom
    // Web-specific adjustments (if using React Native Web or similar)
    ...Platform.select({
      web: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      },
    }),
    
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 10, // Ensure the image has rounded corners if desired
    borderColor: '#fff',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFF00',
    textShadowColor: '#000',
    textAlign: 'center',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
});

export default BiblePromise;
