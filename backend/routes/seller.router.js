import { Router } from "express";
import { addTimeSlot, changeStoreStatus, checkStorenameUnique, getCurrentSeller, getDeliveryCharges, getSellerData, loginSeller, provideAllTimeDelivery, registerSeller, resetPassword, sendSellerOtp, setDeliveryCharges, setEstimatedDeliveryTime, storeExpoToken, updateAppNotificationStatus, updateEmailNotificationStatus, updatePassword, updateSellerPassword, updateShopDetails, updateStore, verifySellerOtp } from "../controllers/seller.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/check-storename").post(checkStorenameUnique)

// router.route("/sendotp").post(sendotp)

// router.route("/verifyotp").post(verifyOtp)

router.route("/register").post(registerSeller)

router.route("/login").post(loginSeller)

router.route("/send-otp").post(sendSellerOtp)

router.route("/verify-otp").post(verifySellerOtp)

router.route("/reset-password").post(resetPassword)

router.route("/store-expo-token").put(storeExpoToken)

router.route("/update-password/:id").patch(updatePassword)

router.route("/current-user").get(getCurrentSeller)

router.route("/c/:storename").get(getSellerData)

router.route("/status").post(changeStoreStatus)

router.route("/update-store").post(upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), updateStore)

router.route("/update-shop-details").post(updateShopDetails)

router.route("/update-password").post(updateSellerPassword)

router.route("/app-notification").post(updateAppNotificationStatus)

router.route("/email-notification").post(updateEmailNotificationStatus)

router.route("/set-delivery-charges").post(setDeliveryCharges)

router.route("/get-delivery-charges/:id").get(getDeliveryCharges)

router.route("/add-time-slot").post(addTimeSlot)

router.route("/set-estimated-delivery-time").post(setEstimatedDeliveryTime)

router.route("/all-time-delivery").post(provideAllTimeDelivery)

export { router as sellerRouter }