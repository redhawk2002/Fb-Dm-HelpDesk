const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const subUserSchema = new mongoose.Schema(
  {
    mainUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the main User model
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// **Hash password before saving**
subUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// **Compare Password**
subUserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("SubUser", subUserSchema);
