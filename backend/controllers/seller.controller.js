import jwt from "jsonwebtoken";
import { sellers } from "../models/seller.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from 'crypto';
import nodeMailer from 'nodemailer';

function generateStoreCode(sellerName, existingCodes, length = 8) {
    const initials = sellerName
        .split(' ')
        .map(word => word[0].toLowerCase())
        .join('')
        .slice(0, 2); // First 2 initials in lowercase

    let code;
    do {
        const randomPart = crypto.randomBytes((length - initials.length) / 2)
            .toString('hex') // Hex is already lowercase
            .slice(0, length - initials.length);
        code = `${initials}${randomPart}`;
    } while (existingCodes.includes(code)); // Ensure uniqueness

    return code;
}

const checkStorenameUnique = async (req, res) => {
    try {
        const { storename } = req.body;

        const check = await sellers.findOne({ storename })

        if (check) {
            return res.status(400).json(
                { statusCode: 400, storeExist: true, message: "Store name already used" }
            )
        }

        return res.status(200).json(
            { statusCode: 200, storeExist: false, message: "Store name available" }
        )
    } catch (error) {
        console.log(error)
    }
}

const registerSeller = async (req, res) => {
    const { email, password, shopName, shopCategory, shopAddress, city, state, pinCode, mobile } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400), json({
            statusCode: 400,
            message: "Invalid email"
        })
    }

    try {
        const allSellers = await sellers.find({}, 'storename')
        const storeNames = allSellers.map(store => store.storename); // Extract `storename` values

        const userCreated = await sellers.create({
            email,
            password,
            storename: generateStoreCode(shopName, storeNames), //shopName.toLowerCase().replace(/\s+/g, ''),
            banner: 'https://res.cloudinary.com/dodtn64kw/image/upload/v1738400740/store-banner_mxgddj.jpg',
            storeTitle: shopName,
            shopName,
            shopCategory,
            shopAddress,
            city,
            state,
            pinCode,
            phoneNo: mobile
        })

        if (!userCreated) {
            return res.status(400), json({
                statusCode: 400,
                message: "Something went wrong while registering seller"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: userCreated,
            message: "Seller registered successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const loginSeller = async (req, res) => {
    try {
        const { email, password, expoPushToken } = req.body;
        console.log(expoPushToken)
        if (email === "" || password === "") {
            res.status(400)
                .json(
                    { statusCode: 400, message: "All fields are required" }
                )
        }

        const emailId = email.trim()
        const userExist = await sellers.findOne({ email: emailId })

        if (!userExist) {
            return res.status(400).json({
                statusCode: 400,
                message: "User not exist"
            })
        }

        const result = await userExist.isPasswordCorrect(password)

        if (result) {

            const token = await userExist.generateAccessToken()
            const updatedExpoPushToken = await sellers.findByIdAndUpdate(userExist._id, {
                expoPushToken
            })

            return res.status(200).json({
                statusCode: 200,
                data: userExist,
                token,
                message: "Seller logged in successfully"
            })
        } else {
            return res.status(400).json({
                statusCode: 400,
                message: "Password is invalid"
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const sendSellerOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const OTP = Math.floor(1 + Math.random() * 9000);

        const emailExist = await sellers.findOne({ email })

        if (!emailExist) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email is not registered"
            })
        }

        const emailProvider = nodeMailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.OTP_EMAIL_ID,
                pass: process.env.OTP_EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        })

        const receiver = {
            from: `Eazzy Business <${process.env.OTP_EMAIL_ID}>`,
            to: email,
            subject: "OTP Verification",
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Requested</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: white;
            padding: 20px;
            text-align: center;
            border-bottom: 4px solid #1254e8;
        }
        .header img {
            width: 120px;
        }
        .content {
            padding: 20px 30px;
            color: #333;
        }
        .content h2 {
            font-size: 24px;
            color: #333;
        }
        .otp-box {
            background-color: #f7faff;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border: 2px dashed #1254e8;
            border-radius: 8px;
        }
        .otp-box .otp {
            font-size: 28px;
            font-weight: bold;
            color: #000000;
        }
        .content p {
            line-height: 1.7;
            font-size: 16px;
            color: #555;
        }
        .support {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .support a {
            background-color: #ee7401;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 10px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .support a:hover {
            background-color: #fd6900;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 15px 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #007ad9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with logo and background -->
        <div class="header">
            <img src="https://res.cloudinary.com/dodtn64kw/image/upload/v1737265574/icon_wdetut.png" alt="Eazzy Logo">
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2>OTP Requested</h2>
            <p>Hi,</p>
            <p>Your One Time Password (OTP) is:</p>

            <!-- OTP Box with dashed border -->
            <div class="otp-box">
                <span class="otp">${OTP}</span>
            </div>

            <p>This password will expire in ten minutes if not used.</p>
            <p>If you did not request this, please contact our customer support immediately to secure your account.</p>

            <p>Thank You,<br><strong>Eazzy Business Team</strong></p>
        </div>

        <!-- Footer with security warning -->
        <div class="footer">
            <p>Never share your OTP with anyone. Even if the caller claims to be from Eazzy.</p>
            <p>Sharing these details can lead to unauthorized access to your account.</p>
            <p>This is an automatically generated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`,
        }

        const otpToken = await jwt.sign({ otp: OTP }, process.env.OTP_TOKEN_SECRET, { expiresIn: process.env.OTP_TOKEN_EXPIRY })

        emailProvider.sendMail(receiver, (error, emailResponse) => {
            if (error) {
                console.log(error)
                return res.status(400).json({ message: "Something went wrong" })
            } else {
                return res.status(200).json({ message: "OTP send successfully on your email account", otp: otpToken })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const verifySellerOtp = async (req, res) => {
    try {
        const { otpToken, otp } = req.body;

        const tokenValue = await jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET);

        if (Number(otp) !== tokenValue.otp) {
            return res.status(400).json({ statusCode: 400, message: "Incorrect OTP" })
        }

        return res.status(200).json({ message: "OTP Verified" })
    } catch (error) {
        console.log(error)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const updated = await sellers.findOneAndUpdate({ email }, {
            password
        })

        if (!updated) {
            return res.status(400).json({
                message: "Something went wrong while updating password"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Password is updated successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await sellers.findById(id)
        const result = await user.isPasswordCorrect(oldPassword)

        if (!result) {
            return res.status(400).json(
                new ApiResponse(400, "", "Old Password is incorrect")
            )
        }

        const updatedPassword = await sellers.findOneAndUpdate({ _id: id }, { password: newPassword })

        return res.status(200)
            .json(
                { statusCode: 200, data: updatedPassword, message: "Password changed successfully" }
            )
    } catch (error) {
        console.log(error)
    }
}

const getCurrentSeller = async (req, res) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(400).json(
                { statusCode: 400, message: "Unauthorized request" }
            )
        }
        const tokenDetails = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await sellers.findById(tokenDetails._id).select("-password").populate("products").populate("customers")

        return res.status(200)
            .json(
                { statusCode: 200, data: user, message: "current user fetched successfully" }
            )

    } catch (error) {
        console.log(error)
    }
}

const getSellerData = async (req, res) => {
    const { storename } = req.params;

    if (!storename?.trim()) {
        return res.status(400).json({
            statusCode: 400,
            message: "Seller Id is missing"
        })
    }

    const store = await sellers.findOne({ storename }).select("-appNotification -createdAt -customers -email -emailNotifiaction -isVerfied -orders -password -sales -updatedAt -__v")

    return res.status(200)
        .json(
            { statusCode: 200, data: store, message: "User Data fetched successfully" }
        )
}

const changeStoreStatus = async (req, res) => {
    try {
        const { sellerId, status } = req.body;

        const updateStatus = await sellers.findByIdAndUpdate(sellerId, {
            status: status
        })

        if (!updateStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Status not updated"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updateStatus,
            message: "Status Updated"
        })
    } catch (error) {
        console.log(error)
    }
}

const updateStore = async (req, res) => {
    try {
        const { sellerId, title, about } = req.body;
        const images = req.files;
        const sellerData = await sellers.findById(sellerId)
        const seller = await sellers.findByIdAndUpdate(sellerId, {
            storeTitle: title,
            about,
            logo: images?.logo ? await uploadOnCloudinary(images?.logo[0]?.path) : sellerData?.logo || null,
            banner: images?.banner ? await uploadOnCloudinary(images?.banner[0]?.path) : sellerData?.banner || null
        })
        if (!seller) {
            return res.status(500).json({
                statusCode: 500,
                message: "Data is not updated because of some issue in server"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Store Updated Successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}

const updateShopDetails = async (req, res) => {
    try {
        const { sellerId, shopName, shopAddress, city, state, pinCode, phoneNo } = req.body;

        const update = await sellers.findByIdAndUpdate(sellerId, {
            shopName,
            shopAddress,
            city,
            state,
            pinCode,
            phoneNo
        })

        if (!update) {
            return res.status(500).json({
                statusCode: 500,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Store Updated Successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}

const updateSellerPassword = async (req, res) => {
    try {
        const { sellerId, oldPassword, newPassword } = req.body;

        const seller = await sellers.findById(sellerId)
        const result = await seller.isPasswordCorrect(oldPassword)

        if (!result) {
            return res.status(500).json({
                statusCode: 500,
                message: "Incorrect password"
            })
        }

        const updatedPassword = await sellers.findOneAndUpdate({ _id: seller._id }, { password: newPassword })

        return res.status(200).json({
            statusCode: 200,
            message: "Store Updated Successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}

const updateAppNotificationStatus = async (req, res) => {
    try {
        const { sellerId, status } = req.body;
        const updatedStatus = await sellers.findByIdAndUpdate(sellerId, {
            appNotification: status
        }, {
            new: true
        })

        if (!updatedStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedStatus
        })

    } catch (error) {
        console.log(error)
    }
}

const updateEmailNotificationStatus = async (req, res) => {
    try {
        const { sellerId, status } = req.body;
        const updatedStatus = await sellers.findByIdAndUpdate(sellerId, {
            emailNotification: status
        }, {
            new: true
        })

        if (!updatedStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedStatus
        })

    } catch (error) {
        console.log(error)
    }
}

const addTimeSlot = async (req, res) => {
    try {
        const { timeSlots, sellerId, deliveryTimeType } = req.body;

        const seller = await sellers.findByIdAndUpdate(sellerId, {
            deliveryTimeSlot: timeSlots,
            deliveryTimeType
        })

        if (!seller) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Added delivery time slots"
        })
    } catch (error) {
        console.log(error)
    }
}

const provideAllTimeDelivery = async (req, res) => {
    try {
        const { deliveryTimeType, sellerId } = req.body;

        const seller = await sellers.findByIdAndUpdate(sellerId, {
            deliveryTimeType
        })

        if (!seller) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "All Time Delivery is enabled."
        })
    } catch (error) {
        console.error(error)
    }
}

const setEstimatedDeliveryTime = async (req, res) => {
    try {
        const { deliveryTimeType, estimatedTime, sellerId } = req.body;

        const seller = await sellers.findByIdAndUpdate(sellerId, {
            deliveryTimeType,
            estimatedDeliveryTime: {
                minTime: estimatedTime.minTime,
                maxTime: estimatedTime.maxTime,
                unit: estimatedTime.unit
            }
        })

        if (!seller) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Estimated delivery time is saved"
        })
    } catch (error) {
        console.error(error)
    }
}

const setDeliveryCharges = async (req, res) => {
    try {
        const { sellerId, minOrderValueForDelivery, deliveryCharges } = req.body;

        const updatedSeller = await sellers.findByIdAndUpdate(sellerId, {
            minOrderValueForDelivery,
            deliveryCharges
        }, { new: true })

        if (!updatedSeller) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while saving delivery charges"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: {
                minOrderValueForDelivery: updatedSeller.minOrderValueForDelivery,
                deliveryCharges: updatedSeller.deliveryCharges
            },
            message: "Delivery Charges Saved"
        })
    } catch (error) {
        console.log(error)
    }
}

const getDeliveryCharges = async (req,res) => {
    try {
        const { id } = req.params;

        const updatedSeller = await sellers.findById(id)

        if (!updatedSeller) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while fetching delivery charges"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: {
                minOrderValueForDelivery: updatedSeller.minOrderValueForDelivery,
                deliveryCharges: updatedSeller.deliveryCharges
            },
            message: "Data fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const storeExpoToken = async (req, res) => {
    try {
        const { sellerId, expoPushToken } = req.body;
        console.log(expoPushToken)

        const updatedExpoPushToken = await sellers.findByIdAndUpdate(sellerId, {
            expoPushToken
        })

        if (!updatedExpoPushToken) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while storing expo token"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Expo token stored"
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    checkStorenameUnique,
    registerSeller,
    loginSeller,
    sendSellerOtp,
    verifySellerOtp,
    resetPassword,
    updatePassword,
    getCurrentSeller,
    getSellerData,
    changeStoreStatus,
    updateStore,
    updateShopDetails,
    updateSellerPassword,
    updateAppNotificationStatus,
    updateEmailNotificationStatus,
    addTimeSlot,
    provideAllTimeDelivery,
    setEstimatedDeliveryTime,
    setDeliveryCharges,
    getDeliveryCharges,
    storeExpoToken
}