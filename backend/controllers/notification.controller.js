import { sellers } from "../models/seller.model.js";
import sendNotifications from "../utils/sendNotification.js";
import { Expo } from "expo-server-sdk";

// Create a new Expo SDK client
const expo = new Expo();

const sendNotificationToCustomers = async (req, res) => {
    const { sellerId, title, message } = req.body;

    if (!sellerId || !message) {
        return res.status(400).json({ message: 'Seller ID and message are required.' });
    }

    // Fetch the seller data with the populated customers array
    const sellerData = await sellers.findById(sellerId).populate("customers");

    if (!sellerData) {
        return res.status(404).json({ message: 'Seller not found.' });
    }

    // Create an array of all expoPushTokens from the customers
    const pushTokens = sellerData.customers
        .map(customer => customer.expoPushToken)  // Extract expoPushToken
        .filter(pushToken => Expo.isExpoPushToken(pushToken));  // Filter valid push tokens

    if (pushTokens.length === 0) {
        return res.status(400).json({ message: 'No valid Expo push tokens found for customers.' });
    }

    try {
        const result = await sendNotifications(pushTokens, title, message, sellerId)
        if(result){
            return res.status(200).json({
                statusCode: 200,
                message: "Notification sent successfully"
            })
        } else {
            return res.status(500).json({
                statusCode: 500,
                message: "Something went wrong while sending notification to customers"
            })
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Failed to send notification.', details: error });
    }
}

export {
    sendNotificationToCustomers
}