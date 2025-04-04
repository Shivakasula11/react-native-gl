import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, ImageBackground } from 'react-native';
import { supabase } from '../services/supabase-db/SupabaseClient';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { AntDesign } from '@expo/vector-icons'; // ✅ Import Google Logo Icon
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // Ensures it works on Expo Go
    native: 'com.godlync.app://', // Ensures deep linking for standalone apps
  });

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        // webClientId: '21539834453-6kulhro6j9bt80l8vnkfpphc94hsjo9c.apps.googleusercontent.com',  
        webClientId: '21539834453-lhe71lrapvlmakb3fp8bnguled4u6qqv.apps.googleusercontent.com',  
        iosClientId: '21539834453-bvmvpds96ktngk0qtsa5fptn2qltbkqm.apps.googleusercontent.com',
        androidClientId: '21539834453-1nhh1nffaaho38c8s3dkvqqlott6l45q.apps.googleusercontent.com',
        redirectUri,
        // redirectUri: Platform.OS == 'web' ? 'http://localhost:8081' : 'godlync://oauthredirect',
        responseType: 'id_token',
        scopes: ['openid', 'profile', 'email'],
    });

    const handleSignInWithPassword = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setMessage(error.message);
            setMessageType('error');
        } else {
            // navigation.replace('Home');
            setMessageType('success');
            setTimeout(() => navigation.navigate('Home'), 2000);
        }
    };

    useEffect(() => {
        const handleSignInWithGoogle = async () => {
            if (response?.type === 'success') {
                const { id_token } = response.params;
                console.log('Google ID Token:', id_token);

                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: id_token,
                });

                if (error) {
                    console.error('Supabase Auth Error:', error);
                } else {
                    console.log('User Signed In:', data);
                    // navigation.replace('Home');
                }
            }
        };

        handleSignInWithGoogle();
    }, [response]);

    return (
    <View style={{ flex: 1 }}>
        <ImageBackground
        source={require('../../assets/background-image.jpg')} // The path to your background image
        style={styles.background} // The style for the ImageBackground
        resizeMode="cover" // Ensures the image covers the entire container
      >
        <ScrollView contentContainerStyle={styles.outerContainer}>
            <View style={styles.container}>
            {/* <Text style={styles.appTitle}>Welcome Back To GodLync</Text> */}
                {/* <Text style={styles.verse}>“So then faith comes by hearing, and hearing by the word of God.” – Romans 10:17</Text>
                <Text style={styles.appDescription}>
                GodLync is your gateway to strengthening your faith through hearing the Word of God. Our platform offers a 
                collection of powerful daily devotions, sermons, worship music, and inspirational messages to help you grow spiritually. 
                Listen to anointed teachings, dive into gospel melodies, and let your faith be built up through the truth 
                of God’s Word.
                </Text> */}

                {/* <Text style={styles.featuresTitle}>✨ Features:</Text>
                <Text style={styles.featureItem}>📖 **Hear the Word** – Access sermons, messages, and teachings that edify your spirit.</Text>
                <Text style={styles.featureItem}>🎶 **Faith-Building Worship** – Stream gospel songs, hymns, and worship music that uplift your soul.</Text>
                {/* <Text style={styles.featureItem}>📜 **Lyrics for Meditation** – Follow along with lyrics and meditate on faith-building truths.</Text>
                <Text style={styles.featureItem}>🔊 **Offline Listening** – Carry the Word with you and listen anytime, anywhere.</Text>
                <Text style={styles.featureItem}>📂 **Media Management** – Organize and upload your own Christian content effortlessly.</Text>
                <Text style={styles.featureItem}>🔒 **Secure & Seamless Access** – Sign in safely and enjoy uninterrupted spiritual growth.</Text> */}

                {/* <Text style={styles.appCallToAction}>Join GodLync today and let your faith grow by hearing the Word of God!</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text> */}

                {/* Email Input */}
                {/* <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                /> */}

                {/* Password Input */}
                {/* <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                /> */}

                {/* Sign In Button */}
                {/* <TouchableOpacity style={styles.signInButton} onPress={handleSignInWithPassword}>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity> */}

                {/* Google Sign-In Button */}
                <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()} disabled={!request}>
                    <AntDesign name="google" size={20} color="#fff" style={styles.googleIcon} />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Error/Success Message */}
                {message ? (
                    <Text style={[styles.message, messageType === 'error' ? styles.errorText : styles.successText]}>
                        {message}
                    </Text>
                ) : null}

                {/* <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.linkText}>Create an Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View> */}
                <TouchableOpacity style={styles.termsContainer} onPress={() => navigation.navigate('TermsAndConditions')}>
                    <Text style={styles.termsText}>
                        By signing in, you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.policyContainer} onPress={() => navigation.navigate('PrivacyPolicy')}>
                    <Text style={styles.termsText}>
                        Read our <Text style={styles.termsLink}>Privacy Policy</Text> for more information
                    </Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
        </ImageBackground>
    </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,  // ✅ Ensures it takes up the full screen
        width: '100%',
        height: '100%',
      },
    outerContainer: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 16,
        // backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        // backgroundColor: '#085b87',

    },
    container: {
        width: Platform.OS === 'web' ? '90%' : '90%',
        padding: 20,
        borderRadius: 8,
        // backgroundColor: '#085b87',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    descriptionContainer: {
        width: Platform.OS === 'web' ? '90%' : '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    appTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
      },
      verse: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 10,
      },
      appDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
      },
      featuresTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
      },
      featureItem: {
        fontSize: 14,
        color: '#444',
        marginBottom: 5,
      },
      appCallToAction: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
      },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
        subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    signInButton: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    googleButton: {
        flexDirection: 'row',
        width: '100%',
        height: 48,
        borderRadius: 8,
        backgroundColor: 'white', // Google Red
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    googleIcon: {
        marginRight: 10,
        color: 'black',
    },
    googleButtonText: {
        color: 'black',
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
        color: '#4CAF50',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
      },
      linkText: {
        color: 'white',
        fontSize: 14,
      },
      termsContainer: {
        marginTop: 20,
        alignItems: 'center',
      },
      termsText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
      },
      termsLink: {
        color: 'white',
        textDecorationLine: 'underline',
      },
});

export default SignInScreen;