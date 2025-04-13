import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import AppButton from '@/components/AppButton';
import axios from 'axios';
import { UserContext } from '@/utils/UserContext';

const AddProduct = () => {
  const { user, updateData } = useContext(UserContext);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Product');
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState([null]);
  const [loading, setLoading] = useState(false);

  const MAX_IMAGES = 5;

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productCategory || productImages.some(img => !img)) {
      Alert.alert('Error', 'Please fill in all fields and upload at least one image.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', productDescription);
      formData.append('category', productCategory);
      formData.append('price', productPrice);
      productImages.forEach((image, index) => {
        formData.append(`image_${index + 1}`, {
          name: image.uri.split('/').pop(),
          uri: image.uri,
          type: `image/${image.uri.split('.').pop()}`,
        });
      });
      formData.append('sellerId', user._id);
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/product/create`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Product added successfully.');
      resetForm();
      await updateData();
      router.push('/(tabs)/products');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductDescription('');
    setProductImages([null]);
  };

  const pickImage = async (index) => {
    // if (productImages.length > MAX_IMAGES && !productImages[index]) {
    //   Alert.alert('Error', `You can upload a maximum of ${MAX_IMAGES} images.`);
    //   return;
    // }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll access is required to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = [...productImages];
        newImages[index] = result.assets[0];
        setProductImages(newImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };


  const addImageField = () => {
    if (productImages.length < MAX_IMAGES) {
      setProductImages([...productImages, null]);
    } else {
      Alert.alert('Error', `You can upload a maximum of ${MAX_IMAGES} images.`);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={productName}
          onChangeText={setProductName}
        />

        <Text style={styles.label}>Product Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product price"
          keyboardType="numeric"
          value={productPrice}
          onChangeText={setProductPrice}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter product description"
          value={productDescription}
          onChangeText={setProductDescription}
          multiline
        />

        <Text style={styles.label}>Upload Product Images</Text>
        <ScrollView horizontal style={imagePickerStyles.imageRow}>
          {productImages.map((image, index) => (
            <View key={index} style={imagePickerStyles.imageContainer}>
              <TouchableOpacity
                style={imagePickerStyles.imageBox}
                onPress={() => pickImage(index)}
              >
                {image?.uri ? (
                  <Image source={{ uri: image.uri }} style={imagePickerStyles.image} />
                ) : (
                  <Text style={imagePickerStyles.placeholderText}>Tap to upload</Text>
                )}
              </TouchableOpacity>
              {index === productImages.length - 1 && productImages.length < 5 && (
                <TouchableOpacity onPress={addImageField} style={imagePickerStyles.addIconBox}>
                  <Text style={imagePickerStyles.addIcon}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <AppButton title="Add Product" onPress={handleAddProduct} />
      </ScrollView>

      {loading && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Submitting...</Text>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    textAlignVertical: 'top',
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#ffffff',
  },
});

const imagePickerStyles = StyleSheet.create({
  imageRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#1254e8',
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  addIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1254e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  addIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AddProduct;
