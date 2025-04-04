import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';

const ManageUserPermissions = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch user by email
  const searchUser = async () => {
    if (!email) return Alert.alert('Error', 'Please enter an email');
    
    setLoading(true);
    const { data, error } = await supabase.from('auth.users').select('*').eq('email', email).single();

    if (error || !data) {
      Alert.alert('User Not Found', 'No user found with this email');
      setUser(null);
      setPermissions([]);
      setSelectedPermissions([]);
    } else {
      setUser(data);
      fetchPermissions(data.id); // Fetch user permissions
    }
    setLoading(false);
  };

  // 🎚 Fetch all available permissions & user's assigned permissions
  const fetchPermissions = async (userId) => {
    const { data: allPermissions, error: permError } = await supabase.from('permissions').select('*');
    if (permError) return console.error('Error fetching permissions:', permError);

    const { data: userPermissions, error: userPermError } = await supabase
      .from('user_permissions')
      .select('permission_id')
      .eq('user_id', userId);

    if (userPermError) return console.error('Error fetching user permissions:', userPermError);

    setPermissions(allPermissions);
    setSelectedPermissions(userPermissions.map(p => p.permission_id)); // Store assigned permissions
  };

  // ✅ Toggle permissions selection
  const togglePermission = (permId) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  // 💾 Save assigned permissions
  const savePermissions = async () => {
    if (!user) return;

    // Delete existing permissions
    await supabase.from('user_permissions').delete().eq('user_id', user.id);

    // Insert new selected permissions
    const { error } = await supabase.from('user_permissions').insert(
      selectedPermissions.map(permId => ({
        user_id: user.id,
        permission_id: permId,
      }))
    );

    if (error) {
      Alert.alert('Error', 'Failed to update permissions');
      console.error('Error updating permissions:', error);
    } else {
      Alert.alert('Success', 'Permissions updated successfully!');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Manage User Permissions</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Enter user email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1, borderColor: 'gray', padding: 10, marginTop: 10, borderRadius: 5,
        }}
      />
      <Button title="Search User" onPress={searchUser} disabled={loading} />

      {/* Show user details if found */}
      {user && (
        <View style={{ marginTop: 20 }}>
          <Text>User: {user.email}</Text>
          <Text>User ID: {user.id}</Text>

          {/* Permissions List */}
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Select Permissions:</Text>
          <FlatList
            data={permissions}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: selectedPermissions.includes(item.id) ? 'lightblue' : 'white',
                  borderBottomWidth: 1,
                }}
                onPress={() => togglePermission(item.id)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Save Button */}
          <Button title="Save Permissions" onPress={savePermissions} />
        </View>
      )}
    </View>
  );
};

export default ManageUserPermissions;