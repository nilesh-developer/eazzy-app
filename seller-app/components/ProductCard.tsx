import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ productImage, price, productName }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = () => {
    alert("You are currently in Preview Mode. This action is just for display purposes and does not add items to the cart.")
  }

  return (
    <View style={styles.card}>
      {/* Product Image with Styled Badge */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: productImage || 'https://via.placeholder.com/100' }} style={styles.productImage} />
        {/* <View style={styles.badge}>
          <Text style={styles.badgeText}>2</Text>
        </View> */}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.priceText}>₹{price}</Text>
        {/* <Text style={styles.productUnit}>{unit}</Text> */}
      </View>

      {/* Quantity Buttons or Add-to-Cart */}
      <View style={styles.actionsContainer}>
        {isAddedToCart ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
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
    backgroundColor: '#17834f',
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
    backgroundColor: '#17834f',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 4,
    bottom: 0
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
