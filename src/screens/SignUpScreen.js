import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    try {
      // Sign up user with email and password
      const { data, error } = await supabase.auth.signUp({ 
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
        }
      } });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      } 
      else {
        setMessage('Account created successfully! Please confirm your email.');
        setMessageType('success');

        // setTimeout(() => {
        //   navigation.navigate('SignIn');
        // }, 10000); // Redirect to SignIn screen
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred. Please try again later.');
      setMessageType('error');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {message ? (
          <Text style={[styles.message, messageType === 'error' ? styles.errorText : styles.successText]}>
            {message}
          </Text>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInLink}>Already have an account? Sign In</Text>
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
    width: Platform.OS === 'web' ? '90%' : '90%', // 50% width on web, 90% on mobile
    maxWidth: 'auto', // Restrict maximum width
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4, // Shadow effect on Android
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  signUpButton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  signInLink: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
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
});

export default SignUpScreen;