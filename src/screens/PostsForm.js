// import React, { useState, useContext } from "react";
// import { View, TextInput, Alert, StyleSheet, Text, Image,Platform } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
// import { Button } from "react-native-paper";
// import { supabase } from "../services/supabase-db/SupabaseClient";
// import { UserContext } from "../contexts/UserContext";
// const PostForm = ({ onPostCreated }) => {
//   const [content, setContent] = useState("");
//   const [imageUri, setImageUri] = useState(null);
//   const { user } = useContext(UserContext);

//   const validateImage = async (uri) => {
//     console.log("Validating image:", uri);
//     if (Platform.OS === "web") {
//       const base64Data = uri.split(",")[1];
//       const fileSizeInBytes = (base64Data.length * 3) / 4;
//       const fileSizeInKB = fileSizeInBytes / 1024;

//       // console.log(`Estimated Web Image Size: ${fileSizeInKB.toFixed(2)} KB`);
//       console.log(fileSizeInKB.toFixed(2) > 200 ? "Image too large for web" : "Image size is acceptable");
//       if (fileSizeInKB.toFixed(2) > 200) {
        
//         if (Platform.OS === "web") {
//           alert("Image is less than 200KB"); // Native browser alert
//         } else {
//           Alert.alert("Image is less than 200KB"); // React Native alert for iOS/Android
//         }
//         return false;
//       }
//       return true;
//     }
  
//     try {
//       // Get file information
//       console.log("Getting file info for URI:", uri);
//       const info = await FileSystem.getInfoAsync(uri);

//       console.log("File info:", info);
//       if (!info.exists) {
//         Alert.alert("Error", "File does not exist.");
//         return false;
        
//       }
  
//       // Check file size
//       const fileSizeInMB = info.size / (1024 * 1024); // Convert bytes to MB
//       if (fileSizeInMB > 5) {
//         Alert.alert("Image too large", "Please choose an image under 5MB.");
//         return false;
//       }
  
//       // Check file extension
//       const extension = uri.split(".").pop().toLowerCase();
//       if (!["jpg", "jpeg", "png"].includes(extension)) {
//         Alert.alert(
//           "Invalid Format",
//           "Only JPG, JPEG, and PNG images are allowed. SVG and videos are not supported."
//         );
//         return false;
//       }
  
//       return true; // Validation passed
//     } catch (err) {
//       console.error("Error validating image:", err);
//       Alert.alert("Error", "Failed to validate the image.");
//       return false;
//     }
//   };
  
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "Media library access is needed.");
//       return;
//     }
  
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
  
//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       console.log("Image URI:", uri);
  
//       // Validate the selected image
//       const isValid = await validateImage(uri);
//       if (!isValid) {
//         console.log("Invalid image. Not selecting.");
//         return; // Do not set the image if validation fails
//       }
  
//       // Set the image URI if validation passes
//       setImageUri(uri);
//       console.log("Image picked and validated:", uri);
//     }
//   };
// const uploadImage = async () => {
//   if (!imageUri) return null;

//   const extension = imageUri.split(".").pop().toLowerCase();
//   const mimeType = extension === "png" ? "image/png" : "image/jpeg";
//   const fileName = `wall_assets/${Date.now()}.${extension}`;

//   try {
//     console.log("Uploading image...");
//     const response = await fetch(imageUri);
//     const blob = await response.blob();

//     const { data, error: uploadError } = await supabase.storage
//       .from("media")
//       .upload(fileName, blob, {
//         contentType: mimeType,
//         upsert: true,
//       });

//     if (uploadError) {
//       console.error("Upload error:", uploadError);
//       Alert.alert("Upload failed", uploadError.message);
//       return null;
//     }

//     console.log("Image uploaded successfully:", data);

//     const { data: publicUrlData, error: urlError } = supabase.storage
//       .from("media")
//       .getPublicUrl(fileName);

//     if (urlError || !publicUrlData?.publicUrl) {
//       console.error("Public URL error:", urlError);
//       Alert.alert("Error", "Unable to get public URL.");
//       return null;
//     }

//     console.log("Public URL generated:", publicUrlData.publicUrl);
//     return publicUrlData.publicUrl;
//   } catch (err) {
//     console.error("Upload exception:", err);
//     Alert.alert("Error", "Something went wrong while uploading.");
//     return null;
//   }
//   setLastPostedImage(mediaUrl);
// };

// const submitPost = async () => {
//   if (!content.trim() && !imageUri) {
//     Alert.alert("Validation Error", "Please provide content or an image.");
//     return;
//   }

//   try {
//     let mediaUrl = null;

//     // Upload the image if `imageUri` is provided
//     if (imageUri) {
//       mediaUrl = await uploadImage();
//       if (!mediaUrl) {
//         Alert.alert("Error", "Failed to upload the image.");
//         return;
//       }
//     }

//     // Inserting the post into the database
//     const { error } = await supabase
//       .from("wall_posts")
//       .insert([{ user_id: user.id, content, media_url: mediaUrl }]);

