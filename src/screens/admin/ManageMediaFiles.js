import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput, TouchableOpacity, Image, CheckBox, Picker, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../services/supabase-db/SupabaseClient';
import { uploadToWasabi, deleteFromWasabi } from '../../services/WasabiClient';
import { useWasabiS3 } from '../../services/useWasabiS3';

const ManageMediaFiles = () => {
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

  const s3 = useWasabiS3();

  useEffect(() => {
    fetchMediaFiles();
    fetchMediaTags();
    fetchContentTypes();
  }, []);

  const fetchMediaFiles = async () => {
    const { data, error } = await supabase.from('media_files').select('*');
    if (error) console.error('Error fetching media files:', error);
    else setMediaFiles(data);
  };

  const fetchMediaTags = async () => {
    const { data, error } = await supabase.from('media_tags').select('*');
    if (error) console.error('Error fetching media tags:', error);
    else setTags(data);
  };

  const fetchContentTypes = async () => {
    const { data, error } = await supabase.from('content_types').select('*').eq('enabled', 'TRUE').order('name', { ascending: true });
    if (error) console.error('Error fetching media types:', error);
    else setContentTypes(data);
  };

  const uploadMediaFile = async () => {
    if (!selectedFile || !selectedCover) {
      setErrorMessage('Please select both a file and a cover image.');
      return;
    }

    setLoading(true);

    // Get the current timestamp
    const timestamp = new Date().getTime();  // Call getTime() to get the timestamp in milliseconds

    // Sanitize filenames and append timestamp
    const sanitizedFileName = `${timestamp}_${selectedFile.name.replace(/\s+/g, '_')}`;
    const sanitizedCoverName = `${timestamp}_${selectedCover.name.replace(/\s+/g, '_')}`;

    console.log("Sanitized file name with timestamp:", sanitizedFileName);
    console.log("Sanitized cover name with timestamp:", sanitizedCoverName);

    const filePath = `files/${contentType}/${sanitizedFileName}`;
    const coverPath = `covers/${contentType}/${sanitizedCoverName}`;

    try {
      // ✅ Upload cover image to Supabase Storage
      const { data: coverData, error: coverError } = await supabase.storage
        .from('media')
        .upload(coverPath, selectedCover, { cacheControl: '3600', upsert: false });

      if (coverError) {
        setErrorMessage('Error uploading cover to Supabase.');
        console.error('Cover upload error:', coverError);
        return;
      }

      // Get public URL for cover
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(coverPath);
      const coverPublicUrl = publicUrlData.publicUrl;

      // ✅ Upload audio file to Wasabi
      const fileWasabiUrl = await uploadToWasabi(s3, selectedFile, filePath);

      // ✅ Save media details to database
      const { data, error } = await supabase
        .from('media_files')
        .insert([
          {
            title,
            name,
            album,
            genre,
            language,
            cover_url: coverPublicUrl, // Supabase Storage URL
            duration: 0,
            file_url: fileWasabiUrl, // Wasabi URL
            is_kids_content: isKidsContent,
            content_type: contentType,
            lyrics,
            tag,
            file_path: filePath,
            cover_path: coverPath
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
      const file = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (file.output && file.output.length > 0) {
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
        setSelectedCover(cover.output[0]);
      } else {
        setErrorMessage('Cover selection cancelled.');
      }
    } catch (error) {
      console.error('Error selecting cover:', error);
      setErrorMessage('Error selecting cover.');
    }
  };

  const deleteMediaFile = async (id, filePath, coverPath) => {
    try {
      console.info('Original filePath:', filePath);
      console.info('Original coverPath:', coverPath);
  
      // Extract the relative path from the full URL
      // const bucketBaseUrl = 'https://mldtimypnbudwihsnesc.supabase.co/storage/v1/object/public/media/';
      // const relativeFilePath = filePath.replace(bucketBaseUrl, '');
      // const relativeCoverPath = coverPath.replace(bucketBaseUrl, '');
  
      console.info(' filePath:', filePath);
      console.info(' coverPath:', coverPath);
  
      // Delete from the database
      const { error: deleteError } = await supabase.from('media_files').delete().eq('id', id);
      if (deleteError) {
        console.error('Error deleting media file from database:', deleteError);
        return;
      }
  
      // Delete the main file from storage
      if (filePath) {

        deleteFromWasabi(s3,filePath);

        // const { error: fileStorageError } = await supabase.storage.from('media').remove([filePath]);
        // if (fileStorageError) {
        //   console.error('Error deleting file from storage:', fileStorageError.message);
        // } else {
        //   console.info('File deleted from storage:', filePath);
        // }

      }
  
      // Delete the cover file from storage
      if (coverPath) {
        const { error: coverStorageError } = await supabase.storage.from('media').remove([coverPath]);
        if (coverStorageError) {
          console.error('Error deleting cover from storage:', coverStorageError.message);
        } else {
          console.info('Cover deleted from storage:', coverPath);
        }
      }
  
      // Refresh the media files list
      fetchMediaFiles();
    } catch (error) {
      console.error('Unexpected error during deletion:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.cover_url && <Image source={{ uri: item.cover_url }} style={styles.coverImage} />}
      <Text style={styles.itemText}>{item.title}</Text>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      {contentType === 'song' && <Text style={styles.itemText}>Album: {item.album}</Text>}
      {contentType === 'song' && <Text style={styles.itemText}>Genre: {item.genre}</Text>}
      <Text style={styles.itemText}>Language: {item.language}</Text>
      <Text style={styles.itemText}>Kids Content: {item.is_kids_content ? 'Yes' : 'No'}</Text>
      {contentType === 'song' && <Text style={styles.itemText}>Lyrics: {item.lyrics}</Text>}
      <TouchableOpacity onPress={() => deleteMediaFile(item.id, item.file_path, item.cover_path)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Content Type</Text>
      <Picker selectedValue={contentType} onValueChange={(itemValue) => setContentType(itemValue)} style={styles.picker}>
      <Picker.Item label="Select Media Type" value={null} />
        {contentTypes.map((contentType) => (
          <Picker.Item key={contentType.id} label={contentType.name} value={contentType.name} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      {contentType === 'song' && <TextInput style={styles.input} placeholder="Album" value={album} onChangeText={setAlbum} />}
      {contentType === 'song' && <TextInput style={styles.input} placeholder="Genre" value={genre} onChangeText={setGenre} />}
      <TextInput style={styles.input} placeholder="Language" value={language} onChangeText={setLanguage} />
      {contentType === 'song' && <TextInput style={styles.input} placeholder="Lyrics" value={lyrics} onChangeText={setLyrics} />}
      
      <Text style={styles.label}>Tag</Text>
      <Picker selectedValue={tag} onValueChange={(itemValue) => setTag(itemValue)} style={styles.picker}>
      <Picker.Item label="Select Media Tag" value={null} />
        {tags.map((tag) => (
          <Picker.Item key={tag.id} label={tag.name} value={tag.name} />
        ))}
      </Picker>

      <View style={styles.checkboxContainer}>
        <Text>Kids Content</Text>
        <CheckBox value={isKidsContent} onValueChange={setIsKidsContent} />
      </View>

      <Button title="Select File" onPress={selectFile} />
      <Button title="Select Cover" onPress={selectCover} />
      <Button title="Upload Media File" onPress={uploadMediaFile} disabled={loading} />


      {/* Display loading indicator if upload is in progress */}
      {loading && <ActivityIndicator size="small" color="#0000ff" />}

      {/* Display success or error message */}
            {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

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
  );
};

const styles = StyleSheet.create({
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
  deleteButton: {
    color: 'red',
    marginTop: 10,
  },
  coverImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

export default ManageMediaFiles;
