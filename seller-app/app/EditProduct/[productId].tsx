import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import AppButton from '@/components/AppButton';
import axios from 'axios';
import { UserContext } from '@/utils/UserContext';

const EditProduct = () => {
    const { productId } = useLocalSearchParams();
    const { user, updateData } = useContext(UserContext);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productImages, setProductImages] = useState([]); // Array for images
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/product/details/${productId}`);
                const product = response.data.data;

                setProductName(product.name);
                setProductPrice(product.price);
                setProductCategory(product.category);
                setProductDescription(product.description);

                // Filter valid image URLs (assuming they are saved under the 'images' object in the backend)
                const images = [
                    { uri: product?.images?.featuredImage },
                    { uri: product?.images?.image1 },
                    { uri: product?.images?.image2 },
                    { uri: product?.images?.image3 },
                    { uri: product?.images?.image4 }
                ].filter(image => image.uri);

                setProductImages(images);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    // Handles submitting form to update product data
    const handleUpdateProduct = async () => {
        if (!productName || !productPrice || !productCategory || productImages.length === 0) {
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
            formData.append('sellerId', user._id);

            productImages.forEach((image, index) => {
                formData.append(`image_${index + 1}`, {
                    name: image.uri.split('/').pop(),
                    uri: image.uri,
                    type: `image/${image.uri.split('.').pop()}`,
                });
            });

            await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/api/product/update/${productId}`, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('Success', 'Product updated successfully.');
            await updateData();
            router.push('/(tabs)/products');
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        setLoading(true);
                        await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/api/product/delete/${productId}`);
                        Alert.alert('Success', 'Product deleted successfully.');
                        await updateData();
                        router.push('/(tabs)/products');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete product.');
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    // Function to pick images (access media library)
    const pickImage = async (index) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Camera roll access is required to upload images.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                // Dynamically update selected image in productImages state at index
                const newImages = [...productImages];
                newImages[index] = result.assets[0]; // Replace image at the selected index with the picked image
                setProductImages(newImages);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    // Function to remove selected image from the images array
    const removeImage = (index) => {
        setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Function to dynamically add another image slot (used to add new slots for uploading images)
    const addImageField = () => {
        if (productImages.length < 5) {
            setProductImages((prevImages) => [...prevImages, null]); // Add a null object for a new empty image field
        } else {
            Alert.alert('Limit reached', 'You can only upload up to 5 images.');
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
                    value={productPrice + ""}
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

                <Text style={imagePickerStyles.label}>Upload Product Images</Text>
                <ScrollView horizontal style={imagePickerStyles.imageRow}>
                    {productImages.map((image, index) => (
                        <View key={index} style={imagePickerStyles.imageContainer}>
                            <TouchableOpacity
                                style={imagePickerStyles.imageBox}
                                onPress={() => pickImage(index)} // Attach picker to specific image index
                            >
                                {image?.uri ? (
                                    <Image source={{ uri: image.uri }} style={imagePickerStyles.image} />
                                ) : (
                                    <Text style={imagePickerStyles.placeholderText}>Tap to upload</Text>
                                )}
                            </TouchableOpacity>

                            {/* Only show the Add (+) button if less than 5 images are selected */}
                            {index === productImages.length - 1 && productImages.length < 5 && (
                                <TouchableOpacity onPress={addImageField} style={imagePickerStyles.addIconBox}>
                                    <Text style={imagePickerStyles.addIcon}>+</Text>
                                </TouchableOpacity>
                            )}

                            {/* Add the Remove button for each image */}
                            {image && (
                                <TouchableOpacity onPress={() => removeImage(index)} style={imagePickerStyles.deleteIconBox}>
                                    <Text style={imagePickerStyles.deleteIcon}>X</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </ScrollView>

                {/* Update button */}
                <AppButton title="Update Product" onPress={handleUpdateProduct} />

                {/* Delete product button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleDeleteProduct}>
                    <Text style={styles.logoutButtonText}>Delete Product</Text>
                </TouchableOpacity>
            </ScrollView>

            {loading && (
                <Modal transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.loadingText}>Updating...</Text>
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
    logoutButton: {
        marginTop: 12,
        paddingVertical: 12,
        backgroundColor: '#FF4D4F',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

const imagePickerStyles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
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
    deleteIconBox: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    deleteIcon: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default EditProduct;
