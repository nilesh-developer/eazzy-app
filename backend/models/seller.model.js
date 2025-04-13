import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { type } from "os";

const SellerSchema = new mongoose.Schema({
    storename: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    storeTitle: {
        type: String,
        required: true
    },
    about: {
        type: String
    },
    shopName: {
        type: String,
        required: true
    },
    shopCategory: {
        type: String,
        required: true
    },
    shopAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pinCode: {
        type: String
    },
    phoneNo: {
        type: Number,
        required: true
    },
    logo: {
        type: String
    },
    banner: {
        type: String
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }],
    customers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    }],
    sales: {
        type: Number,
        default: 0
    },
    expoPushToken: {
        type: String
    },
    appNotification: {
        type: Boolean,
        default: true
    },
    emailNotification: {
        type: Boolean,
        default: false
    },
    minOrderValueForDelivery: {
        type: Number,
        default: 0
    },
    deliveryCharges: {
        type: Number,
        default: 0
    },
    deliveryTimeType: {
        type: String,
        enum: ["allTime", "quick", "deliveryTimeSlot"],
        default: "allTime"
    },
    deliveryTimeSlot: [{
        type: Object
    }],
    estimatedDeliveryTime: {
        minTime: {
            type: String
        },
        maxTime: {
            type: String
        },
        unit: {
            type: String
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })


SellerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

SellerSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

SellerSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

SellerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const sellers = mongoose.model("sellers", SellerSchema)