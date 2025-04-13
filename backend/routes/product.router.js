import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getPaginationProducts, getProductDetails, updateProduct, updateProductStatus } from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/create").post(upload.fields([
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'image_3', maxCount: 1 },
    { name: 'image_4', maxCount: 1 },
    { name: 'image_5', maxCount: 1 },
]), createProduct);

router.route("/update/:productId").put(upload.fields([
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'image_3', maxCount: 1 },
    { name: 'image_4', maxCount: 1 },
    { name: 'image_5', maxCount: 1 },
]), updateProduct)

router.route("/details/:productId").get(getProductDetails)

router.route("/delete/:productId").delete(deleteProduct)

router.route("/get-products").get(getAllProducts)

router.route("/update-status").post(updateProductStatus)

router.route("/pagination-products").get(getPaginationProducts)

export { router as productRouter }