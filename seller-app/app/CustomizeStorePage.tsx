import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import axios from 'axios';
import { UserContext } from '@/utils/UserContext';

const CustomizeStorePage = () => {
  const { user, updateData, isLoading } = useContext(UserContext)
  const [storeTitle, setStoreTitle] = useState('');
  const [storeAbout, setStoreAbout] = useState('');
  const [storeLogo, setStoreLogo] = useState({});
  const [storeBanner, setStoreBanner] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStoreTitle(user?.storeTitle)
    setStoreAbout(user?.about)
  }, [isLoading])

  const pickImage = async (setter) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Info", 'Sorry, we need camera roll permissions to make this work!');
        return;
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: false,
          quality: 1,
        });
        if (!result.canceled) {
          setter(result.assets[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (!storeTitle || !storeAbout) {
        Alert.alert('Error', 'Please fill in all fields and upload the required images.');
        return;
      }

      setLoading(true); // Show loading indicator

      // Prepare form data
      const formData = new FormData();
      formData.append("title", storeTitle.trim());
      formData.append("about", storeAbout.trim());

      if (storeLogo?.uri) {
        // Append logo image
        formData.append("logo", {
          name: storeLogo.uri.split('/').pop(),
          uri: storeLogo.uri,
          type: `image/${storeLogo.uri.split('.').pop()}`,
        });
      }

      if (storeBanner?.uri) {
        // Append banner image
        formData.append("banner", {
          name: storeBanner.uri.split('/').pop(),
          uri: storeBanner.uri,
          type: `image/${storeBanner.uri.split('.').pop()}`,
        });
      }

      // Append seller ID
      if (!user?._id) {
        Alert.alert("Error", "User information is missing. Please try logging in again.");
        setLoading(false);
        return;
      }
      formData.append("sellerId", user._id);

      // Send request
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/seller/update-store`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      // Update user data
      await updateData();

      Alert.alert("Success", "Store updated successfully!");
    } catch (error) {
      console.error("Error:", error.message);

      if (error.response) {
        console.error("Response Error:", error.response.data);
        Alert.alert("Error", error.response.data?.message || "Server responded with an error.");
      } else if (error.request) {
        console.error("Request Error:", error.request);
        Alert.alert("Error", "Request was made but no response was received. Please check your connection.");
      } else {
        console.error("General Error:", error.message);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: "Customize Store" }} />
        <View style={styles.formGroup}>
          <Text style={styles.label}>Store Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter store title"
            placeholderTextColor="#555"
            value={storeTitle}
            onChangeText={setStoreTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Store Logo</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setStoreLogo)}>
            {storeLogo.uri ? (
              <Image source={{ uri: storeLogo.uri }} style={styles.imagePreview} />
            ) : user?.logo ? (
              <Image source={{ uri: user?.logo }} style={styles.imagePreview} />
            ) : (
              <>
                <Image source={require('../assets/images/camera.png')} style={{height: 30, width: 30}} />
              <Text style={styles.imagePickerText}>Uplaod Store Logo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Store Cover</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setStoreBanner)}>
            {storeBanner.uri ? (
              <Image source={{ uri: storeBanner.uri }} style={styles.imagePreview} />
            ) : user?.banner ? (
              <Image source={{ uri: user?.banner }} style={styles.imagePreview} />
            ) : (
              <>
                <Image source={require('../assets/images/camera.png')} style={{height: 30, width: 30}} />
                <Text style={styles.imagePickerText}>Upload Store Cover</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>About Store</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write about your store"
            placeholderTextColor="#555"
            value={storeAbout}
            onChangeText={setStoreAbout}
            multiline={true}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for loading popup */}
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
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    height: 150,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#888',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#1254e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
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

export default CustomizeStorePage;
