// biblePromisesService.js
import { supabase } from './SupabaseClient';

// Fetch all Bible promises
export const fetchBiblePromises = async () => {
  const { data, error } = await supabase
    .from('bible_promises')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

// Fetch a single Bible promise by last created one 
export const getBiblePromise = async () => {
  const { data, error } = await supabase
    .from('bible_promises')
    .select('promise')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }

  return data[0]?.promise;
};

// Add a new Bible promise
export const addBiblePromise = async (promise) => {
  const { data, error } = await supabase
    .from('bible_promises')
    .insert([{ promise }]);

  if (error) {
    throw error;
  }

  return data;
};

export const updateBiblePromise = async (id, updatedPromise) => {
  const { data, error } = await supabase
    .from('bible_promises')
    .update([{ promise: updatedPromise }])
    .match({ id });

  if (error) {
    throw error;
  }

  return data;
};

// Delete a Bible promise by id
export const deleteBiblePromise = async (id) => {
  const { data, error } = await supabase
    .from('bible_promises')
    .delete()
    .match({ id });

  if (error) {
    throw error;
  }

  return data;
};