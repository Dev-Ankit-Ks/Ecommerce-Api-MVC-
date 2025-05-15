import { stripe } from "../app.js";
import orderModel from "../Models/orderModel.js";
import productModel from "../Models/productModel.js";

const createOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    for (let i = 0; i < orderItems.length; i++) {
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully...",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Order API",
      error,
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });
    if (!orders) {
      res.status(404).send({
        success: false,
        message: "no orders found",
        error,
      });
    }
    res.status(200).send({
      success: true,
      message: "your order data",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all Order API",
      error,
    });
  }
};
const payments = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount),
      currency: "cad",
    });
    res.status(200).send({
      success: true,
      message: "Pyments success",
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in payemnt API",
      error,
    });
  }
};

const getAllOrdersADMIN = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.status(200).send({
      success : true,
      message : "All Orders Data",
      orders
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in payemnt API",
      error,
    });
  }
};
export default {
  createOrder,
  getAllOrders,
  getAllOrdersADMIN,
  payments,
};
