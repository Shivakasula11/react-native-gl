import React, { useState, useContext } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { supabase } from '../services/supabase-db/SupabaseClient';
import { UserContext } from '../contexts/UserContext';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const { user } = useContext(UserContext);

  // Pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
  
    console.log(result); // Check the result structure
  
    if (!result.canceled) {
      const uri = result.assets[0].uri; // Access the URI properly
      setImageUri(uri);
      console.log(uri); // Log the URI directly
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async () => {
    if (!imageUri) return null;
  
    const fileName = `wall_assets/${Date.now()}.jpg`; // Ensure the file has a unique name
    const { data, error } = await supabase.storage.from('media').upload(fileName, {
      uri: imageUri,
      type: 'image/jpeg',
    });
  
    if (error) {
      Alert.alert('Upload failed', error.message);
      return null;
    }

  
    // Manually build the public URL (ensure 'media' bucket has public access)
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
  
    // Log the public URL
    console.log('Image public URL:', publicUrlData.publicUrl);
  
    if (!publicUrlData.publicUrl) {
      Alert.alert('Error', 'Unable to fetch the public URL for the image.');
      return null;
    }
  
    return publicUrlData.publicUrl;
  };

  // Submit post
  const submitPost = async () => {
    const mediaUrl = await uploadImage();

    const { error } = await supabase.from('wall_posts').insert([{ user_id: user.id, content, media_url: mediaUrl }]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setContent('');
      setImageUri(null);
      onPostCreated(); // Refresh posts
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share What's on Your Heart</Text>
      <TextInput
        placeholder="What's on your heart?"
        value={content}
        onChangeText={setContent}
        style={styles.textInput}
        multiline
        numberOfLines={4}
      />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      <View style={styles.buttonContainer}>
        <Button icon="image" mode="outlined" onPress={pickImage} style={styles.button}>
          Pick an Image
        </Button>
        <Button icon="send" mode="contained" onPress={submitPost} style={styles.postButton}>
          Post
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  textInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginRight: 10,
  },
  postButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
});

export default PostForm;