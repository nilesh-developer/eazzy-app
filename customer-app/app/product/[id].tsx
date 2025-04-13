import React, { useEffect, useState } from 'react';
import { useCart } from '@/utils/CartContext';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import ProductImageSlider from '@/components/ProductImageSlider';
import { Ionicons } from '@expo/vector-icons';

const ProductPage = () => {
    const { id } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState({})
    const [store, setStore] = useState({})
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const { cart, addToCart, removeFromCart, increaseQty, decreaseQty } = useCart();
    const [isLoading, setIsLoading] = useState(true)
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/product/details/${id}`);
                const result = await response.json();
                setProduct(result.data)
                setStore(result.seller)
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData()
    }, [])
    
    useEffect(() => {
        // Check if the product is already in the cart
        const cartItem = cart.find((item) => item._id === product._id);
        if (cartItem) {
            setQuantity(cartItem.qty);
            setIsAddedToCart(true);
        }
    }, [cart, product._id]);

    useEffect(() => {
        setCartCount(cart?.length)
    }, [cart])

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1);
        increaseQty(id)
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            decreaseQty(product._id);
            setQuantity((prev) => prev - 1);
        } else {
            removeFromCart(product._id);
            setIsAddedToCart(false);
        }
    };

    const handleAddToCart = () => {
        addToCart({ ...product, qty: 1, storename: store.storeTitle, storeCode: store.storename });
        setIsAddedToCart(true);
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1254e8" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Product",
                    headerTitleStyle: {
                        color: '#000000',
                    },
                    // headerRight: () => (
                    //     <View style={styles.cartContainer}>
                    //         <Ionicons
                    //             name="cart-outline"
                    //             size={28}
                    //             color="#000000"
                    //             style={{ marginRight: 10 }}
                    //             onPress={() => router.push(`/cart/${id}`)} // Replace with your navigation logic
                    //         />
                    //         {cartCount > 0 && (
                    //             <View style={styles.badge}>
                    //                 <Text style={styles.badgeText}>{cartCount}</Text>
                    //             </View>
                    //         )}
                    //     </View>
                    // ),
                }}
            />
            <ScrollView>
                {/* <View style={styles.imageContainer}>
                    {Object.values(product.images).map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.productImage} />
                    ))}
                </View> */}
                <ProductImageSlider product={product} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>₹{product.price}</Text>
                    <View style={styles.actionsContainer}>
                        {isAddedToCart ? (
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity}</Text>
                                <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                                    <Text style={styles.quantityButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                                <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={{ marginTop: 24, fontSize: 16, fontWeight: 'bold' }}>Description</Text>
                    <Text style={styles.productDescription}>{product.description}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        padding: 16,
        backgroundColor: "f5f5f5"
    },
    productImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 16,
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#ffffff',
        marginTop: -30,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1254e8',
        marginBottom: 16,
    },
    productDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 24,
    },
    actionsContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    addToCartButton: {
        width: '100%',
        backgroundColor: '#1254e8',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cartContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: 3, // Adjust for proper positioning
        top: -3, // Position above the icon
        backgroundColor: '#1254e8',
        borderRadius: 10,
        paddingHorizontal: 5,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ProductPage;
