import express from "express";
import { isAuth, isAdmin } from "../middlewares/auth.Middleware.js";

import categoryController from "../Controllers/categoryController.js";

const route = express.Router();

route.post("/create", isAuth, categoryController.createCategory);
route.get("/get-all", categoryController.getAllCategory);
route.delete("/delete/:id", isAuth, categoryController.deleteCategory);
route.put("/update/:id", isAuth, categoryController.updateCategory);
export default route;
