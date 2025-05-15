import express, { Router } from "express";
import { isAuth, isAdmin } from "../middlewares/auth.Middleware.js";

import orderController from "../Controllers/orderController.js";

const route = express.Router();

route.post("/create", isAuth, orderController.createOrder);
route.get("/my-orders", isAuth, orderController.getAllOrders);
route.post("/payment", isAuth, orderController.payments);
route.get(
  "/admin/get-all-orders",
  isAuth,
  isAdmin,
  orderController.getAllOrdersADMIN
);
export default route;
