import { Expo } from "expo-server-sdk";

// Create a new Expo SDK client
const expo = new Expo();

// Function to send notifications
const sendNotifications = async (expoPushTokens, title, message, id) => {
  const messages = [];

  // Prepare messages for each push token
  for (let pushToken of expoPushTokens) {
    // Check if the token is valid
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Add a message for the push token
    messages.push({
      to: pushToken,
      sound: 'default',
      title: title || 'New Notification',
      body: message,
      data: { id },
    });
  }

  // Send the messages in chunks
  const chunks = expo.chunkPushNotifications(messages);
  try {
    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
    }
    return true
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

export default sendNotifications;

// Example usage
// const expoPushTokens = [
//   'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]', // Replace with real tokens
// ];
// const message = 'Hello, this is a test notification!';
// sendNotifications(expoPushTokens, message);
