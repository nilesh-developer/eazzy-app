import express from "express";
import cors from "cors";
import dbConnect from "./db/index.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config()

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("hello world")
})

app.get("/test", async (req, res) => {
  const message = {
    to: 'ExponentPushToken[jKwGYoBeH5OzwQFnk_tOoj]',
    sound: 'default',
    title: 'Test Notification',
    body: 'This is a test notification',
    data: { test: 'data' },
  };

  const sended = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (sended) {
    res.send("Sended")
  } else {
    res.send("Not sended")
  }
})


app.get("/sdk", async (req, res) => {
  try {
    const result = await sendNotifications(['ExponentPushToken[jKwGYoBeH5OzwQFnk_tOoj]'], 'Test Notification', 'This is a test notification')
    if(result){
      res.send("Sended")
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification.', details: error });
  }
})

import { sellerRouter } from "./routes/seller.router.js";
import { productRouter } from "./routes/product.router.js";
import { customerRouter } from "./routes/customer.router.js";
import { orderRouter } from "./routes/order.router.js";
import { notificationRouter } from "./routes/notification.router.js";
import sendNotifications from "./utils/sendNotification.js";
import { cartRouter } from "./routes/cart.router.js";

app.use("/api/seller", sellerRouter)
app.use("/api/product", productRouter)
app.use("/api/customer", customerRouter)
app.use("/api/order", orderRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/cart", cartRouter)

// Start server
dbConnect()
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((error) => {
    console.log("Something went wrong", error)
  })
