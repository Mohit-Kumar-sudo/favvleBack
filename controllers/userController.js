const userModel = require("../models/userModel");
const planModel = require("../models/planModel");
const rankingModel = require("../models/rankingModel");
const ejs = require("ejs");
var multer = require("multer");
var path = require("path");

const { signAccessToken } = require("../configuration/Tokens/webtoken");
const createError = require("http-errors");
const { v4: uuidv4 } = require('uuid');
const { hash } = require("bcryptjs");

module.exports = {
  getPlans: async (req, res, next) => {
    try {
      const plans = await planModel.find();
      return res.send(plans);
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  addRanking: async (req, res, next) => {
    try {
      const userId = res.locals.userId;
      const {
        name,
        ranking,
        category,
        backgroundcolor,
        textcolor,
        nametoggle,
        ranktoggle,
        columns,
        texttoggle,
      } = req.body;
      console.log(category,ranking)
      const rank = await rankingModel.create({
        name,
        ranking,
        category,
        backgroundcolor,
        textcolor,
        nametoggle,
        ranktoggle,
        columns,
        texttoggle,
        user_id: userId,
      });

      return res.send({
        status: 1,
        rank,
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  editRanking: async (req, res, next) => {
    try {
      const userId = res.locals.userId;
      const {
        name,
        ranking,
        category,
        backgroundcolor,
        textcolor,
        nametoggle,
        ranktoggle,
        columns,
        texttoggle,
        _id,
      } = req.body;
      const rank = await rankingModel.update(
        { _id },
        {
          name,
          ranking,
          category,
          backgroundcolor,
          textcolor,
          nametoggle,
          ranktoggle,
          columns,
          texttoggle,
          user_id: userId,
        }
      );
      return res.send({
        status: 1,
        rank,
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const _id = res.locals.userId;
      const data = await userModel.findOne(
        { _id },
        {
          name: 1,
          dob: 1,
          gender: 1,
          created_at: 1,
          type: 1,
          profile_img: 1,
          _id: 0,
        }
      );
      return res.send({ profile: data });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  updateName: async (req, res, next) => {
    try {
      const { name } = req.body;
      const _id = res.locals.userId;
      console.log(_id);
      await userModel.update({ _id }, { name });
      return res.send({
        status: 1,
        name,
        message: "updated name successfully",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  updateMail: async (req, res, next) => {
    try {
      const { old_mail, new_mail } = req.body;
      const _id = res.locals.userId;
      console.log(old_mail, new_mail);
      userModel.findOne({ _id }, async function (err, user) {
        if (user.email === old_mail) {
          await userModel.update({ _id }, { email: new_mail });
          return res.send({
            status: 1,
            message: "updated mail successfully",
          });
        } else {
          return res.send({
            status: 0,
            message: "Mail did not match",
          });
        }
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  updateProfilepic: async (req, res, next) => {
    const _id = res.locals.userId;

    try {
      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, __dirname + "/../static");
        },
        filename: function (req, file, cb) {
          let filename = _id + path.extname(file.originalname);
          req.filename = filename;
          cb(null, filename);
        },
      });

      var upload = multer({ storage: storage }).single("profilepic");

      await upload(req, res, async function (err) {
        if (err) {
          return res.status(500).send({
            message: "error during file upload",
          });
        }
        await userModel.update({ _id }, { profile_img: req.filename });
        return res.send({
          status: 1,
          message: "updated profile successfully",
        });
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  ForgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw createError.BadRequest();
      }
      await userModel.findOne({ email }, function (err, user) {
        if (err) throw err;
        if (!user) {
          return next(createError.NotFound("user not found"));
        } else {
          const accessToken = signAccessToken(user._id);
          accessToken
            .then((data) => {
              res.json({
                status: 1,
                accessToken: data,
                message: "User Email Matched",
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
        return next(createError.BadRequest("Invalid Email"));
      }
    }
  },

  ResetPassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).send();
      }
      const _id = res.locals.userId;
      userModel.findOne({ _id }, function (err, user) {
        console.log(_id);
        if (err) throw err;
        if (!_id) {
          return next(createError.NotFound("Password cannot Change"));
        }
        user.hashPassword(password, async (hash) => {
          await userModel.update({ _id }, { password: hash });
          return res.send({
            status: 1,
            message: "Password Reset Successfully",
            password: hash,
          });
        });
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      console.log(error);
      next(error);
    }
  },

  updatePassword: async (req, res, next) => {
    try {
      const { old_password, new_password } = req.body;
      if (!old_password || !new_password) {
        return res.status(400).send();
      }
      //get id from middleware
      const _id = res.locals.userId;
      //find user in mongo
      userModel.findOne({ _id }, function (err, user) {
        if (err) throw err;
        //chechk password
        user.isValidPassword(old_password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return next(createError.Unauthorized("Invalid password"));
          } else {
            //hash password
            user.hashPassword(new_password, async (hash) => {
              //update mongo after generating hash
              await userModel.update({ _id }, { password: hash });
              return res.send({
                status: 1,
                message: "updated password successfully",
                password: hash,
              });
            });
          }
        });
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      console.log(error);
      next(error);
    }
  },
  getRanking: async (req, res, next) => {
    try {
      const user_id = res.locals.userId;
      const ranks = await rankingModel.find({ user_id });
      const user = await userModel.findOne({ _id: user_id });
      console.log(user);
      return res.send({
        status: 1,
        ranks,
        profile: user.profile_img,
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },
  share: async (req, res, next) => {
    try {
      console.log(req.query)
      const { ogimg, title } = req.query;
      let redirecturl = process.env.FRONTEND_URL+"Share";
      let ogimageurl =  process.env.BASE_URL+"Gif/" + ogimg+".gif";
      console.log(ogimageurl)
      let str = `
      <!DOCTYPE HTML>
        <html lang="en-US">
            <head>
                <meta property="og:title" content="<%= title %>" />
                <meta property="og:description" content="<%= description %>" />
                <meta property="og:image" content="<%= ogimageurl %>" />
                <meta charset="UTF-8">
                <script type="text/javascript">
                    window.location.href = "<%= redirecturl %>"
                </script>
            </head>
            <body>
                If you are not redirected automatically, <a href="<%= redirecturl %>">click here</a>.
            </body>
        </html>
      `;
      let html =ejs.render(str, { ogimageurl, description:"this is a text", title, redirecturl });
      res.end(html)
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  uploadGif: async (req, res, next) => {
    try {
      let inputgif =req.body.gif
      var base64Data = inputgif.replace(/^data:image\/gif;base64,/, "");
      let filename=req.body.gifname

      require("fs").writeFile("static/Gif/"+filename+".gif", base64Data, 'base64', function(err) {
      console.log(err);
      });
      return res.send({
        status: 1,
        filename,
        message: "Generate Gif successfully",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },

  getRankingById: async (req, res, next) => {
    try {
      let id =req.body.id;
      const rank = await rankingModel.find({ _id:id });
      return res.send({
        status: 1,
        rank,
        message: "successfull",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },
  addRankingPublic: async (req, res, next) => {
    try {
      const {
        name,
        ranking,
        category,
        backgroundcolor,
        textcolor,
        nametoggle,
        ranktoggle,
        columns,
        texttoggle,
      } = req.body;
      const rank = await rankingModel.create({
        name,
        ranking,
        category,
        backgroundcolor,
        textcolor,
        nametoggle,
        ranktoggle,
        columns,
        texttoggle,
        user_id: "public",
      });
      return res.send({
        status: 1,
        rank,
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },
  getMetaTags: async (req, res, next) => {
    try {
      let id =req.body.id;
      const rank = await rankingModel.find({ _id:id });
      if(rank)
      return res.send({
        status: 1,
        title:rank.name,
        description:"shared via Favvle!",
        ogimg:process.env.BASE_URL+"Gif/"+id+".gif",
        message: "successfull",
      });
      return res.send({
        status: 0,
        message: "unsuccessfull",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },
 

};
