import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { UserContext } from '../contexts/UserContext';

const ManageMyUploads = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    fetchMediaFiles();
    deleteOldMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .filter('uploaded_by', 'eq', user.id); // Fetch only user's files

    if (error) {
      console.error('Error fetching media files:', error);
    } else {
      setMediaFiles(data);
    }
  };

  const handleDeleteRestore = async (item) => {
    const newStatus = item.is_deleted ? false : true;
    const { error } = await supabase
      .from('media_files')
      .update({ is_deleted: newStatus })
      .match({ id: item.id });

    if (error) {
      console.error('Error updating file status:', error);
      Alert.alert('Error', 'Failed to update file status.');
    } else {
      fetchMediaFiles(); // Re-fetch the files to update the UI
    }
  };

  // Permanently delete files older than 7 days
  const deleteOldMediaFiles = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const formattedDate = sevenDaysAgo.toISOString();
  
    // Get files marked as deleted older than 7 days
    const { data: oldFiles, error } = await supabase
      .from('media_files')
      .select('*')
      .filter('is_deleted', 'eq', true)
      .filter('deleted_at', 'lt', formattedDate);
  
    if (error) {
      console.error('Error fetching old deleted files:', error);
      return;
    }
  
    // Permanently delete each file
    for (const file of oldFiles) {
      await deleteFromWasabi(s3, file.file_path); // Delete from Wasabi
      await supabase.storage.from('media').remove([file.cover_path]); // Delete from Supabase
  
      // Remove from database
      await supabase.from('media_files').delete().eq('id', file.id);
    }
  
    console.info(`Permanently deleted ${oldFiles.length} old media files.`);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, item.is_deleted && styles.deletedItem]}>
      {item.cover_url && <Image source={{ uri: item.cover_url }} style={styles.coverImage} />}
      <Text style={styles.itemText}>{item.title}</Text>
      <Text style={styles.itemText}>Uploaded By: You</Text>
      <Text style={styles.itemText}>{item.is_deleted ? 'Deleted' : 'Active'}</Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleDeleteRestore(item)}
      >
        <Text style={styles.actionButtonText}>
          {item.is_deleted ? 'Restore' : 'Delete'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <FlatList
        data={mediaFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  deletedItem: {
    backgroundColor: '#f5c6cb',
  },
  itemText: {
    marginBottom: 5,
    fontSize: 16,
  },
  coverImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ManageMyUploads;