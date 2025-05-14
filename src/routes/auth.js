const express = require("express");
const Student = require("../models/student");
const createEmailIdentity = require("../utils/createEmailIdentity");
const checkEmailVerificationStatus = require("../utils/checkEmailVerificationStatus");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/student-signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    const savedstudent = await student.save();
    const createIdentityRes = await createEmailIdentity.run(email);
    console.log(createIdentityRes);
    // const token = await savedstudent.getJWT();
    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 2 * 3600000),
    // });
    res.json({ message: "Please verify your Email Address" });
  } catch (error) {
    // console.log(error)
    res.status(400).send(error.message);
  }
});

authRouter.post("/student-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email: email });
    if (!student) {
      throw new Error("Invalid Crendentials");
    }

    const isPasswordValid = await student.validatePassword(password);
    if (isPasswordValid) {
      const status = await checkEmailVerificationStatus.run(email);
      if (status === "Success") {
        const token = await student.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 2 * 3600000),
        });
        res.send(student);
      } else if (status === "Pending") {
        res.json({ message: "Please verify your email address." });
      } else if (status === "Failed") {
        res.json({ message: "Your Email Verification failed." });
      }
    } else {
      throw new Error("Invalid Crendentials");
    }
  } catch (error) {
    // console.log(error)
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
