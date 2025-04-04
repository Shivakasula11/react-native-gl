import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabase-db/SupabaseClient';

const ManageAccessRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccessRequests();
  }, []);

  const fetchAccessRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .eq('status', 'pending');

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch access requests.');
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, userId, email, permission, action) => {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    setLoading(true);

    try {
      // ✅ Update request status
      const { error: updateError } = await supabase
        .from('access_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (updateError) throw new Error(`Failed to update request to ${newStatus}`);

      // ✅ Assign permission if approved
      if (action === 'approve') {
        const { error: permissionError } = await supabase
          .from('user_permissions')
          .insert([{ user_id: userId, permission_id: permission }]);

        if (permissionError) throw new Error('Failed to assign permission.');
      }

      Alert.alert('Success', `Request ${newStatus}.`);
      fetchAccessRequests(); // Refresh list
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error(`Error processing ${action}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
    <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Access Requests</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {!loading && requests.length === 0 && (
        <Text style={styles.noRecords}>No pending access requests.</Text>
      )}

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.permission}>Permission: {item.permission_id}</Text>
            <Text style={styles.reason}>
              <Text style={styles.bold}>Reason:</Text> {item.reason || 'Not provided'}
            </Text>
            {item.portfolio && (
              <Text style={styles.portfolio}>
                <Text style={styles.bold}>Portfolio:</Text> {item.portfolio}
              </Text>
            )}

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={() => handleAction(item.id, item.user_id, item.email, item.permission_id, 'approve')}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleAction(item.id, item.user_id, item.email, item.permission_id, 'reject')}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  noRecords: { fontSize: 16, textAlign: 'center', marginTop: 20, color: 'gray' },
  card: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 3 },
  email: { fontSize: 16, fontWeight: 'bold' },
  permission: { fontSize: 14, color: 'gray', marginBottom: 8 },
  reason: { fontSize: 14, marginBottom: 4 },
  portfolio: { fontSize: 14, color: 'blue', textDecorationLine: 'underline', marginBottom: 8 },
  bold: { fontWeight: 'bold' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, padding: 10, borderRadius: 5, alignItems: 'center', marginHorizontal: 5 },
  approveButton: { backgroundColor: 'green' },
  rejectButton: { backgroundColor: 'red' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default ManageAccessRequestsScreen;