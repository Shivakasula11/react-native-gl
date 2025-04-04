import supabase from './supabase-db/SupabaseClient'

class MusicService {
    // Create a new music file
    async createMusicFile(file) {
        const { data, error } = await supabase.storage.from('music').upload(file.name, file);
        if (error) {
            console.error('Error uploading music file:', error);
            return null;
        }
        return data;
    }

    // Get all music files
    async getAllMusicFiles() {
        const { data, error } = await supabase.storage.from('music').list();
        if (error) {
            console.error('Error retrieving music files:', error);
            return [];
        }
        return data;
    }

    // Get a specific music file by ID
    async getMusicFileById(id) {
        const { data, error } = await supabase.storage.from('music').get(id);
        if (error) {
            console.error('Error retrieving music file:', error);
            return null;
        }
        return data;
    }

    // Update a music file by ID
    async updateMusicFileById(id, file) {
        const { data, error } = await supabase.storage.from('music').update(id, file);
        if (error) {
            console.error('Error updating music file:', error);
            return null;
        }
        return data;
    }

    // Delete a music file by ID
    async deleteMusicFileById(id) {
        const { data, error } = await supabase.storage.from('music').remove(id);
        if (error) {
            console.error('Error deleting music file:', error);
            return false;
        }
        return true;
    }
}

export default MusicService;