import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellers"
    },
    products: [{
        type: Object,
        required: true
    }],
    status: {
        type: String,
        enum: ['Pending', 'Canceled', 'Accepted', 'Rejected', 'Delivered'],
        required: true
    },
    payment: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    selectedDeliveryTime: {
        type: String
    },
    deliveryCharges: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const orders = mongoose.model("orders", OrderSchema)