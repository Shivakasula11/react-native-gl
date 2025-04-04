import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/Logo.jpg')} // Replace with your logo file path
        style={styles.logo}
        resizeMode="contain"
      />
      {/* <Text style={styles.headerText}>GodLync</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row', // Ensure items are aligned horizontally
    justifyContent: 'center', // Center logo and text horizontally
  },
  logo: {
    width: 100, // Adjust width as needed
    height: 40, // Adjust height as needed
    marginRight: 10, // Add some spacing between logo and text
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Header;