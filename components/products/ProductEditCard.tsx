import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, ProductChannel } from '@/types/Product';
import { InventoryListFullScreen } from '@/components/inventory/InventoryListFullScreen';
import * as ImagePicker from 'expo-image-picker';
import { uploadProductImage } from '@/services/SevallaStorageService';

// Extended product type for UI actions
type ProductWithUIActions = Product & {
  saveAction?: boolean;
};
import { ProductOptionsFullScreen } from '@/components/products/ProductOptionsFullScreen';
import { ProductModifiersFullScreen } from '@/components/products/ProductModifiersFullScreen';
import { ProductMetafieldsFullScreen } from '@/components/products/ProductMetafieldsFullScreen';
import { ProductNotesFullScreen } from '@/components/products/ProductNotesFullScreen';

type ProductEditCardProps = {
  product: Product;
  onSave: (updatedProduct: ProductWithUIActions) => void;
  onBack?: () => void;
};

// Helper functions to check channel status
const isPosEnabled = (channels: ProductChannel[] | null | undefined) => {
  if (!channels) return false;
  const posChannel = channels.find(c => c.name === 'POS');
  return posChannel ? posChannel.enabled : false;
};

const isOnlineEnabled = (channels: ProductChannel[] | null | undefined) => {
  if (!channels) return false;
  const onlineChannel = channels.find(c => c.name === 'Online');
  return onlineChannel ? onlineChannel.enabled : false;
};

