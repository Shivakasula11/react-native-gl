import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { uploadToWasabi } from '../services/WasabiClient';
import { useWasabiS3 } from '../services/useWasabiS3';
import { UserContext } from '../contexts/UserContext';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import { fetchProfileByUserId } from '../services/ProfileService';
import { CostExplorer } from 'aws-sdk';

const UploadMediaScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [isKidsContent, setIsKidsContent] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [tag, setTag] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [languages, setLanguages] = useState([]);

  const s3 = useWasabiS3();

  useEffect(() => {
    fetchMediaFiles();
    fetchMediaTags();
    fetchContentTypes();
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfileByUserId(user).then((profile) => {
        setUserProfile(profile);
      });
    }
  }, [user]);

  const fetchMediaTags = async () => {
    const { data, error } = await supabase.from('media_tags').select('*');
    if (error) console.error('Error fetching media tags:', error);
    else setTags(data);
  };

  const fetchLanguages = async () => {
    const { data, error } = await supabase.from('languages').select('code, name').eq('enabled', 'TRUE').order('name', { ascending: true });
    if (error) console.error('Error fetching languages:', error);
    else setLanguages(data);
  };


  const fetchContentTypes = async () => {
    const { data, error } = await supabase.from('content_types').select('*').eq('enabled', 'TRUE').order('name', { ascending: true });
    if (error) console.error('Error fetching content types:', error);
    else setContentTypes(data);
  };

  const uploadMediaFile = async () => {
    console.log('User:::', user.id);
    if (!selectedFile || !selectedCover) {
      setErrorMessage('Please select both a file and a cover image.');
      return;
    }

    setLoading(true);
    const timestamp = new Date().getTime(); 

    const sanitizedFileName = `${timestamp}_${selectedFile.name.replace(/\s+/g, '_')}`;
    const sanitizedCoverName = `${timestamp}_${selectedCover.name.replace(/\s+/g, '_')}`;

    console.log("Sanitized file name with timestamp:", sanitizedFileName);
    console.log("Sanitized cover name with timestamp:", sanitizedCoverName);

    const profileName = `${userProfile.first_name}${userProfile.last_name}`;

    const { filePath, coverPath } = constructFileNamePaths(title, album, contentType, language, profileName, selectedFile.name.split('.').pop(), selectedCover.name.split('.').pop());


    try {
      const { data: coverData, error: coverError } = await supabase.storage.from('media').upload(coverPath, selectedCover, { cacheControl: '3600', upsert: false });
      if (coverError) {
        setErrorMessage('Error uploading cover to Supabase.');
        console.error('Cover upload error:', coverError);
        return;
      }

      const { data: fileData, error: fileError } = await supabase.storage.from('media').upload(filePath, selectedFile, { cacheControl: '3600', upsert: false });
      if (fileError) {
        setErrorMessage('Error uploading file to Supabase.');
        console.error('File upload error:', fileError);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(coverPath);
      const coverPublicUrl = publicUrlData.publicUrl;

      const { data: filePublicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
      const filePublicUrl = filePublicUrlData.publicUrl;

      //TODO determine if we need to upload to Wasabi
      // const fileWasabiUrl = await uploadToWasabi(s3, selectedFile, filePath);

      const { data, error } = await supabase
        .from('media_files')
        .insert([
          {
            title,
            name,
            album,
            genre,
            language,
            cover_url: coverPublicUrl, 
            duration: 0,
            file_url: filePublicUrl, 
            is_kids_content: isKidsContent,
            content_type: contentType,
            lyrics,
            tag,
            file_path: filePath,
            cover_path: coverPath,
            uploaded_by: user.id,
          },
        ]);

      if (error) {
        setErrorMessage('Error saving media file to database.');
        console.error('Error inserting media file:', error.message);
      } else {
        setSuccessMessage('Media file uploaded successfully!');
        fetchMediaFiles();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: ['audio/mpeg', 'audio/wav'] });
      if (file.output && file.output.length > 0) {
        const MAX_FILE_SIZE = 50 * 1024 * 1024;
        if (file.output[0].size > MAX_FILE_SIZE) {
          setErrorMessage('File size must be less than 10MB.');
          return;
        } else {
          setErrorMessage('');
        }

        setSelectedFile(file.output[0]);
      } else {
        setErrorMessage('File selection cancelled.');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      setErrorMessage('Error selecting file.');
    }
  };

  const selectCover = async () => {
    try {
      const cover = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (cover.output && cover.output.length > 0) {
        const MAX_COVER_SIZE = 5 * 1024 * 1024;
        if (cover.output[0].size > MAX_COVER_SIZE) {
          setErrorMessage('Cover image size must be less than 5MB.');
          return;
        }
        setSelectedCover(cover.output[0]);
        setErrorMessage('');
      } else {
        setErrorMessage('Cover selection cancelled.');
      }
    } catch (error) {
      console.error('Error selecting cover:', error);
      setErrorMessage('Error selecting cover.');
    }
  };

  const deleteMediaFile = async (id) => {
    try {
      // Soft delete: update is_deleted field and set deleted_at timestamp
      const { error } = await supabase
        .from('media_files')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', id);
  
      if (error) {
        console.error('Error soft deleting media file:', error);
        return;
      }
  
      console.info(`Media file with ID ${id} marked as deleted.`);
      
      fetchMediaFiles(); // Refresh list
    } catch (error) {
      console.error('Unexpected error during deletion:', error.message);
    }
  };
  
  // Restore a deleted media file
  const restoreMediaFile = async (id) => {
    try {
      const { error } = await supabase
        .from('media_files')
        .update({ is_deleted: false, deleted_at: null }) // Reset fields
        .eq('id', id);
  
      if (error) {
        console.error('Error restoring media file:', error);
        return;
      }
  
      console.info(`Media file with ID ${id} restored.`);
      
      fetchMediaFiles(); // Refresh list
    } catch (error) {
      console.error('Unexpected error during restoration:', error.message);
    }
  };
  
  // Fetch media, excluding soft-deleted ones by default
  const fetchMediaFiles = async (showDeleted = false) => {
    let query = supabase.from('media_files').select('*').filter('uploaded_by', 'eq', user.id);
  
    if (!showDeleted) {
      query = query.filter('is_deleted', 'neq', true);
    }
  
    const { data, error } = await query;
  
    if (error) console.error('Error fetching media files:', error);
    else setMediaFiles(data);
  };
  
  // Permanently delete files older than 7 days
  const deleteOldMediaFiles = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const formattedDate = sevenDaysAgo.toISOString();
  
    // Get files marked as deleted older than 7 days
    const { data: oldFiles, error } = await supabase
      .from('media_files')
      .select('*')
      .filter('is_deleted', 'eq', true)
      .filter('deleted_at', 'lt', formattedDate);
  
    if (error) {
      console.error('Error fetching old deleted files:', error);
      return;
    }
  
    // Permanently delete each file
    for (const file of oldFiles) {
      await deleteFromWasabi(s3, file.file_path); // Delete from Wasabi
      await supabase.storage.from('media').remove([file.cover_path]); // Delete from Supabase
  
      // Remove from database
      await supabase.from('media_files').delete().eq('id', file.id);
    }
  
    console.info(`Permanently deleted ${oldFiles.length} old media files.`);
  };

  const constructFileNamePaths = (title, album, category, language, uploader, mediaExtension, coverExtension) => {
    const sanitizedTitle = title.replace(/\s+/g, '_').toLowerCase();
    const sanitizedAlbum = album ? album.toLowerCase() : ''; // Handle case when album might be null/empty
    const sanitizedCategory = category.toLowerCase();
    const sanitizedLanguage = language.toUpperCase();
    const sanitizedUploader = uploader.replace(/\s+/g, '_');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD format
    const uniqueID = Math.random().toString(36).substring(2, 8); // Random unique ID
    const sanitizedAlbumPath = sanitizedAlbum ? `${sanitizedAlbum}/` : '';
  
    // Generate the file name for the media with the mediaExtension
    const commonPathName = `audio/${sanitizedCategory}/${sanitizedLanguage}/${sanitizedTitle}_${sanitizedCategory}_${sanitizedLanguage}_${sanitizedUploader}_${date}_${uniqueID}`;
    const filePath = `${commonPathName}.${mediaExtension}`;
    const coverPath = `${commonPathName}_cover.${coverExtension}`;

  
   
    // Return an object with both file paths
    return {
      filePath,
      coverPath
    };
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.cover_url && <Image source={{ uri: item.cover_url }} style={styles.coverImage} />}
      <Text style={styles.itemText}>Title: {item.title}</Text>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      {contentType === 'song' && <Text style={styles.itemText}>Album: {item.album}</Text>}
      {contentType === 'song' && <Text style={styles.itemText}>Genre: {item.genre}</Text>}
      <Text style={styles.itemText}>Language: {item.language}</Text>
      <Text style={styles.itemText}>Kids Content: {item.is_kids_content ? 'Yes' : 'No'}</Text>
      {contentType === 'song' && <Text style={styles.itemText}>Lyrics: {item.lyrics}</Text>}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Picker selectedValue={contentType || ""} onValueChange={setContentType} style={styles.picker}>
  <Picker.Item label="Select Media Type" value="" />
  {contentTypes.map((contentType) => (
    <Picker.Item key={contentType.id} label={contentType.name} value={contentType.name} />
  ))}
</Picker>

        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        {contentType === 'song' && <TextInput style={styles.input} placeholder="Album" value={album} onChangeText={setAlbum} />}
        {contentType === 'song' && <TextInput style={styles.input} placeholder="Genre" value={genre} onChangeText={setGenre} />}
        <Picker
          selectedValue={language || ""}
          onValueChange={(itemValue) => setLanguage(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Language" value="" />
          {languages.map((language) => (
            <Picker.Item key={language.code} label={language.name} value={language.code} />
          ))}
        </Picker>

        {contentType === 'song' && <TextInput style={styles.input} placeholder="Lyrics" value={lyrics} onChangeText={setLyrics} />}
        
        <Picker
          selectedValue={tag || ""}
          onValueChange={(itemValue) => setTag(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Media Tag" value="" />
          {tags.map((tag) => (
            <Picker.Item key={tag.id} label={tag.name} value={tag.name} />
          ))}
        </Picker>
        <CheckBox
        title="Kids Content"
        checked={isKidsContent}
        onPress={() => setIsKidsContent(!isKidsContent)}
      />

        <Button title="Select File" onPress={selectFile} />
        <Button title="Select Cover" onPress={selectCover} />
        <Button title="Upload Media File" onPress={uploadMediaFile} disabled={loading} />

        {loading && <ActivityIndicator size="small" color="#0000ff" />}

        {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

        {selectedFile && (
          <View style={styles.selectedFileContainer}>
            <Text>Selected File: {selectedFile.name}</Text>
          </View>
        )}
        {selectedCover && (
          <View style={styles.selectedCoverContainer}>
            <Text>Selected Cover Image: {selectedCover.name}</Text>
          </View>
        )}
        <FlatList data={mediaFiles} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 40,
    marginBottom: 10,
    ...Platform.select({
      ios: { height: 200 }, // Adjust height for iOS
      android: { height: 50 }, // Adjust height for Android
    }),
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedFileContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  selectedCoverContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    marginBottom: 5,
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#000',
    color: '#fff',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default UploadMediaScreen;