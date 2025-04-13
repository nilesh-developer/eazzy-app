import { Router } from "express";
import { addSeller, getCurrentCustomer, loginCustomer, registerCustomer, resetCustomerPassword, sendCustomerOtp, storeExpoToken, updateCustomerPassword, updateProfile, verifyCustomerOtp } from "../controllers/customer.controller.js";

const router = Router()

router.route("/register").post(registerCustomer)

router.route("/login").post(loginCustomer)

router.route("/send-otp").post(sendCustomerOtp)

router.route("/verify-otp").post(verifyCustomerOtp)

router.route("/reset-password").post(resetCustomerPassword)

router.route("/store-expo-token").put(storeExpoToken)

router.route("/current-user").get(getCurrentCustomer)

router.route("/add-seller").post(addSeller)

router.route("/update-profile").post(updateProfile)

router.route("/update-password").post(updateCustomerPassword)

export { router as customerRouter }