import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For Icons
import { Stack, useLocalSearchParams } from 'expo-router';
import { UserContext } from '@/utils/UserContext';

const OrderDetailsPage = () => {
    const { orderId } = useLocalSearchParams();
    const { user } = useContext(UserContext)
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderData, setOrderData] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/order/order-details/${orderId}`, {
                method: 'GET',
            });

            if (response.ok) {
                const responseData = await response.json()
                // Calculate total price
                const computedTotal = responseData.data.products.reduce(
                    (sum, product) => sum + product.price * product.qty,
                    0
                );
                setOrderData(responseData.data)
                setTotalPrice(Number(computedTotal) + Number(responseData.data.deliveryCharges || 0));
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchOrders()
    }, [])

    const handleDeliverStatus = async (status) => {
        Alert.alert(`${status === "Accepted" ? "Accept Order" : status === "Rejected" ? "Reject Order" : status === "Delivered" ? "Confirm Delivery" : null}`, `Are you sure you want to ${status === "Accepted" ? "accept this order?" : status === "Rejected" ? "reject this order?" : status === "Delivered" ? "update order status to delivered!" : null}`, [
            {
                text: 'Close',
                style: 'cancel',
            },
            {
                text: `${status === "Accepted" ? "Accept" : status === "Rejected" ? "Reject" : status === "Delivered" ? "Delivered" : null}`,
                onPress: async () => {
                    try {
                        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/order/update-status`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                sellerId: user._id,
                                orderId: orderData._id,
                                status
                            }),
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        if (response.ok) {
                            const result = await response.json();
                            fetchOrders()
                            Alert.alert('Success', 'Order status updated!');
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Something went wrong while canceling order');
                    }
                },
            },
        ]);
    };

    const handlePaymentStatus = async () => {
        Alert.alert(`Confirm Payment Received`, `Are you sure you want to mark payment as received!`, [
            {
                text: 'No',
                style: 'cancel',
            },
            {
                text: "Yes",
                onPress: async () => {
                    try {
                        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/order/update-payment-status`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                sellerId: user._id,
                                orderId: orderData._id,
                                totalPrice
                            }),
                        });

                        if (response.ok) {
                            const result = await response.json();
                            fetchOrders()
                            Alert.alert('Success', 'Order payment status updated!');
                        } else {
                            Alert.alert('Error', 'Something went wrong while updating payment status');
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Something went wrong while updating payment status');
                    }
                },
            },
        ]);
    };

    const convertToIST = (isoDate) => {
        const date = new Date(isoDate);

        // Calculate IST offset
        // const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

        // Convert to IST by adding the offset
        // const istDate = new Date(date.getTime() + offset);

        // Format IST Date and Time
        const options = {
            weekday: 'long', // Example: "Sunday"
            year: 'numeric', // Example: 2023
            month: 'long', // Example: "December"
            day: 'numeric', // Example: 24
            hour: '2-digit', // Example: 12
            minute: '2-digit', // Example: 15
            second: '2-digit', // Example: 45
            hour12: true, // Display in 12-hour format with AM/PM
            timeZone: 'Asia/Kolkata', // Use IST timezone
        };

        return date.toLocaleString('en-IN', options);
    };

    const displayDeliveryTimeWithDate = (slot: string) => {
        const date = new Date();
        const todayDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        if (slot.split(",")[0] === todayDate) {
            return `Today, ${slot.split(",")[1].trim()}`
        }

        date.setDate(date.getDate() + 1);
        const tomorrowDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        if (slot.split(",")[0] === tomorrowDate) {
            return `Tomorrow, ${slot.split(",")[1].trim()}`
        }

        return slot
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.mainContainer}>
            <Stack.Screen options={{
                title: "Order details"
            }} />
            {/* Order Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.orderId}>#{orderId}</Text>
                <Text style={styles.date}>{convertToIST(orderData?.createdAt)}</Text>
                <View style={styles.statusContainer}>
                    {orderData?.status === 'Pending' ? (
                        <View style={styles.statusBadgePending}>
                            <Text style={styles.statusText}>{orderData?.status}</Text>
                        </View>
                    ) : orderData?.status === "Accepted" ? (
                        <View style={styles.statusBadgeAccepted}>
                            <Text style={styles.statusText}>{orderData?.status}</Text>
                        </View>
                    ) : orderData?.status === "Canceled" ? (
                        <View style={styles.statusBadgeCanceled}>
                            <Text style={styles.statusText}>{orderData?.status}</Text>
                        </View>
                    ) : orderData?.status === "Rejected" ? (
                        <View style={styles.statusBadgeRejected}>
                            <Text style={{ color: "white", fontSize: 12, fontWeight: '500', }}>{orderData?.status}</Text>
                        </View>
                    )
                        : (
                            <View style={styles.statusBadgeFulfilled}>
                                <Text style={styles.statusText}>{orderData?.status}</Text>
                            </View>
                        )
                    }
                    {orderData?.status === "Canceled" ?
                        null :
                        orderData?.payment ? (
                            <View style={styles.statusBadgePaid}>
                                <Text style={styles.statusText}>Paid</Text>
                            </View>
                        ) : (
                            <View style={styles.statusBadgeNotPaid}>
                                <Text style={styles.statusText}>COD</Text>
                            </View>
                        )
                    }
                </View>
            </View>
            <View style={styles.container}>
                {/* Customer Information */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Customer</Text>
                    <Text style={styles.customerText}>{orderData?.customerId?.name}</Text>
                    <Text style={styles.subText}>{orderData?.products?.length} orders</Text>
                </View>

                {/* Address */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Delivery address</Text>
                    <Text style={styles.addressText}>{orderData?.address}</Text>
                </View>
                <View style={styles.sectionContainer}>
                    {orderData?.selectedDeliveryTime && 
                    <>
                    <Text style={{fontSize: 14, fontWeight: '600', marginBottom: 1, color: '#363636',}}>Preferred Delivery Time: </Text>
                    <Text style={styles.greenText}>{displayDeliveryTimeWithDate(orderData?.selectedDeliveryTime)}</Text>
                    </>
                    }
                </View>
                {/* <Text style={styles.addressText}>Winterfell, Westeros</Text>
                    <Text style={styles.addressText}>11996</Text> */}


                <View style={styles.space}></View>
                {/* Fulfillment Details */}
                <View style={styles.sectionContainer}>
                    <View style={styles.fulfillmentHeader}>
                        <Text style={styles.sectionTitle}>Products</Text>
                        {/* <Text style={styles.fulfillmentSubText}>Local delivery</Text> */}
                    </View>

                    <View style={styles.productsContainer}>
                        <FlatList
                            data={orderData?.products}
                            keyExtractor={(item) => item.productId}
                            renderItem={({ item }) => (
                                <View style={styles.itemRow}>
                                    {item?.image ?
                                        <Image
                                            source={{ uri: item?.image }}
                                            style={styles.productImage}
                                        />
                                        :
                                        <Image
                                            source={require("../../assets/images/no-image.jpeg")}
                                            style={styles.productImage}
                                        />
                                    }
                                    <View style={styles.itemDetailsContainer}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>
                                            ₹{item?.price * item?.qty} (₹{item?.price} x {item.qty})
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>

                    {/* Total Price */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.subCharges}>Delivery Charge: ₹{orderData?.deliveryCharges || 0}</Text>
                        <Text style={styles.totalPriceText}>Total Price: ₹{totalPrice}</Text>
                    </View>

                    {orderData?.status === "Canceled" || orderData?.status === "Rejected" ?
                        null
                        : orderData?.status !== "Delivered" ?
                            orderData?.status === 'Pending' ?
                                <>
                                    <TouchableOpacity style={styles.acceptOrderButton} onPress={(e) => handleDeliverStatus("Accepted")}>
                                        <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                                        <Text style={styles.buttonText}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.rejectOrderButton} onPress={(e) => handleDeliverStatus("Rejected")}>
                                        <MaterialIcons name="close" size={20} color="#FFFFFF" />
                                        <Text style={styles.buttonText}>Reject</Text>
                                    </TouchableOpacity>
                                </>
                                :
                                <TouchableOpacity style={styles.addTrackingButton} onPress={(e) => handleDeliverStatus("Delivered")}>
                                    <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Delivered</Text>
                                </TouchableOpacity>
                            : null
                    }
                </View>

                <View style={styles.space}></View>
                {orderData?.status === "Canceled" || orderData?.status === "Rejected" ?
                    null
                    : !orderData?.payment ?
                        <View style={styles.sectionContainer}>
                            {/* Fulfillment Details */}
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Update Payment Status</Text>
                                <TouchableOpacity style={styles.paymentButton} onPress={handlePaymentStatus}>
                                    <MaterialIcons name="payment" size={20} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Payment recieved</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        : null
                }
            </View>
        </ScrollView >
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
    productsContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    statusBadgeAccepted: {
        backgroundColor: "#dee7ff",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    statusBadgeCanceled: {
        backgroundColor: "#a1a1a1",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    statusBadgeRejected: {
        backgroundColor: "#cc1430",
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
    greenText: {
        fontSize: 14,
        color: '#1254e8',
        fontWeight: '700'
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
    acceptOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1254e8',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    rejectOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cc1430',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
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
    totalPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#000000',
    },
    subCharges: {
        fontSize: 12,
        fontWeight: "500",
        color: "#363636",
        textAlign: 'left',
        marginTop: 8,
        marginBottom: 6,
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