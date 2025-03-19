const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    subUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubUser" }],
    facebookUserId: String,
    facebookAccessToken: String,
    tokenExpiryDate: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
// In the User.js file, we have defined a userSchema with the required fields: name, email, and password. We have also defined the facebookUserId, facebookAccessToken, and tokenExpiryDate fields, which are used for Facebook authentication. We have also added timestamps to the schema to automatically create createdAt and updatedAt fields.
