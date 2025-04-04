import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Admin = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Admin Dashboard</Text>
      <Text style={styles.subHeaderText}>Manage different aspects of the platform</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('BiblePromiseAdmin')}
        >
          <Text style={styles.buttonText}>Manage Bible Promises</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('MusicAdmin')}
        >
          <Text style={styles.buttonText}>Manage Music</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ManageMediaFiles')}
        >
          <Text style={styles.buttonText}>Manage Media Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ManageUserPermissionsScreen')}
        >
          <Text style={styles.buttonText}>Manage User Permissions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ManageAccessRequestsScreen')}
        >
          <Text style={styles.buttonText}>Manage Access Requests</Text>
        </TouchableOpacity>
      </View>

      {/* Optional: Add sign-out button or other actions here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 25,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Admin;