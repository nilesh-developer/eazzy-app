import { products } from "../models/products.model.js";
import { sellers } from "../models/seller.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// const createProduct = async (req, res) => {
//     try {
//         const { name, price, category, description, sellerId } = req.body;
//         const images = req.files;
//         console.log(images)
//         const product = await products.create({
//             seller: sellerId,
//             name,
//             price,
//             category,
//             description,
//             images: {
//                 featuredImage: images?.image_1 ? await uploadOnCloudinary(images.image_1[0].path) : null,
//                 image1: images?.image_2 ? await uploadOnCloudinary(images.image_2[0].path) : null,
//                 image2: images?.image_3 ? await uploadOnCloudinary(images.image_3[0].path) : null,
//                 image3: images?.image_4 ? await uploadOnCloudinary(images.image_4[0].path) : null,
//                 image4: images?.image_5 ? await uploadOnCloudinary(images.image_5[0].path) : null,
//             }
//         })

//         if (!product) {
//             return res.status(400)
//                 .json({
//                     statusCode: 400,
//                     message: "Something went wrong while storing product"
//                 })
//         }

//         const seller = await sellers.findById(sellerId)
//         seller.products.push(product._id)
//         await seller.save()

//         return res.status(200)
//             .json({
//                 statusCode: 200,
//                 data: product,
//                 message: "Product created"
//             })
//     } catch (error) {
//         console.error(error)
//     }
// }

const createProduct = async (req, res) => {
    try {
        const { name, price, category, description, sellerId } = req.body;
        const images = req.files;
        console.log(images);

        // Handling image uploads dynamically
        const imagesPaths = [];
        for (let i = 1; i <= 5; i++) {
            const imageField = images[`image_${i}`];
            if (imageField) {
                const uploadedImage = await uploadOnCloudinary(imageField[0].path);
                imagesPaths.push(uploadedImage);
            }
        }

        // Creating the product
        const product = await products.create({
            seller: sellerId,
            name,
            price,
            category,
            description,
            images: {
                featuredImage: imagesPaths[0] || null,
                image1: imagesPaths[1] || null,
                image2: imagesPaths[2] || null,
                image3: imagesPaths[3] || null,
                image4: imagesPaths[4] || null,
            }
        });

        if (!product) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while storing product",
            });
        }

        const seller = await sellers.findById(sellerId);
        seller.products.push(product._id);
        await seller.save();

        return res.status(200).json({
            statusCode: 200,
            data: product,
            message: "Product created",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, category, description, sellerId } = req.body;
        const images = req.files;

        const productData = await products.findOne({ _id: productId, seller: sellerId })
        
        const product = await products.findOneAndUpdate({ _id: productId, seller: sellerId }, {
            name,
            price,
            category,
            description,
            images: {
                featuredImage: images?.image_1 ? await uploadOnCloudinary(images.image_1[0].path) : productData?.images?.featuredImage,
                image1: images?.image_2 ? await uploadOnCloudinary(images.image_2[0].path) : productData?.images?.image1,
                image2: images?.image_3 ? await uploadOnCloudinary(images.image_3[0].path) : productData?.images?.image2,
                image3: images?.image_4 ? await uploadOnCloudinary(images.image_4[0].path) : productData?.images?.image3,
                image4: images?.image_5 ? await uploadOnCloudinary(images.image_5[0].path) : productData?.images?.image4
            }
        })

        if (!product) {
            return res.status(400)
                .json({
                    statusCode: 400,
                    message: "Something went wrong while updating product"
                })
        }

        return res.status(200)
            .json({
                statusCode: 200,
                data: product,
                message: "Product details updated"
            })
    } catch (error) {
        console.log(error)
    }
}

const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await products.findById(productId)

        const seller = await sellers.findById(product.seller)

        if (!product) {
            return res.status(400)
                .json({
                    statusCode: 400,
                    message: "Something went wrong"
                })
        }

        return res.status(200)
            .json({
                statusCode: 200,
                data: product,
                seller: seller,
                message: "Product details fetched"
            })
    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const productDeleted = await products.findByIdAndDelete(productId)

        if (!productDeleted) {
            return res.status(400)
                .json({
                    statusCode: 400,
                    message: "Something went wrong"
                })
        }

        const seller = await sellers.findById(productDeleted.seller)
        seller.products.pop(productDeleted._id)
        await seller.save()

        return res.status(200)
            .json({
                statusCode: 200,
                message: "Product deleted"
            })
    } catch (error) {
        console.log(error)
    }
}

const getAllProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const product = await products.find({ seller: sellerId })

        return res.status(200).json({
            statusCode: 200,
            data: product.reverse(),
            message: "All products fetched successfully"
        })

    } catch (error) {
        console.log(error)
    }
}

const updateProductStatus = async (req, res) => {
    try {
        const { sellerId, productId } = req.body
        const product = await products.findOne({ seller: sellerId, _id: productId })
        const updateStatus = await products.findByIdAndUpdate(product._id, {
            status: !product.status
        })

        if (!updateStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: updateStatus,
            message: "Product status updated"
        })

    } catch (error) {
        console.log(error)
    }
}


const getPaginationProducts = async (req, res) => {
    const { page, limit, seller } = req.query;

    try {
        // Parse pagination parameters
        const pageNum = parseInt(page);
        const pageSize = parseInt(limit);

        const sellerData = await sellers.findOne({ storename: seller })

        // Query the database with pagination
        const items = await products.find({ seller: sellerData._id, status: true })
            .skip((pageNum - 1) * pageSize) // Skip items of previous pages
            .limit(pageSize); // Limit items to page size

        // Get the total count of items in the collection
        const totalItems = await products.countDocuments();

        // Response
        return res.status(200).json({
            items: items.reverse(),
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            currentPage: pageNum,
        });
    } catch (err) {
        console.error("Error fetching items:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export {
    createProduct,
    updateProduct,
    getProductDetails,
    deleteProduct,
    getAllProducts,
    updateProductStatus,
    getPaginationProducts
}
