import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../services/supabase-db/SupabaseClient';

const NewPasswordScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const token = route.params?.token;
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            Alert.alert('Invalid reset link.');
            navigation.replace('SignIn');
        }
    }, [token]);

    const handleUpdatePassword = async () => {
        if (!newPassword) {
            Alert.alert('Please enter a new password.');
            return;
        }

        setLoading(true); // Start loading

        const { data, error1 } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token, // Required for session persistence
        });

        if (error1) {
            console.error("Session error:", error1.message);
            Alert.alert('Session error:', error1.message);
            navigation.replace('SignIn');
        } else {
            console.log("Session restored:", data);
            setLoading(false);
        }

        // Use the token to reset the password
        const { data1, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            console.error("Password update error:", error.message);
            Alert.alert('Error updating password:', error.message);
        } else {
            Alert.alert('Password updated successfully.');
            navigation.replace('SignIn');
        }

        setLoading(false); // Stop loading
    };

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View>
            <TextInput
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <Button title="Update Password" onPress={handleUpdatePassword} />
        </View>
    );
};

export default NewPasswordScreen;