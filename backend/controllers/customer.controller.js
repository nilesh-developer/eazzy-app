import { customers } from "../models/customers.model.js";
import jwt from "jsonwebtoken"
import { sellers } from "../models/seller.model.js";
import nodeMailer from 'nodemailer'

const registerCustomer = async (req, res) => {
    try {
        const { name, email, password, address, city, state, pinCode, mobile } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400), json({
                statusCode: 400,
                message: "Invalid email"
            })
        }

        const customer = await customers.create({
            name,
            email,
            password,
            address,
            city,
            state,
            pinCode,
            phoneNo: mobile
        })

        if (!customer) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: customer,
            message: "User registered successfully"
        })
    } catch (error) {
        console.error(error)
    }
}

const loginCustomer = async (req, res) => {
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
        const userExist = await customers.findOne({ email: emailId })

        if (!userExist) {
            return res.status(400).json({
                statusCode: 400,
                message: "User not exist"
            })
        }

        const result = await userExist.isPasswordCorrect(password)

        if (result) {
            const updatedExpoPushToken = await customers.findByIdAndUpdate(userExist._id, {
                expoPushToken
            })
            const token = await userExist.generateAccessToken()

            return res.status(200).json({
                statusCode: 200,
                data: userExist,
                token,
                message: "User logged in successfully"
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

const sendCustomerOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const OTP = Math.floor(1 + Math.random() * 9000);

        const emailExist = await customers.findOne({ email })

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
            from: `Eazzy <${process.env.OTP_EMAIL_ID}>`,
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
            border-bottom: 4px solid #17834f;
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
            background-color: #fafffd;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border: 2px dashed #17834f;
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
            <img src="https://res.cloudinary.com/dodtn64kw/image/upload/v1737265695/logo_pkxdeu_fg3yqe.png" alt="Eazzy Logo">
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

const verifyCustomerOtp = async (req, res) => {
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

const resetCustomerPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const updated = await customers.findOneAndUpdate({ email }, {
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

const getCurrentCustomer = async (req, res) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(400).json(
                { statusCode: 400, message: "Unauthorized request" }
            )
        }
        const tokenDetails = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await customers.findById(tokenDetails._id).select("-password").populate("sellers")

        return res.status(200)
            .json(
                { statusCode: 200, data: user, message: "current user fetched successfully" }
            )

    } catch (error) {
        console.log(error)
    }
}

const addSeller = async (req, res) => {
    const { customerId, sellerCode } = req.body;

    const sellerExist = await sellers.findOne({ storename: sellerCode.trim() })

    if (!sellerExist) {
        return res.status(400).json({
            statusCode: 400,
            message: "Invalid code"
        })
    }

    const customer = await customers.findById(customerId).populate("sellers")
    const exists = customer.sellers.some(seller => seller.storename === sellerCode.trim());

    if (exists) {
        return res.status(400).json({
            statusCode: 400,
            message: "Store already added"
        })
    }
    customer.sellers.push(sellerExist._id)
    customer.save()

    sellerExist.customers.push(customer._id)
    sellerExist.save()

    return res.status(200).json({
        statusCode: 200,
        message: "Seller added successfully!"
    })
}

const updateProfile = async (req, res) => {
    const { customerId, name, address, city, state, pinCode, phoneNo } = req.body;

    const updatedProfile = await customers.findByIdAndUpdate(customerId, {
        name,
        address,
        city,
        state,
        pinCode,
        phoneNo
    })

    if (!updatedProfile) {
        return res.status(400).json({
            statusCode: 400,
            message: "Something went wrong while updating profile"
        })
    }

    return res.status(200).json({
        statusCode: 200,
        message: "Profile updated!"
    })
}

const updateCustomerPassword = async (req, res) => {
    try {
        const { customerId, oldPassword, newPassword } = req.body;

        const customer = await customers.findById(customerId)
        const result = await customer.isPasswordCorrect(oldPassword)

        if (!result) {
            return res.status(500).json({
                statusCode: 500,
                message: "Incorrect password"
            })
        }

        const updatedPassword = await customers.findOneAndUpdate({ _id: customer._id }, { password: newPassword })

        return res.status(200).json({
            statusCode: 200,
            message: "Password changed Successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}

const storeExpoToken = async (req, res) => {
    try {
        const { customerId, expoPushToken } = req.body;
        console.log(expoPushToken)

        const updatedExpoPushToken = await customers.findByIdAndUpdate(customerId, {
            expoPushToken
        })

        if(!updatedExpoPushToken){
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
    registerCustomer,
    loginCustomer,
    sendCustomerOtp,
    verifyCustomerOtp,
    resetCustomerPassword,
    getCurrentCustomer,
    addSeller,
    updateProfile,
    updateCustomerPassword,
    storeExpoToken
}