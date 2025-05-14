const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

studentSchema.methods.getJWT = async function () {
  try {
    const student = this;
    const token = await jwt.sign({ _id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

studentSchema.methods.validatePassword = async function (passwordInputByUser) {
  try {
    const student = this;
    const hashPassword = student.password;
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      hashPassword
    );
    return isPasswordValid;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = mongoose.model("Student", studentSchema);
