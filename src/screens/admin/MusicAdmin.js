import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput, TouchableOpacity, Image, CheckBox } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../services/supabase-db/SupabaseClient';

const MusicAdmin = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [isKidsContent, setIsKidsContent] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);

  useEffect(() => {
    fetchMusicFiles();
  }, []);

  const fetchMusicFiles = async () => {
    const { data, error } = await supabase.from('music_files').select('*');

    if (error) {
      console.error('Error fetching music files:', error);
    } else {
      setMusicFiles(data);
    }
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

        const { data: fileData, error: fileError } = await supabase.storage
            .from('music')
            .upload(filePath, selectedFile, {
                cacheControl: '3600',
                upsert: false,
            });

        const { data: coverData, error: coverError } = await supabase.storage
            .from('music')
            .upload(coverPath, selectedCover, {
                cacheControl: '3600',
                upsert: false,
            });

        if (fileError || coverError) {
            console.error('Error uploading files:', fileError || coverError);
        } else {
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
        }
    } else {
        console.error('File selection was cancelled or failed.');
  }
};


  const deleteMusicFile = async (id, filePath, coverPath) => {
    const { error: deleteError } = await supabase.from('music_files').delete().eq('id', id);

    if (deleteError) {
      console.error('Error deleting music file:', deleteError);
    } else {
      const { error: fileStorageError } = await supabase.storage.from('music').remove([filePath]);

      const { error: coverStorageError } = await supabase.storage.from('covers').remove([coverPath]);

      if (fileStorageError || coverStorageError) {
        console.error('Error deleting files from storage:', fileStorageError || coverStorageError);
      } else {
        fetchMusicFiles();
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.cover_url && <Image source={{ uri: item.cover_url }} style={styles.coverImage} />}
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
      <TextInput style={styles.input} placeholder="File Name" value={fileName} onChangeText={setFileName} />
      <TextInput style={styles.input} placeholder="Artist" value={artist} onChangeText={setArtist} />
      <TextInput style={styles.input} placeholder="Genre" value={genre} onChangeText={setGenre} />
      <View style={styles.checkboxContainer}>
        <Text>Kids Content</Text>
        <CheckBox value={isKidsContent} onValueChange={setIsKidsContent} />
      </View>
      <Button title="Upload Music File" onPress={uploadMusicFile} />
      {selectedFile && (
        <View style={styles.selectedFileContainer}>
          <Text>Selected Music File: {selectedFile.name}</Text>
        </View>
      )}
      {selectedCover && (
        <View style={styles.selectedCoverContainer}>
          <Text>Selected Cover Image: {selectedCover.name}</Text>
        </View>
      )}
      <FlatList data={musicFiles} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
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
});

export default MusicAdmin;
