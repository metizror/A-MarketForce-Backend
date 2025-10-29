import jwt from "jsonwebtoken";
import dotenv from "@dotenvx/dotenvx";
import AdminAuth from "../models/admin_auth.model.js";
import CustomerAuth from "../models/customer_auth.model.js";

dotenv.config();

export const isLoggedInAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminAuth.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Invalid token. Admin not found." });
    }

    res.locals.admin = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};

export const isLoggedInCustomer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await CustomerAuth.findById(decoded.id).select("-password");

    if (!customer) {
      return res.status(401).json({ message: "Invalid token. Customer not found." });
    }

    if (!customer.isActive) {
      return res.status(403).json({ message: "Account is not active. Please wait for approval." });
    }

    res.locals.user = customer;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};

export const checkAdminRole = (allowedRoles = ["admin", "superadmin"]) => {
  return (req, res, next) => {
    if (!res.locals.admin) {
      return res.status(401).json({ message: "Admin authentication required." });
    }

    if (!res.locals.admin.role) {
      return res.status(403).json({ message: "Admin role not assigned." });
    }

    if (!allowedRoles.includes(res.locals.admin.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}.` 
      }); 
    }

    next();
  };
};
