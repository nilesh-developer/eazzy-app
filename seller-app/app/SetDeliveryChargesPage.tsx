import { UserContext } from "@/utils/UserContext";
import { isLoading } from "expo-font";
import { Stack } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ActivityIndicator } from "react-native";

const DeliveryChargeSetter = () => {
    const { user, isLoading } = useContext(UserContext)
    const [minOrderValue, setMinOrderValue] = useState(0);
    const [orderValue, setOrderValue] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [customCharge, setCustomCharge] = useState(0);
    const [loadingData, setLoadingData] = useState(false)
    const [loading, setLoading] = useState(false)

    const calculateCharge = () => {
        let charge = orderValue >= minOrderValue ? 0 : customCharge;
        setDeliveryCharge(charge);
    };

    const getSellerData = async () => {
        try {
            setLoadingData(true)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/get-delivery-charges/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setMinOrderValue(responseData.data.minOrderValueForDelivery)
                setCustomCharge(responseData.data.deliveryCharges)
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch data")
            console.log(error)
        } finally {
            setLoadingData(false)
        }
    }

    useEffect(() => {
        if (user) {
            getSellerData()
        }
    }, [isLoading])

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/set-delivery-charges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerId: user._id,
                    minOrderValueForDelivery: minOrderValue,
                    deliveryCharges: customCharge
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setMinOrderValue(responseData.data.minOrderValueForDelivery)
                setCustomCharge(responseData.data.deliveryCharges)
                Alert.alert("Success", responseData.message)
            }
        } catch (error) {
            Alert.alert("Error", "Something wenst wrong while updating store")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        title: "Back",
                        headerTitleStyle: {
                            color: '#333',
                        },
                        headerStyle: {
                            backgroundColor: '#FFFFFF',
                        },
                    }}
                />
                <Text style={styles.heading}>Set Delivery Charges</Text>

                <Text style={styles.label}>Minimum Order Value for Free Delivery (INR):</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={minOrderValue.toString()} onChangeText={setMinOrderValue} />

                <Text style={styles.label}>Delivery Charge if Below Minimum (INR):</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={customCharge.toString()} onChangeText={setCustomCharge} />

                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                {/* <Text style={styles.label}>Order Value (INR):</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={orderValue.toString()} onChangeText={setOrderValue} />

            <TouchableOpacity style={styles.calculateButton} onPress={calculateCharge}>
                <Text style={styles.calculateButtonText}>Calculate Charge</Text>
            </TouchableOpacity>

            <Text style={styles.chargeText}>Delivery Charge: ₹{deliveryCharge}</Text> */}
            </View>

            {/* Modal for loading popup */}
            {loading && (
                <Modal transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.loadingText}>Saving...</Text>
                    </View>
                </Modal>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f1f3f6",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#555",
    },
    input: {
        height: 40,
        width: "100%",
        borderColor: "#ced4da",
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    saveButton: {
        backgroundColor: "#1254e8",
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        width: "100%",
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    calculateButton: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    calculateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    chargeText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        color: "#dc3545",
    },
});

export default DeliveryChargeSetter;
