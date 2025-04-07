import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadProductImage } from '@/services/SevallaStorageService';

type ProductImagesEditorProps = {
  images: (string | null)[];
  onChange: (images: (string | null)[]) => void;
  maxImages?: number;
};

export function ProductImagesEditor({
  images,
  onChange,
  maxImages = 5
}: ProductImagesEditorProps) {
  const [uploading, setUploading] = useState<number | null>(null);

  const handleAddImage = async (index?: number) => {
    // Check if we've reached the maximum number of images
    if (images.filter(img => img !== null).length >= maxImages && index === undefined) {
      Alert.alert('Error', `Maximum ${maxImages} images allowed`);
      return;
    }

    // Request permission to access the photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photos');
      return;
    }

    try {
      // Open the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using deprecated API but still works
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;

        // Determine which index to update
        const targetIndex = index !== undefined ? index : images.findIndex(img => img === null);

        if (targetIndex === -1 && index === undefined) {
          Alert.alert('Error', `Maximum ${maxImages} images allowed`);
          return;
        }

        // Set uploading state to show loading indicator
        setUploading(targetIndex !== -1 ? targetIndex : images.length);

        try {
          // Upload the image to Sevalla storage
          const imageUrl = await uploadProductImage(selectedImageUri);

          // Update the images array
          const newImages = [...images];

          if (targetIndex !== -1) {
            newImages[targetIndex] = imageUrl;
          } else {
            newImages.push(imageUrl);
          }

          onChange(newImages);
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
        } finally {
          setUploading(null);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    onChange(newImages);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Product Images</Text>
      </View>

      <View style={styles.thumbnailRow}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.thumbnailWrapper}
            onPress={() => handleAddImage(index)}
          >
            {uploading === index ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0066cc" />
              </View>
            ) : image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.thumbnail} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyThumbnail}>
                <Ionicons name="image-outline" size={20} color="#ccc" />
                <Text style={styles.addText}>f{index + 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnailWrapper: {
    width: '18%',
    aspectRatio: 1,
    marginHorizontal: '1%',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  emptyThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  addText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
