import { supabase } from "./supabase-db/SupabaseClient"

export const fetchMediaFiles = async ({ contentTypes = [], tags = [], is_kids_content, limit = 10, offset = 0, includeDeleted = false }) => {
  // console.log(`Fetching media files: types=${contentTypes}, tag=${tags}, is_kids_content=${is_kids_content}, limit=${limit}, offset=${offset}, includeDeleted=${includeDeleted}`);

  let query = supabase.from('media_files').select('id,name,title,cover_url,file_url,cover_path,file_path,is_deleted').order('created_at', { ascending: false });

  if (contentTypes.length > 0) {
    query = query.in('content_type', contentTypes);
  }
  if (tags.length > 0) {
    query = query.in('tag', tags);
  }
  if (typeof is_kids_content === 'boolean') {
    query = query.filter('is_kids_content', 'eq', is_kids_content);
  }
  if (!includeDeleted) {
    query = query.filter('is_deleted', 'neq', true); // Exclude soft-deleted media by default
  }

  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching media files:', error);
    return [];
  }

  return data;
};
