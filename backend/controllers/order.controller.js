import { customers } from "../models/customers.model.js";
import { sellers } from "../models/seller.model.js";
import { orders } from "../models/orders.model.js";
import { products } from "../models/products.model.js";

import { Expo } from "expo-server-sdk";
import sendNotifications from "../utils/sendNotification.js";
// Create a new Expo SDK client
const expo = new Expo();

// const placeOrder = async (req, res) => {
//     const { cartItems, address, customerId } = req.body;

//     let sellerExpoPushTokens = [];

//     if (!cartItems || !address) {
//         return res.status(400).json({ message: "Cart items and address are required" });
//     }

//     const getProductData = async (id) => {
//         const productData = await products.findById(id)
//         console.log(productData.images.featuredImage)
//         return productData.images.featuredImage
//     }

//     // Group items by sellerId
//     const itemsBySeller = cartItems.reduce((acc, item) => {
//         const { seller } = item;
//         if (!acc[seller]) {
//             acc[seller] = [];
//         }

//         acc[seller].push({
//             productId: item._id, // Map item properties as required
//             name: item.name,
//             price: item.price,
//             qty: item.qty,
//             address,
//             image: getProductData(item._id)
//         });

//         return acc;
//     }, {});

//     try {
//         if(itemsBySeller.length === 0){
//             return res.status(500).json({
//                 message: "Product is not available"
//             })
//         }
//         const customerExist = await customers.findById(customerId)

//         // Process and update each seller
//         const updates = await Promise.all(
//             Object.entries(itemsBySeller).map(async ([seller, items]) => {
//                 // Generate unique orderId

//                 const sellerData = await sellers.findById(seller)

//                 if (sellerData.appNotification === true) {
//                     sellerExpoPushTokens.push(sellerData.expoPushToken)
//                 }

//                 const createOrder = await orders.create({
//                     customerId: customerExist._id,
//                     seller,
//                     products: items,
//                     status: "Pending",
//                     email: customerExist.email,
//                     name: customerExist.name,
//                     address: address,
//                     phoneNo: customerExist.phoneNo,
//                 })

//                 sellerData.orders.push(createOrder._id);
//                 customerExist.orders.push(createOrder._id);

//                 await sellerData.save()
//             })
//         );

//         await customerExist.save()

//         if (sellerExpoPushTokens.length !== 0) {
//             const result = await sendNotifications(sellerExpoPushTokens, "New Order Received", "View order details")
//             if (result) {
//                 console.log("Notification sent successfully")
//             } else {
//                 console.log("Something went wrong while sending notification to seller")
//             }
//         }

//         return res.status(200).json({ message: "Order placed successfully" });

//     } catch (err) {
//         console.error("Error placing order:", err);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// }

const placeOrder = async (req, res) => {
    const { cartItems, address, customerId, deliveryCharges, selectedSlot } = req.body;

    if (!cartItems || cartItems.length === 0 || !address) {
        return res.status(400).json({ message: "Cart items and address are required" });
    }

    let sellerExpoPushTokens = [];

    const getProductData = async (id) => {
        try {
            const productData = await products.findById(id);
            if (!productData) throw new Error("Product not found");
            return productData.images.featuredImage;
        } catch (error) {
            console.error(`Error fetching product data for id ${id}:`, error);
            throw error;
        }
    };

    // Group items by sellerId
    const itemsBySeller = cartItems.reduce((acc, item) => {
        const { seller } = item;
        if (!acc[seller]) {
            acc[seller] = [];
        }

        acc[seller].push({
            productId: item._id, // Map item properties as required
            name: item.name,
            price: item.price,
            qty: item.qty,
            address,
            image: getProductData(item._id) // Promise stored here
        });

        return acc;
    }, {});

    try {
        // Validate if customer exists
        const customerExist = await customers.findById(customerId);
        if (!customerExist) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const sellerEntries = Object.entries(itemsBySeller);
        if (sellerEntries.length === 0) {
            return res.status(500).json({ message: "No valid seller items available" });
        }

        // Process and update each seller
        const updates = await Promise.all(
            sellerEntries.map(async ([seller, items]) => {
                // Resolve product images
                items = await Promise.all(
                    items.map(async (item) => ({
                        ...item,
                        image: await item.image // Resolve the promise for image
                    }))
                );

                // Fetch seller data
                const sellerData = await sellers.findById(seller);
                if (!sellerData) throw new Error(`Seller with ID ${seller} not found`);

                if (sellerData.appNotification) {
                    sellerExpoPushTokens.push(sellerData.expoPushToken);
                }

                // Create a new order
                const createOrder = await orders.create({
                    customerId: customerExist._id,
                    seller,
                    products: items,
                    status: "Pending",
                    email: customerExist.email,
                    name: customerExist.name,
                    address,
                    phoneNo: customerExist.phoneNo,
                    deliveryCharges,
                    selectedDeliveryTime: selectedSlot || null,
                });

                // Add the order to both seller and customer records
                sellerData.orders.push(createOrder._id);
                await sellerData.save();

                customerExist.orders.push(createOrder._id);
            })
        );

        await customerExist.save();
        console.log("Order Placed")
        // Send notifications to sellers if applicable
        if (sellerExpoPushTokens.length > 0) {
            const result = await sendNotifications(
                sellerExpoPushTokens,
                "New Order Received",
                "View order details",
                "Order Placed"
            );

            if (result) {
                console.log("Notifications sent successfully");
            } else {
                console.log("Error while sending notifications to sellers");
            }
        }

        return res.status(200).json({ message: "Order placed successfully" });
    } catch (err) {
        console.error("Error placing order:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getCustomerOrders = async (req, res) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid customer id"
            })
        }

        const customerOrders = (await orders.find({ customerId: customerId })).reverse()

        return res.status(200).json({
            data: customerOrders,
            message: "Orders fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getSellerOrders = async (req, res) => {
    try {
        const { sellerId } = req.params;

        if (!sellerId) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid customer id"
            })
        }

        const sellerOrders = (await orders.find({ seller: sellerId })).reverse()

        return res.status(200).json({
            data: sellerOrders,
            message: "Orders fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const cancelOrder = async (req, res) => {
    const { customerId, orderId } = req.body;

    const orderCanceled = await orders.findOneAndUpdate({ customerId, _id: orderId }, {
        status: "Canceled"
    })

    if (!orderCanceled) {
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong"
        })
    }

    return res.status(200).json({
        statusCode: 200,
        message: "Order canceled"
    })
}

