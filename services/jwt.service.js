import jwt from "jsonwebtoken";
import dotenv from "@dotenvx/dotenvx";
dotenv.config();

export const generateToken = async (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    throw new Error("Failed to generate token", error.message);
  }
};