export function ProductEditCard({ product, onSave, onBack }: ProductEditCardProps) {
  // State for managing drawer visibility
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isModifiersVisible, setIsModifiersVisible] = useState(false);
  const [isMetafieldsVisible, setIsMetafieldsVisible] = useState(false);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  // Local state for product data
  const [localProduct, setLocalProduct] = useState<Product>(product);

  // Handler functions for saving data from drawers
  const handleSaveOptions = (options: any) => {
    setLocalProduct(prev => ({ ...prev, options }));
    onSave({ ...localProduct, options });
  };

  const handleSaveModifiers = (modifiers: any) => {
    setLocalProduct(prev => ({ ...prev, modifiers }));
    onSave({ ...localProduct, modifiers });
  };

  const handleSaveMetafields = (metafields: any) => {
    setLocalProduct(prev => ({ ...prev, metafields }));
    onSave({ ...localProduct, metafields });
  };

  const handleSaveNotes = (notes: string) => {
    setLocalProduct(prev => ({ ...prev, notes }));
    onSave({ ...localProduct, notes });
  };

  // Handle image upload
  const handleImageUpload = async (index: number) => {
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

        // Set uploading state to show loading indicator
        setUploadingImageIndex(index);

        try {
          // Upload the image to Sevalla storage
          const imageUrl = await uploadProductImage(selectedImageUri);

          // Update the product with the new image URL
          const updatedProduct = { ...localProduct };

          // Update the appropriate field based on index
          switch (index) {
            case 0:
              updatedProduct.f1 = imageUrl;
              break;
            case 1:
              updatedProduct.f2 = imageUrl;
              break;
            case 2:
              updatedProduct.f3 = imageUrl;
              break;
            case 3:
              updatedProduct.f4 = imageUrl;
              break;
            case 4:
              updatedProduct.f5 = imageUrl;
              break;
          }

          // Update local state
          setLocalProduct(updatedProduct);

          // Save the updated product
          onSave(updatedProduct);
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
        } finally {
          setUploadingImageIndex(null);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Render product images
  const renderProductImages = () => {
    // Create an array of 5 elements to ensure we always show 5 image tiles
    const displayImages = [
      localProduct.f1 || null,
      localProduct.f2 || null,
      localProduct.f3 || null,
      localProduct.f4 || null,
      localProduct.f5 || null
    ];

    return (
      <View style={styles.imagesContainer}>
        {displayImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageWrapper}
            activeOpacity={0.7}
            onPress={() => handleImageUpload(index)}
          >
            {uploadingImageIndex === index ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0066cc" />
              </View>
            ) : image ? (
              <Image source={{ uri: image as string }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>f{index + 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>

      {/* Product Images */}
      {renderProductImages()}

      {/* Inventory Section */}
      <TouchableOpacity
        style={styles.inventorySection}
        onPress={() => setIsInventoryVisible(true)}
      >
        <View style={styles.inventoryLeft}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          <Text style={styles.inventoryCount}>{product.stock || 5}</Text>
        </View>
        <View style={styles.inventoryRight}>
          <Text style={styles.stockTitle}>Stock</Text>
          <Text style={styles.priceRange}>
            5$ - 10$
          </Text>
          <Text style={styles.unitsText}>units</Text>
        </View>
      </TouchableOpacity>

      {/* Options and Modifiers Section - Both with same design */}
      <View style={styles.inventorySection}>
        <TouchableOpacity
          style={styles.optionModifierTile}
          onPress={() => setIsOptionsVisible(true)}
        >
          <Text style={styles.sectionTitle}>Options</Text>
          <Text style={styles.inventoryCount}>{(product.options || []).length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionModifierTile, { borderRightWidth: 0 }]}
          onPress={() => setIsModifiersVisible(true)}
        >
          <Text style={[styles.sectionTitle, styles.rightAlignedText]}>Modifiers</Text>
          <Text style={[styles.inventoryCount, styles.rightAlignedText]}>{(product.modifiers || []).length}</Text>
        </TouchableOpacity>
      </View>

      {/* Metafields and Notes Section - Both with same design */}
      <View style={styles.inventorySection}>
        <TouchableOpacity
          style={styles.optionModifierTile}
          onPress={() => setIsMetafieldsVisible(true)}
        >
          <Text style={styles.sectionTitle}>Metafields</Text>
          <Text style={styles.inventoryCount}>{(product.metafields || []).length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionModifierTile, { borderRightWidth: 0 }]}
          onPress={() => setIsNotesVisible(true)}
        >
          <Text style={[styles.sectionTitle, styles.rightAlignedText]}>Notes</Text>
          <Text style={[styles.inventoryCount, styles.rightAlignedText]}>
            {product.notes ? '1' : '0'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Collection and Category in one row */}
      <View style={styles.tileRow}>
        <TouchableOpacity style={styles.simpleTile}>
          <View style={styles.tileContentRow}>
            <Text style={styles.simpleTileTitle}>Collection</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.simpleTile, styles.lastTile]}>
          <View style={[styles.tileContentRow, styles.rightAlignedContent]}>
            <Text style={styles.simpleTileTitle}>Category</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* POS and Online Tiles */}
      <View style={styles.tileRow}>
        <TouchableOpacity
          style={styles.simpleTile}
          onPress={() => {
            // Toggle POS channel
            const channels = [...(localProduct.channels || [])]
            const posIndex = channels.findIndex(c => c.name === 'POS')
            if (posIndex >= 0) {
              channels[posIndex].enabled = !channels[posIndex].enabled
            } else {
              channels.push({ id: 'pos', name: 'POS', enabled: true })
            }
            setLocalProduct(prev => ({ ...prev, channels }))
          }}
        >
          <View style={styles.tileContentRow}>
            <Text style={styles.simpleTileTitle}>POS</Text>
            <View style={[styles.statusDot, {
              backgroundColor: isPosEnabled(localProduct.channels) ? '#FF3B30' : '#ccc'
            }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.simpleTile, styles.lastTile]}
          onPress={() => {
            // Toggle Online channel
            const channels = [...(localProduct.channels || [])]
            const onlineIndex = channels.findIndex(c => c.name === 'Online')
            if (onlineIndex >= 0) {
              channels[onlineIndex].enabled = !channels[onlineIndex].enabled
            } else {
              channels.push({ id: 'online', name: 'Online', enabled: true })
            }
            setLocalProduct(prev => ({ ...prev, channels }))
          }}
        >
          <View style={[styles.tileContentRow, styles.rightAlignedContent]}>
            <Text style={styles.simpleTileTitle}>Online</Text>
            <View style={[styles.statusDot, {
              backgroundColor: isOnlineEnabled(localProduct.channels) ? '#FF3B30' : '#ccc'
            }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Back and Save Tiles */}
      <View style={styles.backTileContainer}>
        <TouchableOpacity style={styles.backTile} onPress={onBack}>
          <Ionicons name="arrow-back-outline" size={24} color="#666" />
          <Text style={styles.backTileText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveTile}
          onPress={() => {
            // Make sure channels are included in the save
            onSave({...localProduct, saveAction: true})
          }}
        >
          <Ionicons name="checkmark-outline" size={24} color="#fff" />
          <Text style={styles.saveTileText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Full Screen Components */}
      <InventoryListFullScreen
        visible={isInventoryVisible}
        productId={product.id}
        onClose={() => setIsInventoryVisible(false)}
      />

      <ProductOptionsFullScreen
        visible={isOptionsVisible}
        options={localProduct.options || []}
        onClose={() => setIsOptionsVisible(false)}
        onSave={handleSaveOptions}
      />

      <ProductModifiersFullScreen
        visible={isModifiersVisible}
        modifiers={localProduct.modifiers || []}
        onClose={() => setIsModifiersVisible(false)}
        onSave={handleSaveModifiers}
      />

      <ProductMetafieldsFullScreen
        visible={isMetafieldsVisible}
        metafields={localProduct.metafields || []}
        onClose={() => setIsMetafieldsVisible(false)}
        onSave={handleSaveMetafields}
        title="Metafields"
      />

      <ProductNotesFullScreen
        visible={isNotesVisible}
        notes={localProduct.notes || ''}
        onClose={() => setIsNotesVisible(false)}
        onSave={handleSaveNotes}
      />


    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0, // No padding at the top
  },
  imagesContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    width: '100%',
  },
  imageWrapper: {
    width: width / 5, // Exactly 1/5 of screen width
    height: width / 5, // Make it square
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inventorySection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inventoryLeft: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  optionModifierTile: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  inventoryRight: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inventoryCount: {
    fontSize: 48,
    fontWeight: '200',
    color: '#ccc',
    marginTop: 8,
  },
  inventoryValue: {
    fontSize: 24,
    fontWeight: '300',
    color: '#666',
    marginTop: 8,
  },
  stockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  priceRange: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'right',
  },
  unitsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },

  gridContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    minHeight: 80,
    justifyContent: 'center',
  },
  gridItemWide: {
    flex: 2,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    minHeight: 80,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  gridItemValue: {
    fontSize: 14,
    color: '#666',
  },
  fourColumnRow: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 80, // Original height
  },
  columnItem: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  columnValue: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  lastColumnItem: {
    borderRightWidth: 0,
  },
  backTileContainer: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backTile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 0,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    minHeight: 80,
  },
  backTileText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  saveTile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 0,
    flex: 1,
    minHeight: 80,
  },
  saveTileText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
  },
  rightAlignedText: {
    textAlign: 'right',
  },
  channelRow: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 60, // Smaller height than other rows
  },
  channelItem: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30', // Red dot
    marginLeft: 8, // Add spacing between text and dot
  },
  rightAlignedDot: {
    alignSelf: 'flex-end',
    marginRight: '45%', // Center the dot horizontally when right-aligned
  },
  rightAlignedItem: {
    alignItems: 'flex-end',
    paddingRight: 16, // Add some padding on the right
  },
  leftAlignedText: {
    textAlign: 'left',
  },
  leftAlignedItem: {
    alignItems: 'flex-start',
    paddingLeft: 16, // Add some padding on the left
  },
  tileRow: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  simpleTile: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    height: 60, // Fixed height for consistency
  },
  simpleTileTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  lastTile: {
    borderRightWidth: 0,
  },
  tileContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  rightAlignedContent: {
    justifyContent: 'flex-end',
  },
});
