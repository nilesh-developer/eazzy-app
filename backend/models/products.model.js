import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellers"
    },
    name: {
        type: String,
        required: true
    },
    images: {
        featuredImage: { type: String },
        image1: { type: String },
        image2: { type: String },
        image3: { type: String },
        image4: { type: String }
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
})

export const products = mongoose.model("products", ProductSchema)