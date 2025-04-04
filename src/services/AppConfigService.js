import { supabase } from './supabase-db/SupabaseClient';

let appConfig = {}; // Store the config in memory

export const loadAppConfig = async () => {
  try {
    const { data, error } = await supabase.from('app_config').select('*');
    
    if (error) {
      throw new Error(`Error fetching config: ${error.message}`);
    }

    // Convert the key-value pairs into an object
    appConfig = data.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
    return appConfig;
  } catch (error) {
    console.error('Failed to load app config:', error);
    return null;
  }
};

// Function to get a config value
export const getConfigValue = (key) => {
    console.log('Getting config value for key:', key);
  return appConfig[key] || null;
};