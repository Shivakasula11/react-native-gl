import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handlePasswordReset = async () => {
    // const { error } = await supabase.auth.resetPasswordForEmail(email, "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://godlync.com/reset-password/',
    })

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessage('Check your email for password reset instructions.');
      setMessageType('success');
      setTimeout(() => {
        navigation.navigate('SignIn');
      }, 2000); // Delay for UX consistency
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.description}>
          Enter your email address, and we'll send you a link to reset your password.
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        {message ? (
          <Text style={[styles.message, messageType === 'error' ? styles.errorText : styles.successText]}>
            {message}
          </Text>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInLink}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  container: {
    width: Platform.OS === 'web' ? '90%' : '90%',
    maxWidth: 'auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  resetButton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  errorText: {
    color: '#ff4d4d',
  },
  successText: {
    // color: '#4CAF50',
  },
  signInLink: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;