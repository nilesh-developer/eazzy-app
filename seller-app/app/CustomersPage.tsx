import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { UserContext } from '@/utils/UserContext';

const CustomersPage = () => {
    const {user} = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState(user?.customers);

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Customers",
                    headerTitleStyle: {
                        color: '#000000',
                    },
                }}
            />
            <TextInput
                style={styles.searchBar}
                placeholder="Search customers"
                placeholderTextColor="#bababa"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {filteredCustomers.length === 0 ? (
                <Text style={styles.noResultsText}>No customers found.</Text>
            ) : (
                <FlatList
                    data={filteredCustomers}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }} // Optional for spacing at the bottom
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.customerCard}>
                            <View style={styles.profileImageContainer}>
                                {item?.profileImage ? (
                                    <Image source={{ uri: item?.profileImage }} style={styles.profileImage} />
                                ) : (
                                    <Feather name="user" size={32} color="#555" />
                                )}
                            </View>
                            <View style={styles.customerInfo}>
                                <Text style={styles.customerName}>{item?.name}</Text>
                                <Text style={styles.customerEmail}>{item?.email}</Text>
                            </View>
                            <Feather name="chevron-right" size={24} color="#888" />
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default CustomersPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
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
    customerEmail: {
        fontSize: 14,
        color: '#888',
    },
});
