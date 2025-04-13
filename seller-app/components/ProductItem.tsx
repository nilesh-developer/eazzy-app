import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

export default function ProductItem({ product, onToggle }) {
  return (
    <TouchableOpacity onPress={() => router.push(`/EditProduct/${product._id}`)}>
      <View style={styles.productItem}>
        {product?.images?.featuredImage ?
          <Image
            source={{ uri: product?.images?.featuredImage }}
            style={styles.productImage}
          />
          :
          <Image
            source={require("../assets/images/no-image.jpeg")}
            style={styles.productImage}
          />
        }
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{product.price}</Text>
            {product.oldPrice ? (
              <Text style={styles.productOldPrice}>{product.oldPrice}</Text>
            ) : null}
          </View>
          {product?.status ?
            <Text style={styles.productStatus}>Active</Text>
            :
            <Text style={styles.productStatusInactive}>Inactive</Text>
          }
        </View>
        <Switch value={product.status} style={styles.switch} onValueChange={onToggle} />
      </View>
    </TouchableOpacity>
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
  productStatusInactive: {
    marginTop: 5,
    color: 'red',
    fontSize: 12,
  },
  switch: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: 'orange',
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
