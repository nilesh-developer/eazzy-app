import { customers } from "../models/customers.model.js"
import { sellers } from "../models/seller.model.js"

const addCart = async (req, res) => {
    try {
        const { product, customerId } = req.body

        // const customer = await customers.findById(customerId)
        // customer.cart.push({ ...product })
        // await customer.save()

        const updatedCustomer = await customers.findOneAndUpdate(
            { _id: customerId }, // Find the customer by ID
            { $push: { cart: { ...product } } }, // Add product to cart
            { new: true } // Return the updated document
        );

        return res.status(200).json({
            statusCode: 200,
            data: updatedCustomer.cart,
            message: "Product added to cart"
        })
    } catch (error) {
        console.log(error)
    }
}

const increaseQty = async (req, res) => {
    try {
        const { customerId, productId } = req.body;

        const updatedCustomer = await customers.findOneAndUpdate(
            { _id: customerId, "cart._id": productId }, // Find customer with the product in the cart
            { $inc: { "cart.$.qty": 1 } }, // Increment the qty by 1
            { new: true } // Return the updated document
        );

        if (!updatedCustomer) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while updating product quantity"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedCustomer.cart,
            message: "Cart Updated"
        })
    } catch (error) {
        console.log(error)
    }
}

const decreaseQty = async (req, res) => {
    try {
        const { customerId, productId } = req.body;

        const updatedCustomer = await customers.findOneAndUpdate(
            { _id: customerId, "cart._id": productId }, // Find customer with the product in the cart
            {
                $inc: { "cart.$.qty": -1 } // Decrease the qty by 1
            },
            { new: true }
        );

        // If the product's qty is now less than 1, remove it from the cart
        if (updatedCustomer) {
            const product = updatedCustomer.cart.find(item => item._id.toString() === productId);

            if (product && product.qty < 1) {
                await customers.findOneAndUpdate(
                    { _id: customerId },
                    { $pull: { cart: { _id: productId } } }, // Remove the product from cart
                    { new: true }
                );
            }
        }

        if (!updatedCustomer) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while updating product quantity"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedCustomer.cart,
            message: "Cart Updated"
        })
    } catch (error) {
        console.log(error)
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { customerId, productId } = req.body;

        const updatedCustomer = await customers.findOneAndUpdate(
            { _id: customerId },
            { $pull: { cart: { _id: productId } } }, // Remove the product from cart
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while updating product quantity"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedCustomer.cart,
            message: "Cart Updated"
        })
    } catch (error) {
        console.log(error)
    }
}

const clearCartOfOneStore = async (req, res) => {
    try {
        const { customerId, sellerId } = req.body;

        const seller = await sellers.findOne({ storename: sellerId })

        const updatedCustomer = await customers.findOneAndUpdate(
            { _id: customerId }, // Find customer by ID
            {
                $pull: {
                    cart: { seller: seller._id.toString() } // Remove all products matching this seller ID
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedCustomer) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while updating product quantity"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedCustomer.cart,
            message: "Cart Updated"
        })
    } catch (error) {
        console.log(error)
    }
}

const clearCart = async (req, res) => {
    try {
        const { customerId } = req.body;

        const updatedCustomer = await customers.findOneAndUpdate(
            { _id: customerId },
            {
                cart: []
            }
        );

        if (!updatedCustomer) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while updating product quantity"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedCustomer.cart,
            message: "Cart Updated"
        })
    } catch (error) {
        console.log(error)
    }
}

const getFullCart = async (req, res) => {
    try {
        const { customerId } = req.body;

        const updatedCustomer = await customers.findOne(
            { _id: customerId }
        );

        if (!updatedCustomer) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while getting cart"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updatedCustomer.cart,
            message: "All cart products"
        })
    } catch (error) {
        console.log(error)
    }
}

const getCustomerCart = async (req, res) => {
    try {
        const { customerId, sellerId } = req.body;

        const seller = await sellers.findOne({ storename: sellerId })

        const cart = await customers.findOne(
            { _id: customerId },
            {
                cart: {
                    $filter: {
                        input: "$cart",
                        as: "item",
                        cond: { $eq: ["$$item.seller", seller._id.toString()] } // Filter products by seller ID
                    }
                }
            }
        );

        if (!cart) {
            return res.status(400).json({
                statusCode: 400,
                message: "Failed to fetch customer cart"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: { cart: cart.cart, seller },
            message: "Fetched customer cart"
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    addCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCartOfOneStore,
    clearCart,
    getFullCart,
    getCustomerCart
}