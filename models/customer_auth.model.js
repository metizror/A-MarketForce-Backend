import mongoose from "mongoose";

const customerAuthSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Basic email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(v)) {
            return false;
          }
          // Business email validation - reject free email providers
          const freeEmailProviders = [
            'gmail.com',
            'yahoo.com',
            'hotmail.com',
            'outlook.com',
            'aol.com',
            'icloud.com',
            'mail.com',
            'protonmail.com',
            'yandex.com',
            'zoho.com',
            'gmx.com',
            'live.com',
            'msn.com',
            'rediffmail.com',
            'inbox.com',
            'rocketmail.com',
            'me.com',
            'mac.com',
          ];
          const domain = v.split('@')[1]?.toLowerCase();
          return !freeEmailProviders.includes(domain);
        },
        message: "Only business email addresses are accepted (no Gmail, Yahoo, etc.)",
      },
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CustomerAuth", customerAuthSchema);