//     if (error) {
//       console.error("Insert post error:", error);
//       Alert.alert("Error", error.message);
//     } else {
//       // Reset the form after successful submission
//       setContent("");
//       setImageUri(null);
//       onPostCreated();
//       Alert.alert("Success", "Your post has been created!");
//     }
//   } catch (err) {
//     console.error("Submit post error:", err);
//     Alert.alert("Error", "Failed to submit the post.");
//   }
// };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Share What's on Your Heart</Text>
//       <TextInput
//         placeholder="What's on your heart?"
//         value={content}
//         onChangeText={setContent}
//         style={styles.textInput}
//         multiline
//         numberOfLines={4}
//       />
//       {imageUri && (
//         <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//       )}
//       <View style={styles.buttonContainer}>
//         <Button
//           icon="image"
//           mode="outlined"
//           onPress={pickImage}
//           style={styles.button}
//         >
//           Pick an Image
//         </Button>
//         <Button
//           icon="send"
//           mode="contained"
//           onPress={submitPost}
//           style={styles.postButton}
//         >
//           Post
//         </Button>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//     overflow: "hidden",
//     width: "93%",
//     alignSelf: "center",
//     marginTop: 22,
//     marginBottom: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   textInput: {
//     height: 100,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     fontSize: 16,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//   },
//   imagePreview: {
//     width: "100%",
//     height: 300,
//     borderRadius: 10,
//     marginVertical: 10,
//     resizeMode: "contain",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 15,
//   },
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   postButton: {
//     width: 140,
//     backgroundColor: "#4CAF50",
//   },
// });

// export default PostForm;  old code

// ------------------------------------------------------------------------------------------

import React, { useState, useContext } from "react";
import { View, TextInput, Alert, StyleSheet, Text, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Button } from "react-native-paper";
import { supabase } from "../services/supabase-db/SupabaseClient";
import { UserContext } from "../contexts/UserContext";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(null); // State to track uploaded image path
  const { user } = useContext(UserContext);

  const validateImage = async (uri) => {
    if (Platform.OS === "web") {
      const base64Data = uri.split(",")[1];
      const fileSizeInBytes = (base64Data.length * 3) / 4;
      const fileSizeInKB = fileSizeInBytes / 1024;

      if (fileSizeInKB.toFixed(2) > 200) {
        alert("Image must be less than 200KB on web");
        return false;
      }
      return true;
    }

    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        Alert.alert("Error", "File does not exist.");
        return false;
      }

      const fileSizeInMB = info.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        Alert.alert("Image too large", "Please choose an image under 5MB.");
        return false;
      }

      const extension = uri.split(".").pop().toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(extension)) {
        Alert.alert("Invalid Format", "Only JPG, JPEG, and PNG images are allowed.");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error validating image:", err);
      Alert.alert("Error", "Failed to validate the image.");
      return false;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Media library access is needed.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const isValid = await validateImage(uri);
      if (!isValid) return;

      setImageUri(uri);
    }
  };

  const uploadImage = async (imageUri) => {
 
    if (!imageUri) return null;

    const extension = imageUri.split(".").pop().toLowerCase();
 
    const mimeType = extension === "png" ? "image/png" : "image/jpeg";
 
    const fileName = `wall_assets/${Date.now()}.${extension}`;
 
    try {
      console.log("Uploading image...",imageUri);
      const response = await fetch(imageUri);
      
      const blob = await response.blob();
      
      const { data, error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, blob, {
          contentType: mimeType,
          upsert: true,
        });
         console.log("Upload data:", data); 
      if (uploadError) {
        console.error("Upload error:", uploadError);
        Alert.alert("Upload failed", uploadError.message);
        return null;
      }

      setUploadedImagePath(fileName); // Save path for deletion

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

      if (urlError || !publicUrlData?.publicUrl) {
        console.error("Public URL error:", urlError);
        Alert.alert("Error", "Unable to get public URL.");
        return null;
      }

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Upload exception:", err);
      Alert.alert("Error", "Something went wrong while uploading.");
      return null;
    }
  };

  const deleteImage = async () => {
    if (!uploadedImagePath) {
      setImageUri(null); // Just clear the preview if not uploaded
      return;
    }

    const { error } = await supabase.storage
      .from("media")
      .remove([uploadedImagePath]);

    if (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete image.");
      return;
    }

    Alert.alert("Success", "Image deleted successfully!");
    setImageUri(null);
    setUploadedImagePath(null);
  };

  const submitPost = async () => {
    if (!content.trim() && !imageUri) {
      Alert.alert("Validation Error", "Please provide content or an image.");
      return;
    }

    try {
      let mediaUrl = null;

      if (imageUri) {
        mediaUrl = await uploadImage(imageUri);
        if (!mediaUrl) {
          Alert.alert("Error", "Failed to upload the image.");
          return;
        }
      }

      const { error } = await supabase
        .from("wall_posts")
        .insert([{ user_id: user.id, content, media_url: mediaUrl }]);

      if (error) {
        console.error("Insert post error:", error);
        Alert.alert("Error", error.message);
      } else {
        setContent("");
        setImageUri(null);
        setUploadedImagePath(null);
        onPostCreated();
        Alert.alert("Success", "Your post has been created!");
      }
    } catch (err) {
      console.error("Submit post error:", err);
      Alert.alert("Error", "Failed to submit the post.");
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
      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <Button
            icon="delete"
            mode="outlined"
            onPress={deleteImage}
            style={[styles.deleteButton, { paddingVertical: 5, paddingHorizontal: 10 }]} // Reduced button size
            textColor="black"
          >
            Delete Image
          </Button>
        </>
      )}
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
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    width: "93%",
    alignSelf: "center",
    marginTop: 22,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  textInput: {
    height: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  deleteButton: {
    width: 180, // Reduced width
    alignSelf: "center", // Center the button
    marginVertical: 10, // Add margin for spacing
  },
  postButton: {
    width: 140,
    backgroundColor: "#4CAF50",
  },
});

export default PostForm;   








