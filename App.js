import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ImageBackground, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { supabase } from './src/services/supabase-db/SupabaseClient';
import MusicPlayer from './src/components/MusicPlayerWrapper';
import { UserProvider } from './src/contexts/UserContext';
import TermsAndConditionsScreen from './src/screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import NewPasswordScreen from './src/screens/NewPasswordScreen';
import * as Linking from 'expo-linking';
import { loadAppConfig } from './src/services/AppConfigService';
import TrackPlayer from 'react-native-track-player';
import { playbackService, setupPlayer } from './src/services/TrackPlayerService';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

// Only register components & playback service for mobile platforms
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  AppRegistry.registerComponent(appName, () => App);
  TrackPlayer.registerPlaybackService(() => playbackService);
}

const Stack = createStackNavigator();

const linking = {
  prefixes: ['https://godlync.com', 'godlync://'],
  config: {
    screens: {
      ResetPassword: 'reset-password',
      NewPassword: 'new-password',
    },
  },
};

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPlayerVisible, setPlayerVisible] = useState(false);
  const [isPlayerCollapsed, setPlayerCollapsed] = useState(true);
  const [musicFiles, setMusicFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        console.log('No active user session');
        await stopPlayback(); // Correct function call
      }
      setUser(session?.user ?? null);
    });
  
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      await loadAppConfig();
      setIsConfigLoaded(true);
    };

    if (user && !isConfigLoaded) {
      fetchConfig();
    }

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      setupPlayer();
    }
  }, [user]);

  // Handle track selection
  const handleItemPress = async (file, index, files) => {
    setMusicFiles(files);
    setSelectedFile(file);
    setCurrentIndex(index);
    setPlayerVisible(true);
    setPlayerCollapsed(false);
  };

  const stopPlayback = async () => {
    console.log('Stopping playback...');
    setPlayerVisible(false);
    setSelectedFile(null);
  };

  const togglePlayerCollapse = () => {
    setPlayerCollapsed(!isPlayerCollapsed);
  };

  return (
    <ErrorBoundary>
      <UserProvider>
        <NavigationContainer linking={linking}>
            <View style={styles.mainContent}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                  <Stack.Screen name="GodLync">
                    {() => <MainTabNavigator screenProps={{ onItemPress: handleItemPress }} />}
                  </Stack.Screen>
                ) : (
                  <>
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                    <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
                    <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
                    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                  </>
                )}
              </Stack.Navigator>
            </View>

            {selectedFile && (
              <MusicPlayer
                isVisible={isPlayerVisible}
                onClose={stopPlayback}
                file={selectedFile}
                files={musicFiles}
                currentIndex={currentIndex}
                isCollapsed={isPlayerCollapsed}
                onToggleCollapse={togglePlayerCollapse}
              />
            )}
        </NavigationContainer>
      </UserProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensure the background image covers the whole screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  logoContainer: {
    position: 'absolute',
    top: '20%', // Adjust based on where you want the logo
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    marginBottom: 0, // Adjust this value based on the height of the collapsed music player
  },
  headerTitleContainer: {
    alignItems: 'center',
    paddingVertical: 0, // Adjust the padding as needed
  },
  headerTitle: {
    fontSize: 18, // Adjust the font size as needed
  },
});

export default App;