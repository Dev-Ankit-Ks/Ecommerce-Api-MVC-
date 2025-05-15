import express from "express";
import { isAuth, isAdmin } from "../middlewares/auth.Middleware.js";

import imagework from "../middlewares/multer.js";
import productController from "../Controllers/productController.js";
const route = express.Router();

route.get("/get-all", productController.getAllProducts);
route.get("/top", productController.getTopProducts);
route.get("/:id", productController.getSingleProduct);
route.post("/create", isAuth, imagework, productController.createProduct);
route.put("/:id", isAuth, productController.updateProduct);
route.put(
  "/image/:id",
  isAuth,
  imagework,
  productController.updateProductImage
);

route.delete("/delete-image/:id", isAuth, productController.deleteProductImage);

route.delete("/delete/:id", isAuth, productController.deleteProduct);

route.put("/:id/review", isAuth, productController.createProductReview);
export default route;
