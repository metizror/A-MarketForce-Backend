import AdminAuth from "../models/admin_auth.model.js";
import CustomerAuth from "../models/customer_auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../services/jwt.service.js";

export const registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, companyName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await CustomerAuth.findOne({ email });
    if (customer) {
      return res
        .status(400)
        .json({ message: "Customer already exists with this email" });
    }
    const newCustomer = await CustomerAuth.create({
      firstName,
      lastName,
      email,
      companyName,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "Customer registered successfully and waiting for approval",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register customer",
      error: error.message,
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await CustomerAuth.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Account not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!customer.isActive) {
      return res
        .status(400)
        .json({ message: "You are not activated, please wait for approval" });
    }
    const token = await generateToken(customer._id);
    res
      .status(200)
      .json({ message: "Logged in successfully", token, customer: customer });
  } catch (error) {
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};
