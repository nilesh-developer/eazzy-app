import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCart } from '@/utils/CartContext';

const Card = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

const CardContent = ({ children }) => {
    return <View style={styles.cardContent}>{children}</View>;
};

const CardHeader = ({ children }) => {
    return <View style={styles.cardHeader}>{children}</View>;
};

const Button = ({ onPress, children, style }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{children}</Text>
        </TouchableOpacity>
    );
};

const CartStoresScreen = () => {
    const { cart } = useCart();

    // Group products by seller
    const groupedCart = cart.reduce((acc, item) => {
        if (!acc[item.seller]) {
            acc[item.seller] = {
                sellerId: item.seller,
                storeName: item.storename,
                storeCode: item.storeCode,
                products: [],
            };
        }
        acc[item.seller].products.push({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            qty: item.qty,
            images: item.images,
        });
        return acc;
    }, {});

    const sellersArray = Object.values(groupedCart);

    return (
        <SafeAreaView style={styles.container}>
            {sellersArray.length > 0 ? (
                <ScrollView style={styles.scrollView}>
                    <FlatList
                        data={sellersArray}
                        keyExtractor={(item) => item.sellerId.toString()}
                        renderItem={({ item }) => (
                            <Card style={styles.cardContainer}>
                                <CardHeader>
                                    <Text style={styles.cardTitle}>{item.storeName}</Text>
                                </CardHeader>
                                <CardContent>
                                    <FlatList
                                        data={item.products}
                                        keyExtractor={(product) => product.id.toString()}
                                        renderItem={({ item: product }) => (
                                            <View style={styles.productContainer}>
                                                {product?.images ? (
                                                    <Image
                                                        source={{ uri: product?.images }}
                                                        style={styles.productImage}
                                                    />
                                                ) : (
                                                    <Image
                                                        source={require("../../../assets/images/no-image.jpeg")}
                                                        style={styles.productImage}
                                                    />
                                                )}
                                                <View style={styles.productDetails}>
                                                    <Text style={styles.productName}>{product.name}</Text>
                                                    <Text style={styles.productInfo}>
                                                        Qty: {product.qty} | Total Price: ₹{Number(product.price) * Number(product.qty)}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    />
                                    <Button style={styles.viewCartButton} onPress={() => router.push(`/cart/${item.storeCode}`)}>
                                        View Store Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    />
                </ScrollView>
            ) : (
                // Empty Cart Screen (Centered Properly)
                <View style={styles.noProductWrapper}>
                    <Image
                        source={require('../../../assets/images/empty-cart.png')}
                        style={styles.emptyCartImage}
                    />
                    <Text style={styles.noProductText}>Your cart is empty!</Text>
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => router.push("/")}
                    >
                        <Text style={styles.continueButtonText}>Continue shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Makes the entire screen fill available space
        backgroundColor: "#f5f5f5",
    },
    scrollView: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardContainer: {
        padding: 20,
        marginBottom: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
        marginBottom: 8,
    },
    cardContent: {
        marginTop: 8,
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productInfo: {
        fontSize: 12,
        color: '#3d3d3d',
        marginTop: 4
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewCartButton: {
        marginTop: 10,
        backgroundColor: '#1254e8',
        padding: 10,
        borderRadius: 8,
    },
    // No Products Available Section (Perfectly Centered)
    noProductWrapper: {
        flex: 1,  // Fills the screen
        justifyContent: "center",  // Centers vertically
        alignItems: "center",  // Centers horizontally
        paddingHorizontal: 20,
    },
    emptyCartImage: {
        width: 140,
        height: 140,
        borderRadius: 10,
    },
    noProductText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        color: "#333",
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

export default CartStoresScreen;
