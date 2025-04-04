// CustomFooter.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomFooter = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Footer Content</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 60, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  text: {
    fontSize: 16,
  },
});

export default CustomFooter;
