import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from './CommonStyles';
import { UserContext } from '../contexts/UserContext';
import { fetchProfileByUserId } from '../services/ProfileService'; // Adjust the path as needed

const Welcome = () => {
  const { user } = useContext(UserContext); // Get the current user from context
  const [name, setName] = useState('Guest'); // Default to 'Guest'

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  useEffect(() => {
    // Fetch the user's profile data
    const fetchName = async () => {
      if (user) {
        const profile = await fetchProfileByUserId(user);
        if (profile && profile.first_name) {
          setName(profile.first_name);
        }
      }
    };

    fetchName();
  }, [user]);

  return (
    <View>
      <Text style={commonStyles.welecomeText}>{`${getGreeting()}, ${name}!`}</Text>
    </View>
  );
};

export default Welcome;