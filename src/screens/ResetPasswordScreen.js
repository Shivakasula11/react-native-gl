import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const handleDeepLink = async () => {
            let url = await Linking.getInitialURL();
            
            if (url) {
                // Extract the fragment part after '#'
                const fragment = url.split('#')[1];
                if (!fragment) {
                    Alert.alert("Invalid reset link.");
                    navigation.replace('SignIn');
                    return;
                }

                // Convert the fragment into an object
                const queryParams = Object.fromEntries(new URLSearchParams(fragment));

                console.log("Extracted Params:", queryParams); // Debugging

                if (queryParams.type === 'recovery' && queryParams.access_token) {
                    navigation.replace('NewPassword', { token: queryParams.access_token });
                } else {
                    Alert.alert("Invalid or expired reset link.");
                    navigation.replace('SignIn');
                }
            }
        };

        handleDeepLink();
    }, []);

    return (
        <View>
            <Text>Redirecting to Reset Password...</Text>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default ResetPasswordScreen;