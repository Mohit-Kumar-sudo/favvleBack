const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cors = require("cors");
require("dotenv").config();
require("./configuration/mongoose");
const User = require("./routes/User");
const Admin = require("./routes/Admin");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true })); //to handle the form data entered by the user
app.use("/", express.static(__dirname + "/static"));

app.use("/users", User);
app.use("/admin", Admin);

app.use(async (req, res, next) => {
  next(createError.NotFound("the route doesn't exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.port || 4000;

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
