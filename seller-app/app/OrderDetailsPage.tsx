import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For Icons
import { Stack } from 'expo-router';

const OrderDetailsPage = () => {
    return (
        <ScrollView style={styles.mainContainer}>
            <Stack.Screen options={{
                title: "Order details"
            }} />
            {/* Order Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.orderId}>#8291</Text>
                <Text style={styles.date}>July 29 at 8:56 AM from Draft Orders</Text>
                <View style={styles.statusContainer}>
                    <View style={styles.statusBadgeFulfilled}>
                        <Text style={styles.statusText}>Fulfilled</Text>
                    </View>
                    <View style={styles.statusBadgePending}>
                        <Text style={styles.statusText}>Pending</Text>
                    </View>
                    <View style={styles.statusBadgePaid}>
                        <Text style={styles.statusText}>Paid</Text>
                    </View>
                    <View style={styles.statusBadgeNotPaid}>
                        <Text style={styles.statusText}>Not Paid</Text>
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                {/* Customer Information */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Customer</Text>
                    <Text style={styles.customerText}>Jon Snow</Text>
                    <Text style={styles.subText}>20 orders</Text>
                </View>

                {/* Address */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Shipping and billing address</Text>
                    <Text style={styles.addressText}>11 Thrones Ave</Text>
                    <Text style={styles.addressText}>Winterfell, Westeros</Text>
                    <Text style={styles.addressText}>11996</Text>
                </View>

                <View style={styles.space}></View>
                {/* Fulfillment Details */}
                <View style={styles.sectionContainer}>
                    <View style={styles.fulfillmentHeader}>
                        <Text style={styles.sectionTitle}>Products</Text>
                        <Text style={styles.fulfillmentSubText}>Local delivery</Text>
                    </View>

                    <View style={styles.itemRow}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/50x50' }}
                            style={styles.productImage}
                        />
                        <View style={styles.itemDetailsContainer}>
                            <Text style={styles.itemName}>Sunset Crewneck</Text>
                            <Text style={styles.itemPrice}>₹56.00 (₹28.00 x 2)</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addTrackingButton}>
                        <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Delivered</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.space}></View>
                <View style={styles.sectionContainer}>
                    {/* Fulfillment Details */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Update Payment Status</Text>
                        <TouchableOpacity style={styles.paymentButton}>
                            <MaterialIcons name="payment" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Payment recieved</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#ffffff"
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    headerContainer: {
        backgroundColor: "#f0f0f0",
        padding: 16
    },
    space: {
        padding: 1,
        backgroundColor: "#f0f0f0",
        marginBottom: 8
    },
    orderId: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    date: {
        fontSize: 14,
        color: '#888888',
        marginVertical: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    statusBadgePending: {
        backgroundColor: '#fff8bf',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    statusBadgeFulfilled: {
        backgroundColor: '#D1FAE5',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    statusBadgeNotPaid: {
        backgroundColor: '#fff8bf',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    statusBadgePaid: {
        backgroundColor: '#E5EAFE',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#000000',
    },
    customerText: {
        fontSize: 14,
        color: '#000000',
    },
    subText: {
        fontSize: 12,
        color: '#888888',
    },
    addressText: {
        fontSize: 14,
        color: '#666666',
        marginVertical: 2,
    },
    fulfillmentHeader: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    fulfillmentSubText: {
        fontSize: 12,
        color: '#777777',
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 8,
    },
    itemDetailsContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 12,
        color: '#555555',
        marginTop: 4,
    },
    addTrackingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1254e8',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    paymentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#03a655',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
});

export default OrderDetailsPage;