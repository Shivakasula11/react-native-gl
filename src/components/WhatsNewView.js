import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { getBiblePromise } from '../services/supabase-db/BiblePromisesService';

const fetchBiblePromise = async () => {
  try {
    const promiseResult = await getBiblePromise(); // Wait for the promise to resolve
    return { text: promiseResult }; // Return the resolved value
  } catch (error) {
    console.error("Failed to fetch Bible promise:", error);
    return { text: "Error fetching promise" }; // Handle any errors
  }
};

const WhatsNewView = () => {
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
            source={require('../../assets/pexels-pacific-3783385.jpg')}
            style={styles.backgroundImage}
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

export default WhatsNewView;
