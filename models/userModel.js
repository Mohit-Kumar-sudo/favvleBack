const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userShema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
    default: null,
  },
  social_id: {
    type: String,
    default: null,
  },
  plan_id: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    default: null,
  },
  profile_img: {
    type: String,
    default: null,
  },
  confirmed: {
    type: Boolean,
    default: true,
  },
  ip:{
    type:String,
    default: null,
  },
  country:{
    type:String,
    default: null,
  },
  created_at: {
    type: String,
    default: new Date(),
  },
  updated_at: {
    type: String,
    default: new Date(),
  },
});

userShema.pre("save", async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();

    // console.log(hashedPassword);
  } catch (error) {
    next(error);
  }
});

userShema.methods.isValidPassword = async function (password, callback) {
  await bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userShema.methods.hashPassword = async function (password, callback) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  callback(hashedPassword);
};

const users = mongoose.model("User", userShema);
module.exports = users;