const updateStatus = async (req, res) => {
    const { sellerId, orderId, status } = req.body;

    const orderStatusUpdated = await orders.findOneAndUpdate({ seller: sellerId, _id: orderId }, {
        status: status
    })

    if (!orderStatusUpdated) {
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong"
        })
    }

    return res.status(200).json({
        statusCode: 200,
        message: "Order status updated"
    })
}

const updatePaymentStatus = async (req, res) => {
    const { sellerId, orderId, totalPrice } = req.body;

    const orderPaymentStatusUpdated = await orders.findOneAndUpdate({ seller: sellerId, _id: orderId }, {
        payment: true
    })

    if (!orderPaymentStatusUpdated) {
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong"
        })
    }

    const seller = await sellers.findById(sellerId);
    if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    seller.sales = seller.sales + totalPrice;

    await seller.save();

    return res.status(200).json({
        statusCode: 200,
        message: "Order payment status updated"
    })
}

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid order id"
            })
        }

        const orderDetails = await orders.findById(id).populate("customerId");

        if (!orderDetails) {
            return res.status(500).json({
                statusCode: 500,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: orderDetails,
            message: "Data fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getPaginationOrders = async (req, res) => {
    const { page, limit, activeTab } = req.query;
    const { customerId } = req.params;

    try {
        // Parse pagination parameters
        const pageNum = parseInt(page);
        const pageSize = parseInt(limit);

        let items, totalItems;

        if (activeTab === "All") {
            // Query the database with pagination
            items = await orders.find({ customerId })
                .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
                .skip((pageNum - 1) * pageSize) // Skip items of previous pages
                .limit(pageSize); // Limit items to page size

            // Get the total count of items in the collection
            totalItems = await orders.countDocuments({ customerId });
        }
        else {
            // Query the database with pagination
            items = await orders.find({ customerId, status: activeTab })
                .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
                .skip((pageNum - 1) * pageSize) // Skip items of previous pages
                .limit(pageSize); // Limit items to page size

            // Get the total count of items in the collection
            totalItems = await orders.countDocuments({ customerId, status: activeTab });
        }

        // Response
        return res.status(200).json({
            items: items,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            currentPage: pageNum,
        });
    } catch (err) {
        console.error("Error fetching items:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const getPaginationOrdersSeller = async (req, res) => {
    const { page, limit, activeTab } = req.query;
    const { sellerId } = req.params;

    try {
        // Parse pagination parameters
        const pageNum = parseInt(page);
        const pageSize = parseInt(limit);

        let items, totalItems;

        if (activeTab === "All") {
            // Query the database with pagination
            items = await orders.find({ seller: sellerId })
                .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
                .skip((pageNum - 1) * pageSize) // Skip items of previous pages
                .limit(pageSize); // Limit items to page size

            // Get the total count of items in the collection
            totalItems = await orders.countDocuments({ seller: sellerId });
        }
        else {
            // Query the database with pagination
            items = await orders.find({ seller: sellerId, status: activeTab })
                .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
                .skip((pageNum - 1) * pageSize) // Skip items of previous pages
                .limit(pageSize); // Limit items to page size

            // Get the total count of items in the collection
            totalItems = await orders.countDocuments({ seller: sellerId, status: activeTab });
        }

        // Response
        return res.status(200).json({
            items: items,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            currentPage: pageNum,
        });
    } catch (err) {
        console.error("Error fetching items:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export {
    placeOrder,
    getCustomerOrders,
    getOrderDetails,
    cancelOrder,
    updateStatus,
    updatePaymentStatus,
    getSellerOrders,
    getPaginationOrders,
    getPaginationOrdersSeller
}