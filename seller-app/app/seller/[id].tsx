import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import ProductCard from '@/components/ProductCard';
import { Stack, useLocalSearchParams } from 'expo-router';

const SellerPage = () => {
  const { id } = useLocalSearchParams();
  const [store, setStore] = useState({})
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch data from the backend for pagination
  const fetchData = async (pageNumber) => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/product/pagination-products?page=${pageNumber}&limit=10&seller=${id}`);
      const result = await response.json();

      setData((prevData) => [...prevData, ...result?.items]); // Append new items
      setHasMore(result.currentPage < result.totalPages); // Check if more data is available
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);
  //Pagination Ends here

  useEffect(() => {
    const fetchUserFromAPI = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/c/${id}`, {
          method: 'GET',
        });
        if (response.ok) {
          const storeData = await response.json();
          setStore(storeData.data);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFromAPI();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#17834f" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Store Preview",
          headerTitleStyle: {
            color: '#000000',
          },
        }}
      />
      {/* Hero Section */}
      <View style={styles.heroSection}>
        {imageLoading && (
          <View style={styles.imageLoading}></View>
        )}
        {store?.banner &&
          <Image
            source={{ uri: store?.banner }} // Replace with actual image
            style={styles.heroImage}
            onLoad={() => setImageLoading(false)} // Stop loading once the image loads
            onError={() => setImageLoading(false)} // Stop loading even if there's an error
          />
        }
      </View>

      {/* Seller Information */}
      <View style={styles.sellerInfo}>
        <View style={styles.sellerDetails}>
          <Image
            source={{ uri: store?.logo || 'https://res.cloudinary.com/dodtn64kw/image/upload/v1736180485/shop_gtlk6b.png' }} // Replace with seller logo
            style={styles.sellerLogo}
          />
          <View>
            <Text style={styles.sellerName}>{store?.storeTitle}</Text>
            {/* <Text style={styles.sellerCategory}>{}</Text> */}
          </View>
        </View>
        <View style={styles.sellerStatus}>
          {/* <Ionicons name="close-circle" size={20} color="red" /> */}
          {store?.status ?
            <Text style={styles.statusTextOpen}>Open</Text>
            :
            <Text style={styles.statusText}>Closed</Text>
          }
        </View>
      </View>

      {/* Products Section */}
      <View style={styles.productsSection}>
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>Products</Text>
          <Text style={styles.productsCount}>{store?.products?.length} items</Text>
        </View>
        {store?.products?.length !== 0 ?
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            renderItem={({ item }) => (
              <ProductCard
                productImage={item?.images?.featuredImage}
                price={item.price}
                productName={item.name}
              // unit={item.unit}
              />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#17834f" /> : null}
          />
          :
          <View style={styles.productsArea}>
            <Text style={{ textAlign: 'center' }}>No products available!</Text>
          </View>
        }
        {/* {hasMore ? <TouchableOpacity style={{alignItems: "center", backgroundColor: '#2563EB', padding: '8px', color: 'white'}} onPress={loadMore}>Load more</TouchableOpacity> : null } */}
      </View>

      {/* Seller Description */}
      <View style={styles.sellerDescription}>
        <Text style={styles.descriptionTitle}>About Us</Text>
        <Text style={styles.descriptionText}>
          {store?.about}
        </Text>
        <Text style={styles.addressTitle}>Address:</Text>
        <Text style={styles.addressText}>
          {store?.shopAddress + ", " + store?.city + ", " + store?.state + " - " + store?.pinCode}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  heroSection: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  imageLoading: {
    width: '100%',
    height: '100%',
    backgroundColor: "#e6e6e6",
    position: 'absolute'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextMain: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  heroTextHighlight: {
    fontSize: 30,
    color: '#6366F1',
    fontWeight: 'bold',
  },
  heroTextSub: {
    fontSize: 16,
    color: 'white',
  },
  sellerInfo: {
    margin: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellerCategory: {
    color: 'gray',
    fontSize: 12,
  },
  sellerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: 'red',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusTextOpen: {
    color: 'green',
    fontWeight: '600',
    marginLeft: 4,
  },
  productsArea: {
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 26,
    borderRadius: 12,
  },
  sellerDescription: {
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  descriptionText: {
    color: 'gray',
    lineHeight: 20,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: "#212121",
    marginTop: 10,
    marginBottom: 8,
  },
  addressText: {
    color: 'gray',
    fontSize: 14,
  },
  productsSection: {
    marginHorizontal: 16,
    marginBottom: 0, //16
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  productsCount: {
    fontSize: 12,
    color: 'gray',
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productUnit: {
    fontSize: 12,
    color: 'gray',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 4,
  },
  contactButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cartContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 3, // Adjust for proper positioning
    top: -3, // Position above the icon
    backgroundColor: '#17834f',
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

export default SellerPage;
