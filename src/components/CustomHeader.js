// CustomHeader.js
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Platform } from 'react-native';

const CustomHeader = () => (
  <View style={styles.container}>
    <Image
      source={require('../../assets/Logo.jpg')} // Ensure you have the logo image in the assets folder
      style={styles.logo}
    />
    {/* <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={() => console.log('Sign In pressed')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Signup pressed')}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View> */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    justifyContent: 'center',
    alignItems: 'center',
    height: Platform.OS === 'web' ? 80 : 120, // Adjust the height as needed
    backgroundColor: '#fff',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: Platform.OS === 'web' ? 0 : 50,
    paddingBottom: Platform.OS === 'web' ? 0 : 0,
  },
  logo: {
    width: 140,
    height: 70,
    resizeMode: 'contain',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120, // Adjust the width as needed
  },
  buttonText: {
    color: '#007bff', // Example button text color
    fontWeight: 'bold',
  },
});

export default CustomHeader;