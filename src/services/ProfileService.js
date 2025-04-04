import {supabase} from '../services/supabase-db/SupabaseClient'

export const fetchProfileByUserId = async (user) => {
    if (!user || !user.id) {
      throw new Error('User or User ID is missing.');
    }
  
    try {
      const { data, error } = await supabase
        .from('profiles') // Replace with your actual table name
        .select('user_id, first_name, last_name, email') // Specify the fields you need
        .eq('user_id', user.id) // Filter by user ID
        .single(); // Fetch a single record
  
      if (error) {
        throw new Error(`Error fetching profile: ${error.message}`);
      }
  
      return data; // Return the fetched profile
    } catch (err) {
      // console.error(err.message);
      return null; // Return null in case of an error
    }
  };