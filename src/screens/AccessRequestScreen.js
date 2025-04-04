import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { UserContext } from '../contexts/UserContext';

const RequestAccessScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [reason, setReason] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);

  const requestAccess = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to request access.');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('access_requests')
      .insert([{ 
        user_id: user.id, 
        email: user.email, 
        reason, 
        portfolio,
        permission_id: 1, // Assuming permission_id 1 is for media upload
      }]);

    setLoading(false);

    if (error) {
      console.error('Error requesting access:', error);
      Alert.alert('Error', 'Failed to send request. Try again later.');
    } else {
      Alert.alert('Success', 'Your request has been submitted.');
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Request access to upload media files</Text>
      
      <Text>Email: {user?.email ?? 'Not logged in'}</Text>

      <TextInput
        placeholder="Tell us about yourself and why you need access"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
        multiline
      />

      <TextInput
        placeholder="Portfolio link (optional)"
        value={portfolio}
        onChangeText={setPortfolio}
        style={styles.input}
      />

      <Pressable style={[styles.button, loading && styles.disabledButton]} onPress={requestAccess} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Request Access To Upload Files'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});

export default RequestAccessScreen;