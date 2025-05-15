import mongoose from "mongoose";
import User from "../Models/userModel.js";
import features from "../utils/features.js";
import coludinary from "cloudinary";
import { profile } from "console";
const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      return res
        .status(400)
        .render("sighupPage", { message: "Please provide all fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .render("sighupPage", { message: "User already exists." });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
    });

    res.status(201).render("mainpage", { message: "Registration successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).render("sighupPage", { message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(500)
        .send({
          success: false,
          messgage: "Please enter your credentials..",
          profilePic: "",
        });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(500)
        .send({ success: false, message: "invalid credentials" });
    }

    const token = user.generateToken();

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .render("mainpage", {
        message: "You are logged in!",
        profilePic: user.profilePic.url,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const userList = async (req, res) => {
  try {
    const user = await User.find();

    return res.status(200).json({
      success: true,
      message: "Here is the list of all the users",
      users: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("loginpage", {
      error: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .render("homepage", { message: "you r logged out.." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginPage = async (req, res) => {
  res.render("loginpage");
};
const singupPage = async (req, res) => {
  res.render("sighupPage", { message: "Welcome..." });
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation + Update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    //save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile API",
      error,
    });
  }
};
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Wrong old password",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update password API",
      error,
    });
  }
};
const uploadPic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const file = features(req.file);

    // Check if a profile picture already exists
    if (user.profilePic?.public_id) {
      await coludinary.v2.uploader.destroy(user.profilePic.public_id);
    }

    const cdb = await coludinary.v2.uploader.upload(file.content);

    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile picture uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile API",
      error,
    });
  }
};

export default {
  registerUser,
  loginUser,
  userList,
  logoutUser,
  singupPage,
  loginPage,
  updateUser,
  updatePassword,
  uploadPic,
};
