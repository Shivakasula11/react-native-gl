import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { UserContext } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [hasMediaUploadPermission, setHasMediaUploadPermission] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch permissions from the user_permissions table
      const fetchUserPermissions = async () => {
        try {
          const { data, error } = await supabase
            .from('user_permissions')
            .select('permission_id')
            .eq('user_id', user.id);

          if (error) throw error;

          console.log(data);
          if (data && data.length > 0) {
            // Check if user has permission to upload media
            const uploadPermission = data.some(
              (permission) => permission.permission_id === 1
            );
            setHasMediaUploadPermission(uploadPermission);
          }
        } catch (err) {
          console.error('Error fetching user permissions:', err.message);
          Alert.alert('Error', 'Failed to fetch user permissions. Please try again.');
        }
      };

      fetchUserPermissions();
    }
  }, [user]); // Only run effect when the `user` changes

  const handleSignOut = async () => {
    try {
      // Clear Supabase session
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local storage/cache
      await AsyncStorage.clear();

      // Navigate to SignIn screen
      // navigation.replace('SignIn');
    } catch (err) {
      console.error('Error during sign out:', err.message);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          <Text style={styles.header}>Welcome, {user.email}</Text>
          <View style={styles.userDetails}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.buttonContainer}>
            {!hasMediaUploadPermission && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('RequestAccessScreen')}
              >
                <Text style={styles.buttonText}>Request Access Form</Text>
              </TouchableOpacity>
            )}

            {hasMediaUploadPermission && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('UploadMediaScreen')}
                >
                  <Text style={styles.buttonText}>Upload Media Files</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('ManageMyUploads')}
                >
                  <Text style={styles.buttonText}>Manage My Uploads</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noUserText}>No user is logged in</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  userDetails: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noUserText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default Profile;