import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const handleAddImage = () => {
    // In a real app, this would open an image picker
    // For this example, we'll just add a placeholder URL
    if (images.filter(img => img !== null).length >= maxImages) {
      Alert.alert('Error', `Maximum ${maxImages} images allowed`);
      return;
    }

    const placeholderUrl = 'https://via.placeholder.com/300x300?text=Product+Image';
    
    // Find the first null slot and replace it
    const newImages = [...images];
    const nullIndex = newImages.findIndex(img => img === null);
    
    if (nullIndex !== -1) {
      newImages[nullIndex] = placeholderUrl;
    } else {
      newImages.push(placeholderUrl);
    }
    
    onChange(newImages);
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
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddImage}
        >
          <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.addButtonText}>Add Image</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.imagesScrollView}
        contentContainerStyle={styles.imagesContainer}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
                <Text style={styles.imageLabel}>
                  {index === 0 ? 'Main' : `Image ${index + 1}`}
                </Text>
              </>
            ) : (
              <View style={styles.emptyImage}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
                <Text style={styles.emptyImageText}>
                  {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  imagesScrollView: {
    flexGrow: 0,
  },
  imagesContainer: {
    paddingRight: 16,
  },
  imageWrapper: {
    width: 120,
    height: 150,
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  imageLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyImage: {
    width: 120,
    height: 120,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emptyImageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});
