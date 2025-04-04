// src/contexts/UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { use } from 'react';
import { fetchUserPermissions } from '../services/UsersService';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  // const [isProfileComplete, setIsProfileComplete] = useState(false);
  // const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session;
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (user && !userPermissions.length) {  // Avoid fetching if permissions are already loaded
        console.log('UserContext:: Fetching user permissions...');
        const permissions = await fetchUserPermissions(user.id);
        setUserPermissions(permissions);
      }
    };

    const fetchProfile = async () => {
      if (user && !userProfile) { // Avoid fetching if profile is already loaded
        console.log('UserContext:: Fetching user profile...');
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
        console.log('UserContext:: User profile:', profile);
        setIsProfileComplete(Boolean(profile.first_name && profile.last_name));
      }
    }

    fetchPermissions();
    // fetchProfile();
  }, [user]); // Only fetch if user changes and permissions are not loaded
  

  return (
    <UserContext.Provider value={{ user, userPermissions }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
