import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput, TouchableOpacity, Image, CheckBox, ProgressBarAndroid } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../services/supabase-db/SupabaseClient';

const MusicAdmin = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [isKidsContent, setIsKidsContent] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchMusicFiles();
  }, []);

  const fetchMusicFiles = async () => {
    const { data, error } = await supabase
      .from('music_files')
      .select('*');

    if (error) {
      console.error('Error fetching music files:', error);
    } else {
      setMusicFiles(data);
    }
  };

  const uploadFileWithProgress = async (file, filePath, onProgress) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      throw new Error('Error retrieving session: ' + sessionError.message);
    }
    const token = sessionData.session.access_token;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${supabase.storageUrl}/object/upload/${filePath}`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      });
      xhr.send(formData);
    });
  };

  const uploadMusicFile = async () => {
    console.log('Uploading music file...');
    const file = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    const cover = await DocumentPicker.getDocumentAsync({ type: 'image/*' });

    console.log('File:', file);
    console.log('Cover:', cover);

    if (file.output && file.output.length > 0 && cover.output && cover.output.length > 0) {
      const selectedFile = file.output[0];
      const selectedCover = cover.output[0];

      const filePath = `music/${selectedFile.name}`;
      const coverPath = `covers/${selectedCover.name}`;

      try {
        await uploadFileWithProgress(selectedFile, filePath, setUploadProgress);
        await uploadFileWithProgress(selectedCover, coverPath, setUploadProgress);

        const filePublicUrlResponse = supabase.storage
          .from('music')
          .getPublicUrl(filePath);

        const coverPublicUrlResponse = supabase.storage
          .from('music')
          .getPublicUrl(coverPath);

        console.log('filePublicUrlResponse:', filePublicUrlResponse);
        console.log('coverPublicUrlResponse:', coverPublicUrlResponse);

        const filePublicUrl = filePublicUrlResponse.data.publicUrl;
        const coverPublicUrl = coverPublicUrlResponse.data.publicUrl;

        if (!filePublicUrl || !coverPublicUrl) {
          console.error('Error getting public URLs. File Public URL:', filePublicUrl, 'Cover Public URL:', coverPublicUrl);
          return;
        }

        const { data, error } = await supabase
          .from('music_files')
          .insert([
            {
              name: fileName,
              artist,
              genre,
              file_url: filePublicUrl,
              cover_url: coverPublicUrl,
              is_kids_content: isKidsContent,
            },
          ]);

        if (error) {
          console.error('Error inserting music file:', error.message);
        } else {
          console.log('Insert successful:', data);
          fetchMusicFiles();
        }
      } catch (error) {
        console.error('Error uploading files:', error.message);
      }
    } else {
      console.error('File selection was cancelled or failed.');
    }
  };

  const deleteMusicFile = async (id, filePath, coverPath) => {
    const { error: deleteError } = await supabase
      .from('music_files')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting music file:', deleteError);
    } else {
      const { error: fileStorageError } = await supabase.storage
        .from('music')
        .remove([filePath]);

      const { error: coverStorageError } = await supabase.storage
        .from('music')
        .remove([coverPath]);

      if (fileStorageError || coverStorageError) {
        console.error('Error deleting files from storage:', fileStorageError || coverStorageError);
      } else {
        fetchMusicFiles();
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.cover_url && (
        <Image source={{ uri: item.cover_url }} style={styles.coverImage} />
      )}
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>Artist: {item.artist}</Text>
      <Text style={styles.itemText}>Genre: {item.genre}</Text>
      <Text style={styles.itemText}>Kids Content: {item.is_kids_content ? 'Yes' : 'No'}</Text>
      <TouchableOpacity onPress={() => deleteMusicFile(item.id, item.file_url, item.cover_url)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="File Name"
        value={fileName}
        onChangeText={setFileName}
      />
      <TextInput
        style={styles.input}
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <View style={styles.checkboxContainer}>
        <Text>Kids Content</Text>
        <CheckBox
          value={isKidsContent}
          onValueChange={setIsKidsContent}
        />
      </View>
      {uploadProgress > 0 && (
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={uploadProgress / 100}
        />
      )}
      <Button title="Upload Music File" onPress={uploadMusicFile} />
      <FlatList
        data={musicFiles}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
});

export default MusicAdmin;
