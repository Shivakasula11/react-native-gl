
import { supabase } from './supabase-db/SupabaseClient';


export const checkPermission = async (userId, permission) => {
    console.log('UsersService:: Checking permission:', permission, 'for user:', userId);
    const { data, error } = await supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', userId)
        .eq('permission', permission);

    if (error) throw error;


    console.log('UsersService:: Checked permission:', permission, 'for user:', userId, 'result:', data.length > 0);
    return data.length > 0; // Returns true if user has the permission
};

export const fetchUserPermissions = async (userId) => {
    console.log('UsersService:: Fetching permissions for user:', userId);

    const { data, error } = await supabase
        .from('user_permissions')
        .select('permissions(name)') // Fetch permission names using dot notation
        .eq('user_id', userId);

    if (error) {
        console.error('UsersService:: Error fetching permissions:', error);
        throw error;
    }

    // Extract permission names from the returned data
    const permissions = data.map((item) => item.permissions.name);

    console.log('UsersService:: Fetched permissions for user:', userId, 'result:', permissions);
    return permissions;
};

export const fetchUserProfile = async (userId) => {
    console.log('UsersService:: Fetching profile for user:', userId);

    const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name', 'email')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        console.error('UsersService:: Error fetching profile:', error);
    }

    console.log('UsersService:: Fetched profile for user:', userId, 'result:', data);
    return data;
};

export const isProfileComplete = async (userId) => {
    console.log('UsersService:: Checking if profile is complete for user:', userId);

    const profile = await fetchUserProfile(userId);
    const complete = Boolean(profile.first_name && profile.last_name);

    console.log('UsersService:: Profile is complete for user:', userId, 'result:', complete);
    return complete;
}