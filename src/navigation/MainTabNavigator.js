import React, { useContext } from 'react';
import { Dimensions, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/home/Home';
import MusicBrowser from '../components/MusicBrowser';
import MusicPlayer from '../components/MusicPlayer';
import Stories from '../screens/Stories';
import Faith from '../screens/Faith';
import More from '../screens/More';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';
import Admin from '../screens/admin/Admin';
import BiblePromiseAdmin from '../screens/admin/BiblePromiseAdmin';
import MusicAdmin from '../screens/admin/MusicAdmin';
// import StoriesBrowser from '../components/StoriesBrowser';
import MusicScreen from '../screens/MusicScreen';
import { UserContext } from '../contexts/UserContext';
import ManageMediaFiles from '../screens/admin/ManageMediaFiles';
import { checkPermission } from '../services/UsersService';
import ManageUserPermissionsScreen from '../screens/ManageUserPermissionsScreen';
import AccessRequestScreen from '../screens/AccessRequestScreen'; 
import ManageAccessRequestsScreen from '../screens/admin/ManageAccessRequestsScreen';
import UploadMediaScreen from '../screens/UploadMediaScreen';
import ManageMyUploads from '../components/ManageMyUploads';
import WallScreen from '../screens/WallScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const commonScreenOptions = {
  headerShown: false,

};
const headerTitleOptions = {
  headerShown: true,
  headerStyle: {
    height: Platform.OS === 'ios' ? 79 : Platform.OS === 'web' ? 50 : 50, // Adjust height for each platform
    shadowOpacity: Platform.OS === 'android' ? 0.1 : 0, // Reduce shadow on Android
    elevation: Platform.OS === 'android' ? 4 : 0, // Add elevation for Android
    borderBottomWidth: Platform.OS === 'web' ? 1 : 0, // Add subtle border on web for separation
    borderBottomColor: Platform.OS === 'web' ? '#ccc' : 'transparent',
  },
  headerTitleStyle: {
    fontSize: Platform.OS === 'web' ? 20 : 18, // Slightly larger title for web
    color: "#fff",
  },
  headerBackground: () => (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={{ flex: 1 }}
    />
  ),
};

const HomeStack = ({ screenProps }) => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="GodLyncHome">
    {props => <Home {...props} onItemPress={screenProps.onItemPress} />}
    </Stack.Screen>
    <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen} />
  </Stack.Navigator>
);

const MusicStack = ({ screenProps }) => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="MusicBrowser">
      {props => <MusicBrowser {...props} onItemPress={screenProps.onItemPress} />}
    </Stack.Screen>
    <Stack.Screen name="MusicPlayer" component={MusicPlayer} />
    {/* <Stack.Screen name="MusicScreen" component={MusicScreen}></Stack.Screen> */}
  </Stack.Navigator>
);

const StoriesBrowserStack = ({ screenProps }) => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="StoriesBrowser">
      {props => <StoriesBrowser {...props} onItemPress={screenProps.onItemPress} />}
    </Stack.Screen>
    <Stack.Screen name="MusicPlayer" component={MusicPlayer} />
  </Stack.Navigator>
);

const StoriesStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="Stories" component={Stories} />
  </Stack.Navigator>
);

const FaithStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="Faith" component={Faith} />
  </Stack.Navigator>
);

const MoreStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="More" component={More} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Profile" component={Profile} />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="AdminScreen" component={Admin} />
    <Stack.Screen name="BiblePromiseAdmin" component={BiblePromiseAdmin} />
    {/* <Stack.Screen name="MusicAdmin" component={MusicAdmin} /> */}
    <Stack.Screen name="ManageMediaFiles" component={ManageMediaFiles} />
    <Stack.Screen name="ManageUserPermissionsScreen" component={ManageUserPermissionsScreen} />
    <Stack.Screen name="ManageAccessRequestsScreen" component={ManageAccessRequestsScreen} />
  </Stack.Navigator>
);

const WallStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="WallScreen" component={WallScreen} />
  </Stack.Navigator>
);


const MyStuffStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="RequestAccessScreen" component={AccessRequestScreen} />
    <Stack.Screen name="UploadMediaScreen" component={UploadMediaScreen} />
    <Stack.Screen name="ManageMyUploads" component={ManageMyUploads} />
  </Stack.Navigator>
);



const MainTabNavigator = ({ screenProps }) => {
  const { user, userPermissions } = useContext(UserContext);
  // Add a fallback for userPermissions if it's undefined or null
  const permissions = Array.isArray(userPermissions) ? userPermissions : [];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Music') {
            iconName = focused ? 'radio' : 'radio-outline';
          } else if (route.name === 'Meditation') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Updates') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'MyFavourites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Lyrics') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Me') { // Add icon for Profile tab
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: Platform.OS === 'web' ? '7%' : Platform.OS === 'ios' ? '8.5%' : '6%',
          overflow: 'hidden', // Ensures the gradient applies properly
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            style={{ flex: 1 }}
          />
        ),
      })}
    >
      {/* <Tab.Screen name="Home" options={{ headerShown: false }} > 
        {props => <HomeStack {...props} screenProps={screenProps} />}
      </Tab.Screen>
      <Tab.Screen name="Music" options={headerTitleOptions}>
        {props => <MusicStack {...props} screenProps={screenProps} />}
      </Tab.Screen>
      <Tab.Screen name="Meditation" options={headerTitleOptions}>
        {props => <StoriesBrowserStack {...props} screenProps={screenProps}  />}
      </Tab.Screen> */}
      <Tab.Screen name="Updates" options={headerTitleOptions}>
        {props => <WallStack {...props} screenProps={screenProps}  />}
      </Tab.Screen>
      {/* {user && permissions.includes('admin') ? (
        <Tab.Screen name="Admin" component={AdminStack} options={{ headerShown: false }} />
      ) : null} */}
      <Tab.Screen name="Me" component={MyStuffStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
