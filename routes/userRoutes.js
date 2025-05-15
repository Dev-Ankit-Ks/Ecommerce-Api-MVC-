import express from "express";
import mongoose from "mongoose";
import { isAuth, isAdmin } from "../middlewares/auth.Middleware.js";


import singleUpload from "../middlewares/multer.js";
import colors from "colors";
import User from "../Models/userModel.js";
import cc from "../Controllers/userController.js";
const router = express.Router();

router.post("/register", cc.registerUser);

router.post("/login", cc.loginUser);

router.get("/login", cc.loginPage);

router.get("/register", cc.singupPage);

router.get("/userlist", isAuth, cc.userList);

router.get("/logout", isAuth, cc.logoutUser);

router.put("/profile-update", isAuth, cc.updateUser);

router.put("/update-password", isAuth, cc.updatePassword);

router.put("/update-picture", isAuth, singleUpload, cc.uploadPic);
export default router;
