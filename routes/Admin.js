const express = require("express");
const router = new express.Router();
const { verifyAccessToken } = require("../configuration/Tokens/webtoken");
const { getUsers ,getTexts,setTexts,getUsersByDate,getRankingByCategory,editPlans,getPlan,getRankingByUser,changeuserplan,getHome,updateHome} = require("../controllers/adminController");


router.post("/getusers", getUsers);

router.post("/getPlan", getPlan);

router.get("/gettexts", getTexts);

router.post("/settexts", setTexts);

router.post("/getusersbydate",getUsersByDate);

router.post("/getrankingbycategory",getRankingByCategory);

router.post("/getrankingbyuser",getRankingByUser);

router.post("/changeuserplan",changeuserplan);

router.post("/editplans",editPlans)

router.post("/updatehome",updateHome)

router.get("/gethome",getHome)

module.exports = router;
