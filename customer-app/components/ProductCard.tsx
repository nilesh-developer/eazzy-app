import { useCart } from '@/utils/CartContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, useImage } from 'expo-image';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const ProductCard = ({ storename, storeCode, productImage, price, productName, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [cartFromServer, setCartFromServer] = useState([]);
  const [imageLoading, setImageLoading] = useState()
  const { cart, loadingCart, addToCart, removeFromCart, increaseQty, decreaseQty } = useCart()

  // const getCartData = async () => {
  //   try {
  //     const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/add`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ customerId: user._id })
  //     });

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       setCartFromServer(responseData.data);
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const image = useImage(productImage || require("../assets/images/no-image.jpeg"), {
    maxWidth: 800,
    onError(error, retry) {
      console.error('Loading failed:', error.message);
    }
  });

  useEffect(() => {
    if (product) {
      const cartItem = cart.find((item) => item._id === product._id);
      if (cartItem) {
        setQuantity(cartItem.qty)
        setIsAddedToCart(true)
      }
    }
  }, [cart])

  const incrementQuantity = (id) => {
    setQuantity(quantity + 1);
    increaseQty(id)
  }

  const decrementQuantity = (id) => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      decreaseQty(id)
    }

    if (quantity === 1) {
      setIsAddedToCart(false)
      removeFromCart(id)
    }
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, storename: storename, storeCode: storeCode })
    setIsAddedToCart(true);
  }

  if (loadingCart) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1254e8" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Product Image with Styled Badge */}
      <View style={styles.imageContainer}>
        {!image && (
          <View
            style={{
              height: "100%",
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: "#e3e3e3",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <ActivityIndicator size="large" color="#1254e8" />
          </View>
        )}
        <Image
          source={image}
          style={styles.productImage}
        />
        {/* <View style={styles.badge}>
          <Text style={styles.badgeText}>2</Text>
        </View> */}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName} onPress={() => router.push(`/product/${product._id}`)}>{productName}</Text>
        <Text style={styles.priceText}>₹{price}</Text>
        {/* <Text style={styles.productUnit}>{unit}</Text> */}
      </View>

      {/* Quantity Buttons or Add-to-Cart */}
      <View style={styles.actionsContainer}>
        {isAddedToCart ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => decrementQuantity(product._id)}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => incrementQuantity(product._id)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart({ ...product, qty: 1 })}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#1254e8',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoContainer: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 4,
    textAlign: "center"
  },
  productUnit: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  actionsContainer: {
    width: '100%',
    padding: 16,
    marginTop: 'auto', // Push the button to the bottom
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#1254e8',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 4,
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
});

export default ProductCard;
