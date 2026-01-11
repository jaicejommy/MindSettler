const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    // Password for email/password users (optional for Firebase/Google users)
    password: {
      type: String,
      select: false // Don't include by default in queries
    },

    firebaseUID: {
      type: String
    },

    phone: String,

    profilePic: String,

    concerns: [String],

    onboardingCompleted: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // Password reset fields
    resetToken: String,
    resetTokenExpiry: Date
  },
  { timestamps: true }
);

// Hash password before saving
// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

