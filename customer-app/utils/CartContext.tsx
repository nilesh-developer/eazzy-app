import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);
  const [cart, setCart] = useState([])
  const [loadingCart, setLoadingCart] = useState(true)

  const getCartData = async () => {
    if (user) {
      try {
        setLoadingCart(true)
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/get-full-cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: user._id })
        });

        if (response.ok) {
          const responseData = await response.json();
          setCart(responseData.data);
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingCart(false)
      }
    }
  }

  useEffect(() => {
    getCartData()
  }, [isLoading])

  const addToCart = async (product) => {
    const productDetails = { ...product, images: product.images.featuredImage }
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productDetails, customerId: user._id })
      });

      if (response.ok) {
        const responseData = await response.json();
        setCart(responseData.data);
      }
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user._id, productId })
      });

      if (response.ok) {
        const responseData = await response.json();
        setCart(responseData.data);
      }
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  const increaseQty = async (productId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/increase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user._id, productId })
      });

      if (response.ok) {
        const responseData = await response.json();
        setCart(responseData.data);
      }
    } catch (error) {
      console.error('Error increasing quantity', error);
    }
  };

  const decreaseQty = async (productId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/decrease`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user._id, productId })
      });

      if (response.ok) {
        const responseData = await response.json();
        setCart(responseData.data);
      }
    } catch (error) {
      console.error('Error decreasing quantity', error);
    }
  };

  const removeProductOfParticularStore = async (sellerId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/clear-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user._id, sellerId })
      });

      if (response.ok) {
        const responseData = await response.json();
        setCart(responseData.data);
      }
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/cart/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user._id })
      });

      if (response.ok) {
        const responseData = await response.json();
        setCart(responseData.data);
      }
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loadingCart, addToCart, removeFromCart, increaseQty, decreaseQty, removeProductOfParticularStore, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
