import { Router } from "express";
import { cancelOrder, getCustomerOrders, getOrderDetails, getPaginationOrders, getPaginationOrdersSeller, getSellerOrders, placeOrder, updatePaymentStatus, updateStatus } from "../controllers/order.controller.js";

const router = Router()

router.route("/place").post(placeOrder);

router.route("/get-orders/:customerId").get(getCustomerOrders)

router.route("/pagination-orders/:customerId").get(getPaginationOrders)

router.route("/pagination-orders-seller/:sellerId").get(getPaginationOrdersSeller)

router.route("/get-seller-orders/:sellerId").get(getSellerOrders)

router.route("/cancel").patch(cancelOrder)

router.route("/order-details/:id").get(getOrderDetails)

router.route("/update-status").patch(updateStatus)

router.route("/update-payment-status").patch(updatePaymentStatus)

export { router as orderRouter }