// Import required libraries
import TimeSlotSelection from "@/components/TimeSlotSelection";
import { useCart } from "@/utils/CartContext";
import { UserContext } from "@/utils/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";

export default function CheckoutPage() {
    const { id } = useLocalSearchParams();
    const { user, isLoading } = useContext(UserContext);
    const { cart, removeProductOfParticularStore, clearCart } = useCart()
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [customAddress, setCustomAddress] = useState("");

    const [store, setStore] = useState({})
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDay, setSelectedDay] = useState("Today");

    const [loading, setLoading] = useState(true)

    const [timeSlots, setTimeSlots] = useState([])

    // const timeSlots = ["10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM"]; // Replace with your dynamic slots if necessary

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const todayFormatDate = () => {
        const date = new Date();
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const tomorrowFormatDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1); 

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const getCustomerCartOfStoreFromServer = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/get-customer-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: user._id,
                    sellerId: id
                }),
            });

            if (response.ok) {
                const data = await response.json()
                // console.log(data.data.cart)
                setCartItems(data.data.cart);
                setStore(data.data.seller);
                setTimeSlots(data.data.seller.deliveryTimeSlot)
            }
        } catch (error) {
            console.log("failed to fetch cart details")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            getCustomerCartOfStoreFromServer()
            setSavedAddresses([
                user?.address + ", " + user?.city + ", " + user?.state + ", " + user?.pinCode,
            ])
        }
    }, [cart, isLoading]);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2);
    let finalPrice;
    const calculateTotalPrice = () => {
        if (store?.minOrderValueForDelivery > totalPrice) {
            finalPrice = Number(totalPrice) + Number(store.deliveryCharges)
        } else {
            finalPrice = Number(totalPrice)
        }
        return finalPrice
    };

    const handlePlaceOrder = async () => {
        const addressToUse = selectedAddress || customAddress;

        if (!addressToUse) {
            Alert.alert("Error", "Please select or enter an address to proceed.");
            return;
        }

        if (selectedTimeSlot === null && store?.deliveryTimeType === "deliveryTimeSlot") {
            Alert.alert("Error", "Please select a delivery time slot to proceed.");
            return;
        }

        if (!store?.status) {
            Alert.alert("Store Closed", "We are currently not accepting orders. Please visit us again soon!");
            return
        }

        // Add the address to each product in cartItems
        // const updatedCartItems = cartItems.map((item) => ({
        //   ...item,
        //   address: addressToUse,
        // }));

        // console.log(updatedCartItems); // Now includes the address with each product
        
        let deliveryDate;

        if(store?.deliveryTimeType === "deliveryTimeSlot"){
            if(selectedDay === "Today"){
                deliveryDate = todayFormatDate()
            }
            if(selectedDay === "Tomorrow"){
                deliveryDate = tomorrowFormatDate()
            }
        }
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/order/place`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems,
                    address: addressToUse,
                    deliveryCharges: store.deliveryCharges,
                    customerId: user._id,
                    selectedSlot: String(deliveryDate+", "+selectedTimeSlot?.start+" - "+selectedTimeSlot?.end)
                }),
            });
            const result = await response.json();
            if (response.ok) {
                removeProductOfParticularStore(id)
                Alert.alert("Order Placed", `Your order will be delivered to: ${addressToUse}`);
                router.push('/orders');
            } else {
                Alert.alert("Info", result.error)
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not send data to the server.');
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1254e8" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <Stack.Screen options={{
                title: "Checkout"
            }} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.heading}>Checkout</Text>

                {/* Address Selection Section */}
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <FlatList
                    data={savedAddresses}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.addressItem,
                                selectedAddress === item && styles.selectedAddress,
                            ]}
                            onPress={() => {
                                setSelectedAddress(item);
                                setCustomAddress("");
                            }}
                        >
                            <Text style={styles.addressText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={() => (
                        <TouchableOpacity
                            style={[
                                styles.addressItem,
                                !selectedAddress && customAddress && styles.selectedAddress,
                            ]}
                            onPress={() => {
                                setSelectedAddress(null);
                            }}
                        >
                            <Text style={styles.addressText}>Use a different address</Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Custom Address Input */}
                {!selectedAddress && (
                    <View>
                        <Text style={styles.sectionTitle}>Enter a New Address</Text>
                        <TextInput
                            style={styles.addressInput}
                            placeholder="Enter your delivery address"
                            placeholderTextColor="#888"
                            value={customAddress}
                            onChangeText={(text) => setCustomAddress(text)}
                        />
                    </View>
                )}

                {/* Available Time Slot */}
                {store?.deliveryTimeType === "deliveryTimeSlot" &&
                    (
                        // <>
                        //     <Text style={styles.sectionTitle}>Select Your Preferred Delivery Time Slot</Text>
                        //     {timeSlots.map((slot, index) => (
                        //         <TouchableOpacity
                        //             key={index}
                        //             style={[
                        //                 styles.slot,
                        //                 selectedTimeSlot === slot && styles.selectedSlot,
                        //             ]}
                        //             onPress={() => setSelectedTimeSlot(slot.start + " - " + slot.end)}
                        //         >
                        //             <Text
                        //                 style={[
                        //                     styles.slotText,
                        //                     selectedTimeSlot === (slot.start + " - " + slot.end) && styles.selectedSlotText,
                        //                 ]}
                        //             >
                        //                 {slot.start + " - " + slot.end}
                        //             </Text>
                        //         </TouchableOpacity>
                        //     ))}
                        // </>

                        <View>
                            <Text style={styles.sectionTitle}>Select Your Preferred Delivery Time Slot</Text>
                            <TimeSlotSelection
                                timeSlots={timeSlots} // Pass available time slots
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                onSlotSelect={(slot) => setSelectedTimeSlot(slot)} // Update selection
                            />
                        </View>
                    )}



                {/* Payment Section */}
                {/* <View style={{ marginTop: 20 }}></View> */}
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.codContainer}>
                    <Text style={styles.codText}>Cash on Delivery</Text>
                </View>

                {store?.deliveryTimeType === "quick" &&
                    (
                        <>
                            <Text style={styles.estimatedTime}>Estimated Delivery Time:</Text>
                            <Text style={{ fontSize: 16, fontWeight: "900", color: "#1254e8", marginBottom: 10 }}>
                                {store?.estimatedDeliveryTime?.minTime + " - " + store?.estimatedDeliveryTime?.maxTime + " " + store?.estimatedDeliveryTime?.unit}
                            </Text>
                        </>
                    )
                }

                {/* Cart Items Section */}
                <Text style={styles.sectionTitle}>Your Cart</Text>
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ backgroundColor: "#ededed", borderRadius: 12, marginTop: 5 }}>
                            <View style={styles.cartItem}>
                                {item?.images ?
                                    <Image
                                        source={{ uri: item?.images }}
                                        style={styles.productImage}
                                    />
                                    :
                                    <Image
                                        source={require("../../assets/images/no-image.jpeg")}
                                        style={styles.productImage}
                                    />
                                }
                                <View style={styles.cartItemDetails}>
                                    <Text style={styles.cartItemTitle}>{item.name}</Text>
                                    <Text style={styles.cartItemSubtitle}>₹{item.price.toFixed(2)} x {item.qty}</Text>
                                </View>
                                <Text style={styles.cartItemTotal}>₹{(item.price * item.qty).toFixed(2)}</Text>
                            </View>
                            {/* {item.allTimeDelivery === false ?
                                <>
                                    <TouchableOpacity onPress={toggleExpand} style={[styles.expandButton, styles.slotView]}>
                                        <Text style={{ fontSize: 14, color: "#000", fontWeight: "bold", marginTop: 5 }}>
                                            {item.selectedSlot ? `Delivery Slot: ${item.selectedSlot}` : "Select Delivery Slot"}
                                        </Text>
                                        <Ionicons name={isExpanded ? "chevron-up-circle-outline" : "chevron-down-circle-outline"} size={20} color="black" />
                                    </TouchableOpacity>
                                    {isExpanded && (
                                        <FlatList
                                            data={item?.deliveryTimeSlot}
                                            keyExtractor={(slot) => slot.id.toString()}
                                            renderItem={({ item: slot }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        item.selectedSlot = `${slot.start} - ${slot.end}`
                                                        setSelectedTimeSlot(`${slot.start} - ${slot.end}`);
                                                        setIsExpanded(false);
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.slotItem,
                                                            selectedTimeSlot === `${slot.start} - ${slot.end}` ? styles.selectedSlot : null
                                                        ]}
                                                    >
                                                        {slot.start} - {slot.end}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            style={styles.slotList}
                                        />
                                    )}
                                </>
                                :
                                // <TouchableOpacity onPress={toggleExpand} style={[styles.expandButton, styles.slotView]}>
                                //     <Text style={{ fontSize: 14, color: "#000", fontWeight: "bold", marginTop: 5 }}>
                                //         {item.selectedSlot ? `Slot: ${item.selectedSlot}` : "Select Delivery Slot"}
                                //     </Text>
                                //     <Icon name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="black" />
                                // </TouchableOpacity>
                                null
                            } */}
                        </View>
                    )}
                    style={styles.cartList}
                />
                <Text style={styles.subCharges}>Delivery Charges: {store?.deliveryCharges === 0 || store?.minOrderValueForDelivery < totalPrice ? "Free" : "₹" + store?.deliveryCharges}</Text>
                <Text style={styles.totalPrice}>Total: ₹{calculateTotalPrice()}</Text>
            </ScrollView>

            {/* Fixed Place Order Button */}
            <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
                <Text style={styles.orderButtonText}>Place Order</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f8fa",
        padding: 16,
    },
    heading: {
        fontSize: 28,
        fontWeight: "700",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#444",
        marginBottom: 15,
        marginTop: 10
    },
    estimatedTime: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
        marginTop: 10
    },
    cartList: {
        marginBottom: 20,
    },
    slotView: {
        backgroundColor: "#ededed",
        padding: 15,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cartItem: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        borderColor: "#e1e1e1",
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cartItemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    cartItemTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
    },
    cartItemSubtitle: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,
    },
    cartItemTotal: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },
    subCharges: {
        fontSize: 16,
        fontWeight: "400",
        color: "#363636",
        textAlign: "right",
        marginBottom: 6,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "700",
        color: "#00702f",
        textAlign: "right",
        marginBottom: 20,
    },
    addressItem: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        borderColor: "#e1e1e1",
        borderWidth: 1,
        marginBottom: 10,
    },
    selectedAddress: {
        borderColor: "#1254e8",
        borderWidth: 2,
        backgroundColor: "#f7faff",
    },
    addressText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    addressInput: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        borderColor: "#e1e1e1",
        borderWidth: 1,
        fontSize: 16,
        color: "#333",
        marginBottom: 20,
    },
    codContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        borderColor: "#1254e8",
        borderWidth: 1,
        marginBottom: 20,
        alignItems: "center",
    },
    codText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1254e8",
    },
    wrapper: {
        flex: 1,
        backgroundColor: "#f7f8fa",
    },
    scrollViewContent: {
        padding: 16,
        paddingBottom: 80, // Prevent overlapping with the button
    },
    orderButton: {
        position: "absolute",
        bottom: 10,
        left: 16,
        right: 16,
        backgroundColor: "#1254e8",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    orderButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    slot: {
        flex: 1,
        marginVertical: 8,
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    selectedSlot: {
        borderColor: "#1254e8",
        backgroundColor: "#f5faf8",
    },
    slotText: {
        fontSize: 16,
        color: "#333",
    },
    selectedSlotText: {
        color: "#1254e8",
        fontWeight: "bold",
    },
    expandButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
    },
    slotList: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: "#ededed",
    },
    slotItem: {
        paddingVertical: 8,
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
});
