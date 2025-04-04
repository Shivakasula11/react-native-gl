import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
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

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const commonScreenOptions = {
  headerShown: false,
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);

const MusicStack = ({ screenProps }) => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="MusicBrowser">
      {props => <MusicBrowser {...props} onItemPress={screenProps.onItemPress} />}
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
    <Stack.Screen name="Admin" component={Admin} />
    <Stack.Screen name="BiblePromiseAdmin" component={BiblePromiseAdmin} />
    <Stack.Screen name="MusicAdmin" component={MusicAdmin} />
  </Stack.Navigator>
);

const MainDrawerNavigator = ({ screenProps }) => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Music">
        {props => <MusicStack {...props} screenProps={screenProps} />}
      </Drawer.Screen>
      <Drawer.Screen name="Stories" component={StoriesStack} />
      <Drawer.Screen name="Faith" component={FaithStack} />
      <Drawer.Screen name="More" component={MoreStack} />
      <Drawer.Screen name="Admin" component={AdminStack} />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
