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
      </View>

      <View style={styles.thumbnailRow}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.thumbnailWrapper}
            onPress={handleAddImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.thumbnail} />
            ) : (
              <View style={styles.emptyThumbnail}>
                <Ionicons name="image-outline" size={20} color="#ccc" />
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
});
