const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/",authRouter)

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(process.env.PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
