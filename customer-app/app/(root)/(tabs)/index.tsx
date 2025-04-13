import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { UserContext } from '@/utils/UserContext';

function LogoTitle() {
  return (
    <Image style={styles.image} source={require("../../../assets/images/logo.png")} />
  );
}

const CustomersPage = () => {
  const { user, isLoading } = useContext(UserContext)
  const [customer, setCustomer] = useState({})
  const [searchQuery, setSearchQuery] = useState('');
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setCustomer(user)
      setSellers(user?.sellers)
    }
  }, [isLoading])

  const filteredCustomers = sellers?.filter(
    (seller) =>
      seller?.storeTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1254e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Search sellers"
        placeholderTextColor="#bababa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredCustomers?.length === 0 ? (
        <Text style={styles.noResultsText}>No sellers added yet!</Text>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={{ paddingBottom: 20 }} // Optional for spacing at the bottom
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.customerCard} onPress={() => router.push(`/seller/${item.storename}`)}>
              <View style={styles.profileImageContainer}>
                {item?.logo ? (
                  <Image source={{ uri: item?.logo }} style={styles.profileImage} />
                ) : (
                  <Feather name="user" size={32} color="#555" />
                )}
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item?.storeTitle}</Text>
                {
                  item?.status ?
                    <Text style={styles.customerActive}>Open</Text>
                    :
                    <Text style={styles.customerInactive}>Closed</Text>
                }
              </View>
              <Feather name="chevron-right" size={24} color="#1254e8" />
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push("/AddSeller")}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomersPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F9F9F9',
    backgroundColor: '#fafcfb',
    padding: 16,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  customerInactive: {
    fontSize: 12,
    color: 'red',
  },
  customerActive: {
    fontSize: 12,
    color: 'green',
    fontWeight: "500"
  },
  image: {
    width: 100,
    height: 40,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#1254e8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
  },
});
