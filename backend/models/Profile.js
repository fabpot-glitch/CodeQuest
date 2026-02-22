const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    avatar: {
      type: String, // URL or base64 string
      default: ""
    },

    bio: {
      type: String,
      maxlength: 300,
      default: ""
    },

    skills: {
      type: [String],
      default: []
    },

    social: {
      github: {
        type: String,
        default: ""
      },
      linkedin: {
        type: String,
        default: ""
      },
      twitter: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

// Prevent model overwrite error in dev
module.exports = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
