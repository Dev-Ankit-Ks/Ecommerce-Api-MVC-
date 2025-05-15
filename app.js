import express from "express";
import mongoose from "mongoose";
import colors from "colors";
import morgan from "morgan";
import helmet from "helmet";
import Stripe from "stripe";
import path from "path";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import orderRoute from "./routes/orderRoutes.js";
import User from "./Models/userModel.js";
import dotenv from "dotenv";
import userRoute from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import { fileURLToPath } from "url";
import coludinary from "cloudinary";

dotenv.config();

connectDB;

export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

coludinary.v2.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_SECRET,
});

const app = express();

const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// Serve static files (optional)
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/order", orderRoute);
import jwt from "jsonwebtoken";

app.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.render("homepage", {
          message: "User not found.",
          profilePic: "",
        });
      }

      return res.render("mainpage", {
        message: `Welcome back, ${user.name}!`,
        profilePic: user.profilePic ? user.profilePic.url : "", // Provide a default image path
      });
    }

    return res.render("homepage", { message: "", profilePic: "" });
  } catch (error) {
    console.log(error);
    return res.render("homepage", {
      message: "Error occurred.",
      profilePic: "",
    });
  }
});

app.listen(port, () =>
  console.log(
    `> Server is up and running on port : ${port} on ${process.env.NODE_ENV} MODE`
      .bgGreen.white.bold
  )
);
