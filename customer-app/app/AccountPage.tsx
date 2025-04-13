import { UserContext } from '@/utils/UserContext';
import { Stack } from 'expo-router';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const AccountPage = () => {
    const { user, updateData } = useContext(UserContext)
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name);
    const [address, setAddress] = useState(user?.address);
    const [city, setCity] = useState(user?.city);
    const [state, setState] = useState(user?.state);
    const [pinCode, setPinCode] = useState(user?.pinCode)
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNo);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/customer/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: user._id,
                    name,
                    address,
                    city,
                    state,
                    pinCode,
                    phoneNo: phoneNumber
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                toggleEdit()
                updateData()
                Alert.alert("Success", responseData.message)
            }
        } catch (error) {
            Alert.alert("Error", "Something wenst wrong while updating store")
            console.log(error)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Profile",
                    headerTitleStyle: {
                        color: '#000000'
                    },
                }}
            />

            {/* Shop Name */}
            <View style={styles.inputRow}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    editable={isEditing}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            {/* Shop Address */}
            <View style={styles.inputRow}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    editable={isEditing}
                    value={address}
                    onChangeText={setAddress}
                />
            </View>

            {/* City */}
            <View style={styles.inputRow}>
                <Text style={styles.label}>City/Town/Village</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    editable={isEditing}
                    value={city}
                    onChangeText={setCity}
                />
            </View>

            {/* State */}
            <View style={styles.inputRow}>
                <Text style={styles.label}>State</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    editable={isEditing}
                    value={state}
                    onChangeText={setState}
                />
            </View>

            <View style={styles.inputRow}>
                <Text style={styles.label}>Pin code</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    editable={isEditing}
                    value={pinCode+""}
                    onChangeText={setPinCode}
                />
            </View>

            {/* Phone Number */}
            <View style={styles.inputRow}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    editable={isEditing}
                    value={phoneNumber+""}
                    onChangeText={setPhoneNumber}
                />
            </View>

            {isEditing ?
                <TouchableOpacity style={styles.editButton} onPress={handleSubmit}>
                    <Text style={styles.editButtonText}>Save Changes</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
                    <Text style={styles.editButtonText}>Edit Details</Text>
                </TouchableOpacity>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#ffffff"
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputRow: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 6,
    },
    input: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: '#F0F0F0',
    },
    disabledInput: {
        backgroundColor: '#F0F0F0',
        color: '#757575',
    },
    editButton: {
        backgroundColor: '#1254e8',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    editButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
    }
});

export default AccountPage;
