import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { UserContext } from '../contexts/UserContext';

const CompleteProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const updateProfile = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    console.log('User:', user.id);

    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: user.id, first_name: firstName, last_name: lastName, email: user.email });
    //   .eq('user_id', user.id);

    if (error) {
      console.error('Profile update error:', error);
    } else {
      console.log('Profile updated successfully');
      console.log('Navigating to MainTabs...');
      // print state of navigation
        console.log(navigation.getState());
      
      // Reset stack and navigate to MainTabs after profile completion
      navigation.navigate('GodLyncHome');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput 
        style={styles.input} 
        value={firstName} 
        onChangeText={setFirstName} 
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput 
        style={styles.input} 
        value={lastName} 
        onChangeText={setLastName} 
      />

      <Button title="Save" onPress={updateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});

export default CompleteProfileScreen;