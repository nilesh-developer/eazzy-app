import { useCart } from "@/utils/CartContext";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { UserContext } from "@/utils/UserContext";

const CartPage = () => {
    const { id } = useLocalSearchParams();
    const { user, isLoading } = useContext(UserContext)
    const { cart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [store, setStore] = useState({})
    const [loading, setLoading] = useState(true)
    const [deliveryCharges, setDeliveryCharges] = useState(0)
    const [totalItems, setTotalItems] = useState(0);

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
                setTotalItems(data.data.cart?.length);
                setStore(data.data.seller)
                setDeliveryCharges(data.data.seller.deliveryCharges)
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
        }
    }, [cart, isLoading]);

    // Calculations for subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const discount = 0; // Static discount
    let total;
    if (store?.minOrderValueForDelivery > subtotal) {
        total = subtotal - discount + deliveryCharges;
    } else {
        total = subtotal - discount;
    }

    // console.log(cartItems)

    if (isLoading || loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1254e8" />
            </View>
        );
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Stack.Screen
                    options={{
                        title: "Cart",
                    }}
                />

                {/* Cart Items */}
                {cartItems?.map((item) => (
                    <View key={item._id} style={styles.cartItem}>
                        <TouchableOpacity
                            onPress={() => router.push(`/product/${item._id}`)} // Navigate to product detail page
                        >
                            {item?.images ?
                                <Image
                                    source={{ uri: item?.images }}
                                    style={styles.image}
                                />
                                :
                                <Image
                                    source={require("../../assets/images/no-image.jpeg")}
                                    style={styles.image}
                                />
                            }
                        </TouchableOpacity>

                        <View style={styles.itemDetails}>
                            <Text style={styles.tags}>{item?.name}</Text>
                            <Text style={styles.description}>Qty: {item?.qty}</Text>
                            <Text style={styles.description}>Store name: {item?.storename}</Text>
                        </View>

                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                onPress={() => decreaseQty(item._id)}
                                style={styles.quantityButton}
                            >
                                <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{item.qty}</Text>
                            <TouchableOpacity
                                onPress={() => increaseQty(item._id)}
                                style={styles.quantityButton}
                            >
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.price}>₹{(item.price * item.qty).toFixed(2)}</Text>
                    </View>
                ))}

                {/* Order Summary */}
                {cartItems?.length !== 0 && (
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Cart Total:</Text>
                            <Text style={styles.summaryText}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Product Discount:</Text>
                            <Text style={[styles.summaryText, { color: "#10b981" }]}>
                                -₹{discount.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Delivery Charges:</Text>
                            <Text style={[styles.summaryText, { color: "#10b981" }]}>
                                {deliveryCharges === 0 || store?.minOrderValueForDelivery < subtotal ? "Free" : "₹" + deliveryCharges}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Payable Amount:</Text>
                            <Text style={styles.totalText}>₹{total.toFixed(2)}</Text>
                        </View>
                    </View>
                )}

                {/* No Product Available */}
                {cartItems?.length === 0 && (
                    <View style={styles.noProductAvail}>
                        <Image
                            source={require('../../assets/images/empty-cart.png')}
                            style={styles.emptyCartImage}
                        />
                        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
                            Your cart is empty!
                        </Text>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={() => router.push("/")}
                        >
                            <Text style={styles.continueButtonText}>Continue shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Fixed Bottom Section */}
            {cartItems?.length !== 0 && (
                <View style={styles.bottomBar}>
                    {/* Payment Method Section */}
                    <View style={styles.paymentContainer}>
                        <Text style={styles.paymentMethod}>Payment</Text>
                        <Text style={styles.cashOnDelivery}>Cash On Delivery</Text>
                    </View>

                    {/* Total & Checkout Section */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalAmount}>Total ₹{total.toFixed(2)}</Text>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => router.push(`/checkout/${id}`)}
                        >
                            <Text style={styles.checkoutButtonText}>Checkout →</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f9fafb",
        paddingBottom: 100,
    },
    cartItem: {
        flexDirection: "row",
        backgroundColor: "#f3f4f6",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    emptyCartImage: {
        width: 140,
        height: 140,
        borderRadius: 10,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 5
    },
    tags: {
        fontSize: 14,
        color: "#000",
        fontWeight: "bold",
    },
    description: {
        fontSize: 12,
        color: "#6b7280",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        width: 30,
        height: 30,
        backgroundColor: "#e5e7eb",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        color: "#374151",
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    price: {
        fontSize: 14,
        color: "#4b5563",
    },
    summaryContainer: {
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        marginVertical: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    summaryText: {
        fontSize: 14,
        color: "#4b5563",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
    },
    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        elevation: 5,
    },
    paymentContainer: {
        flex: 1,
    },
    paymentMethod: {
        fontSize: 12,
        color: "#6b7280",
    },
    cashOnDelivery: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#10b981",
    },
    totalContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151",
        marginRight: 15,
    },
    checkoutButton: {
        backgroundColor: "#1254e8",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 50,
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
    },
    noProductAvail: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    continueButton: {
        backgroundColor: "#1254e8",
        marginVertical: 20,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: "center",
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
    },
});

export default CartPage;
