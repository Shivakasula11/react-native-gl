import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const LastPlayedTracks = () => {
  const [lastPlayedTracks, setLastPlayedTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLastPlayedTracks();
  }, []);

  const fetchLastPlayedTracks = async () => {
    try {
      const response = await axios.get('https://a9.asurahosting.com:8060/status-json.xsl');
      const data = response.data;
      // Assuming the Icecast server provides an array of recent tracks
      const tracks = data.icestats.source.playlist || [];
      setLastPlayedTracks(tracks);
    } catch (err) {
      setError('Failed to load last played tracks');
      console.error('Error fetching last played tracks:', err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.trackItem}>
      <Text style={styles.trackText}>{item.title || 'Unknown Track'}</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Last Played Tracks</Text>
      <FlatList
        data={lastPlayedTracks}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trackItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  trackText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default LastPlayedTracks;
