import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Image } from 'react-native-elements';
import DropDownPicker from "react-native-dropdown-picker";
import { StatusBar } from 'expo-status-bar';
import { Picker } from "@react-native-picker/picker";

const SignupScreen = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        shopName: '',
        shopAddress: '',
        city: '',
        state: '',
        pinCode: '',
        mobile: ''
    });
    const [loading, setLoading] = useState(false)
    const [selectedValue, setSelectedValue] = useState(null);

    const [open, setOpen] = useState(false); // Dropdown open/close state
    const [value, setValue] = useState(null); // Selected value
    const [items, setItems] = useState(
        // Convert categories array into dropdown-friendly format
        [
            { label: "Kirana/Grocery", value: "Kirana/Grocery" },
            { label: "Personal Care", value: "Personal Care" },
            { label: "Household & Cleaning Business", value: "Household & Cleaning Business" },
            { label: "Fruits and Vegetables Shop", value: "Fruits and Vegetables Shop" },
            { label: "Dry Fruites & Sweets", value: "Dry Fruites & Sweets" },
            { label: "Textiles and Garments", value: "Textiles and Garments" },
            { label: "Footwear Shops", value: "Footwear Shops" },
            { label: "Jewelry Stores", value: "Jewelry Stores" },
            { label: "Stationery and Bookstores", value: "Stationery and Bookstores" },
            { label: "Furniture and Home Decor", value: "Furniture and Home Decor" },
            { label: "Hardware and Tools Stores", value: "Hardware and Tools Stores" },
            { label: "Electronics and Appliances", value: "Electronics and Appliances" },
            { label: "Bakery and Confectionery", value: "Bakery and Confectionery" },
            { label: "Dairy and Milk Products", value: "Dairy and Milk Products" },
            { label: "Sweet Shops", value: "Sweet Shops" },
            { label: "Flower Shops", value: "Flower Shops" },
            { label: "Meat and Fish Shops", value: "Meat and Fish Shops" },
            { label: "Pet Supplies", value: "Pet Supplies" },
            { label: "Supermarkets", value: "Supermarkets" },
            { label: "Pharmacies and Medical Stores", value: "Pharmacies and Medical Stores" },
            { label: "Sports Goods Stores", value: "Sports Goods Stores" },
            { label: "Toy Stores", value: "Toy Stores" },
            { label: "Secondhand Goods", value: "Secondhand Goods" },
            { label: "Pooja", value: "Pooja" },
            { label: "Agricultural Supplies", value: "Agricultural Supplies" },
            { label: "Other", value: "Other" },
        ]
    );

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            alert("Invalid email")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match. Please try again.")
            return
        }
        try {
            setLoading(true)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, shopCategory: selectedValue }),
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', result.message);
                router.push('/LoginScreen');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not send data to the server.');
        } finally {
            setLoading(false)
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <StatusBar backgroundColor='white' />
            <View style={styles.header}>
                {/* <Text style={styles.logoText}>Eazzy Business</Text> */}
                <Image style={styles.image} source={require("../assets/images/logo.png")} />
            </View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Fill in the details below to register</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={true}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    secureTextEntry={true}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Shop Name"
                    placeholderTextColor="#888"
                    value={formData.shopName}
                    onChangeText={(text) => handleInputChange('shopName', text)}
                />
                {/* <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Select store category"
                    placeholderStyle={{ color: "#888" }}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                /> */}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a category" value={null} color="#888" />
                        {items.map((item, index) => (
                            <Picker.Item key={index} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Shop Address"
                    placeholderTextColor="#888"
                    value={formData.shopAddress}
                    onChangeText={(text) => handleInputChange('shopAddress', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    placeholderTextColor="#888"
                    value={formData.city}
                    onChangeText={(text) => handleInputChange('city', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    placeholderTextColor="#888"
                    value={formData.state}
                    onChangeText={(text) => handleInputChange('state', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Pin code"
                    placeholderTextColor="#888"
                    value={formData.pinCode}
                    keyboardType="phone-pad"
                    onChangeText={(text) => handleInputChange('pinCode', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#888"
                    value={formData.mobile}
                    keyboardType="phone-pad"
                    onChangeText={(text) => handleInputChange('mobile', text)}
                />
            </View>

            {/* <Button
                title="Sign Up"
                buttonStyle={styles.signupButton}
                titleStyle={styles.signupButtonText}
                onPress={handleSubmit}
            /> */}

            <Button
                title={loading ? "" : "Sign Up"} // Hide the text when loading
                buttonStyle={styles.signupButton}
                titleStyle={styles.signupButtonText}
                onPress={handleSubmit}
                disabled={loading} // Optionally disable the button while loading
                icon={
                    loading && <ActivityIndicator size="small" color="#ffffff" />
                }
            />

            <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink} onPress={() => router.push("/LoginScreen")}>Log In</Text>
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    pickContainer: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    pickerContainer: {
        overflow: "hidden",
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: "100%",
        padding: 15,
        borderRadius: 10,
    },
    selectedText: {
        marginTop: 10,
        fontSize: 16,
    },
    dropdown: {
        borderColor: "#ccc",
        marginBottom: 10
    },
    dropdownContainer: {
        borderColor: "#ccc",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 30
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1254e8',
    },
    image: {
        width: 120,
        height: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    signupButton: {
        backgroundColor: '#1254e8',
        borderRadius: 8,
        paddingVertical: 15,
    },
    signupButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginTop: 20,
    },
    loginLink: {
        color: '#1254e8',
        fontWeight: 'bold',
    },
});

export default SignupScreen;
