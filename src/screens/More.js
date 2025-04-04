import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const More = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>More Screen</Text>
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default More;
