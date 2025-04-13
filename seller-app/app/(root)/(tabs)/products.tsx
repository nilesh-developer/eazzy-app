import ProductItem from '@/components/ProductItem';
import { UserContext } from '@/utils/UserContext';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Switch,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';

const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const {user, isLoading, updateData} = useContext(UserContext)

    useEffect(() => {
        if (!isLoading) {
          setProducts(user?.products?.reverse())
        }
      }, [isLoading])

    const toggleProductActive = async (id) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/product/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerId: user._id,
                    productId: id,
                }),
            });

            if(response.ok){
                const responseData = await response.json();
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === id ? { ...product, status: !product.status } : product
                    )
                );
                // Alert.alert("Success", "Product status updated!")
                // updateData()
            } else {
                Alert.alert("Error", "Something went wrong while updating status")
            }
        } catch (error) {
            console.log(error)
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
        <View style={styles.container}>
            <StatusBar backgroundColor="#1254e8" style="light" />
            {products.length === 0 &&
                <View style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 250}} >
                    <Text>No products added yet!</Text>
                </View>
            }
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ProductItem product={item} onToggle={() => toggleProductActive(item._id)} />}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/AddProduct")}>
                <Text style={styles.addButtonText}>+ Add product</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    productImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 5,
    },
    productOldPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    productStatus: {
        marginTop: 5,
        color: 'green',
        fontSize: 12,
    },
    switch: {
        marginLeft: 10,
    },
    addButton: {
        backgroundColor: '#1254e8',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ProductsPage;
