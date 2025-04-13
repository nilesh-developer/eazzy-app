import { Router } from "express";
import { addCart, clearCart, clearCartOfOneStore, decreaseQty, getCustomerCart, getFullCart, increaseQty, removeFromCart } from "../controllers/cart.controller.js";

const router = Router()

router.route("/add").post(addCart)

router.route("/increase").post(increaseQty)

router.route("/decrease").post(decreaseQty)

router.route("/remove").post(removeFromCart)

router.route("/clear-products").post(clearCartOfOneStore)

router.route("/clear").post(clearCart)

router.route("/get-full-cart").post(getFullCart)

router.route("/get-customer-cart").post(getCustomerCart)

export { router as cartRouter }