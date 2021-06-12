const express = require("express");
const router = new express.Router();

const { verifyAccessToken } = require("../configuration/Tokens/webtoken");
const {
  register,
  login,
  fbRegister,
  googleRegister,
  sociallogin,
} = require("../controllers/authController");
const {
  getPlans,
  addRanking,
  editRanking,
  getProfile,
  updateName,
  updatePassword,
  getRanking,
  updateMail,
  ForgotPassword,
  ResetPassword,
  updateProfilepic,
  share,
  uploadGif,
  getRankingById,
  addRankingPublic,
  getMetaTags
} = require("../controllers/userController");

router.get("/", verifyAccessToken, (req, res, next) => {
  console.log(req.headers["authorization"]);
  res.send("routing works");
});

router.post("/register", register);

router.post("/login", login);

router.post("/sociallogin", sociallogin);

router.post("/fbregister", fbRegister);

router.post("/googleregister", googleRegister);

router.get("/getplans", getPlans);

router.post("/addranking", verifyAccessToken, addRanking);

router.post("/editranking", verifyAccessToken, editRanking);

router.get("/getprofile", verifyAccessToken, getProfile);

router.post("/updateprofilepic", verifyAccessToken, updateProfilepic);

router.post("/updateName", verifyAccessToken, updateName);

router.post("/updatePassword", verifyAccessToken, updatePassword);

router.post("/updateMail", verifyAccessToken, updateMail);

router.post("/getranking", verifyAccessToken, getRanking);

router.post("/forgotPassword", ForgotPassword);

router.post("/resetPassword", verifyAccessToken, ResetPassword);

router.get("/share", share);

router.post("/getrankingbyid",getRankingById);

router.post("/uploadgif", uploadGif)

router.post("/addrankingpublic", addRankingPublic);

router.post("/getmetadata", getMetaTags);

module.exports = router;


