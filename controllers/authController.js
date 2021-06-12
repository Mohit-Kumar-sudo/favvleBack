const userModel = require("../models/userModel");
const planModel = require("../models/planModel");

const { signAccessToken } = require("../configuration/Tokens/webtoken");
const createError = require("http-errors");
const { use } = require("passport");

module.exports = {
  register: async (req, res, next) => {
    let type = "website";
    try {
      console.log(req.body);
      const { email, password,ip,country } = req.body;
      if (!email || !password) {
        throw createError.BadRequest();
      }
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        throw createError.Conflict(`${email} is already registerd`);
      }

      const newUser = new userModel({ email, password, type,ip,country });
      const savedUser = await newUser.save();
      if (!savedUser) {
        throw createError.createError("cannot Register user");
      }
      const accessToken = await signAccessToken(savedUser.id);

      res.json({
        status: 1,
        accessToken,
        message: "successfully registered",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      console.log(error);
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw createError.BadRequest();
      }
      await userModel.findOne({ email }, function (err, user) {
        if (err) throw err;
        if (!user) {
          return next(createError.NotFound("user not found"));
        }
        user.isValidPassword(password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return next(createError.Unauthorized("Invalid username/password"));
          } else {
            const accessToken = signAccessToken(user.id);
            accessToken
              .then((data) => {
                res.json({
                  status: 1,
                  accessToken: data,
                  message: "successfully loggedin",
                });
              })
              .catch((err) => {
                return next(
                  createError.InternalServerError("Something went wrong")
                );
              });
          }
        });
      });
    } catch (error) {
      if (error.isjoi === true) {
        return next(createError.BadRequest("Invalid username/password"));
      }
      next(error);
    }
  },

  sociallogin: async (req, res, next) => {
    try {
      const { social_id } = req.body;
      if (!social_id) {
        throw createError.BadRequest();
      }
      await userModel.findOne({ social_id }, function (err, user) {
        if (err) throw err;
        if (!user) {
          return next(createError.NotFound("user not found"));
        } else {
          const accessToken = signAccessToken(user.id);
          accessToken
            .then((data) => {
              res.json({
                status: 1,
                accessToken: data,
                message: "successfully loggedIn",
              });
            })
            .catch((err) => {
              return next(
                createError.InternalServerError("Something went wrong")
              );
            });
        }
      });
    } catch (error) {
      if (error.isjoi === true) {
        return next(createError.BadRequest(""));
      }
      next(error);
    }
  },

  googleRegister: async (req, res, next) => {
    try {
      const { email, social_id, name,ip,country } = req.body;
      let type = "google";
      if (!email || !social_id || !name) {
        throw createError.BadRequest();
      }
      const emailExist = await userModel.findOne({ social_id });
      if (emailExist) {
        throw createError.Conflict(`${email} is already registerd`);
      }

      const newUser = new userModel({ email, social_id, name,ip,country,type });
      const savedUser = await newUser.save();
      if (!savedUser) {
        throw createError.createError("cannot Register user");
      }

      const accessToken = await signAccessToken(savedUser.id);

      res.json({
        status: 1,
        accessToken,
        message: "successfully registered",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      console.log(error);
      next(error);
    }
  },

  fbRegister: async (req, res, next) => {
    try {
      const { social_id, name,ip,country } = req.body;
      let type = "facebook";
      if (!social_id || !name) {
        throw createError.BadRequest();
      }
      const emailExist = await userModel.findOne({ social_id });
      if (emailExist) {
        throw createError.Conflict(`${email} is already registerd`);
      }

      const newUser = new userModel({ social_id, name, type,ip,country });
      const savedUser = await newUser.save();
      if (!savedUser) {
        throw createError.createError("cannot Register user");
      }

      const accessToken = await signAccessToken(savedUser.id);

      res.json({
        status: 1,
        accessToken,
        message: "successfully registered",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },
};
