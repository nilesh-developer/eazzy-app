import { UserContext } from "@/utils/UserContext";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";

const OrdersPage = () => {
  const { user, isLoading } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/order/pagination-orders-seller/${user._id}?page=${pageNumber}&limit=10&activeTab=${activeTab}`
      );
      const result = await response.json();
      if (pageNumber === 1) {
        setOrders(result.items); // Replace orders on the first page
      } else {
        setOrders((prevData) => [...prevData, ...result.items]); // Append new items on other pages
      }
      setHasMore(result.currentPage < result.totalPages); // Set pagination state
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load orders. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };



  // Reset data on activeTab change
  useEffect(() => {
    if (user) {
      setOrders([]);
      setPage(1);
      setHasMore(true);
      fetchData(1);  // Fetch the first page of the new tab
    }
  }, [activeTab, user]);

  // Fetch new data on page change or activeTab change
  useEffect(() => {
    if (user && page > 0 && !loading) {
      fetchData(page);
    }
  }, [page, activeTab]);


  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/order/${item?._id}`)}>
      <View style={styles.leftContainer}>
        {item?.products[0]?.image ?
          <Image
            source={{ uri: item?.products[0]?.image }}
            style={styles.productImage}
          />
          :
          <Image
            source={require("../../../assets/images/no-image.jpeg")}
            style={styles.productImage}
          />
        }
        <View style={styles.detailsContainer}>
          <Text style={styles.orderId}>#{item._id}</Text>
          <Text style={styles.orderDetails}>
            {item?.products?.length} Items • {item?.createdAt?.split("T")[0]}
          </Text>
          <View style={styles.statusAndPayment}>
            {item?.status === "Pending" ? (
              <Text style={styles.statusPending}>{item?.status}</Text>
            ) : item?.status === "Accepted" ? (
              <Text style={styles.statusAccepted}>{item?.status}</Text>
            ) : item?.status === "Canceled" ? (
              <Text style={styles.statusCanceled}>{item?.status}</Text>
            ) : item?.status === "Rejected" ? (
              <Text style={styles.statusBadgeCanceled}>{item?.status}</Text>
            ) : (
              <Text style={styles.statusDelivered}>{item?.status}</Text>
            )}
            {item?.status !== "Canceled" && (
              item?.payment ? <Text style={styles.paymentStatus}>PAID</Text> : <Text style={styles.paymentStatusPending}>COD</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1254e8" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1254e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1254e8" style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab,
          activeTab === "All" && styles.activeTab]}
          onPress={(e) => setActiveTab("All")}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab,
          activeTab === "Pending" && styles.activeTab]}
          onPress={(e) => setActiveTab("Pending")}
        >
          <Text style={styles.tabText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab,
          activeTab === "Accepted" && styles.activeTab]}
          onPress={(e) => setActiveTab("Accepted")}
        >
          <Text style={styles.tabText}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab,
          activeTab === "Rejected" && styles.activeTab]}
          onPress={(e) => setActiveTab("Rejected")}
        >
          <Text style={styles.tabText}>Rejected</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab,
          activeTab === "Delivered" && styles.activeTab]}
          onPress={(e) => setActiveTab("Delivered")}
        >
          <Text style={styles.tabText}>Delivered</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab,
          activeTab === "Canceled" && styles.activeTab]}
          onPress={(e) => setActiveTab("Canceled")}
        >
          <Text style={styles.tabText}>Canceled</Text>
        </TouchableOpacity>
      </View>
      {orders?.length === 0 ?
        <View style={styles.noOrders}>
          <Text style={{ textAlign: "center" }}>No orders yet!</Text>
        </View>
        :
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  noOrders: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  tab: {
    marginRight: 15,
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#1254e8",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  list: {
    paddingBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContainer: {
    flexDirection: "row",
    flex: 1,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderDetails: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  statusAndPayment: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statusPending: {
    fontSize: 14,
    color: "#d6a800",
    backgroundColor: "#fff6d6",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  statusAccepted: {
    fontSize: 14,
    color: "#001059",
    backgroundColor: "#dee7ff",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  statusCanceled: {
    fontSize: 14,
    color: "#363636",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  statusBadgeCanceled: {
    fontSize: 14,
    color: "#FF0000",
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  statusDelivered: {
    fontSize: 14,
    color: "#008000",
    backgroundColor: "#d6ffe6",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  paymentStatusPending: {
    fontSize: 14,
    color: "#016e8a",
    backgroundColor: "#caf0fa",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  paymentStatus: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
});

export default OrdersPage;
