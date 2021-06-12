const userModel = require("../models/userModel");
const planModel = require("../models/planModel");
const textModel = require("../models/textModel");
const rankingModel = require("../models/rankingModel");
const homeModel = require("../models/homeModel");
const { signAccessToken } = require("../configuration/Tokens/webtoken");
const createError = require("http-errors");
const { use } = require("passport");

module.exports = {

  getUsers: async (req, res, next) => {
    const users = await userModel.find(
      {},
      {
        name: 1,
        email: 1,
        plan_id: 1,
        ip: 1,
        country: 1,
        created_at: 1,
        type: 1,
      }
    );
    return res.send(users);
  },

  getTexts: async (req, res, next) => {
    
    let page = req.query.page;
    console.log("page",page)
    const texts = await textModel.find({ page });
    console.log("texts",texts)
    return res.send({
      status: 1,
      texts:texts[0],
    });
  },

  setTexts: async (req, res, next) => {
    let { page, text1, text2, text3, text4, text5, list } = req.body;
    try {
      await textModel.update(
        { page },
        { text1, text2, text3, text4, text5, list },
        { upsert: true }
      );
      let texts = {
        status: 1,
        message: "updated succesfully",
      };
      return res.send(texts);
    } catch (e) {
      return res.status(500);
    }
  },

  editPlans: async (req, res, next) => {
    const { plan_id, name, item_limit, rank_limit } = req.body;
    await planModel.update(
      { plan_id },
      {
        name,
        item_limit,
        rank_limit,
      },
      {
        upsert: true
      }
    );

    return res.send({
      status: 1,
      message: "updated successfully",
    });
  },

  getPlan: async (req, res, next) => {
    const { plan_id } = req.body;
    let plan = await planModel.find({ plan_id });
    return res.send(plan);
  },

  getUsersByDate: async (req, res, next) => {
    let { start_date, end_date } = req.body;
    let start = start_date.split("/");
    let end = end_date.split("/");
    const users = await userModel.find({
      created_at: {
        $gte: new Date(start[2], start[0], start[1]),
        $lte: new Date(end[2], end[0], end[1]),
      },
    });
    return res.send(users);
  },

  getRankingByCategory: async (req, res, next) => {
    let category = req.body.category;
    let ranks;
    if(category)
     ranks = await rankingModel.find({ category });
    else 
     ranks = await rankingModel.find()
    let count=0;
    let total=0;
    ranks.map(item=>{
      count++;
      total= total+item.ranking.length;
    })
    let avg=total/count;
    return res.send({
      status: 1,
      average_length:avg,
      ranks,
    });
  },
  getRankingByUser: async (req, res, next) => {
    let user_id = req.body.user_id;
    let ranks;
     ranks = await rankingModel.find({ user_id });
    return res.send({
      status: 1,
      ranks,
    });
  },
  changeuserplan:async (req, res, next) => {
    try {
      let id =req.body.id;
      let plan_id =req.body.plan_id;
      const user = await userModel.update({ _id:id },{plan_id});
      if(user)
      return res.send({
        status: 1,
        message: "successful",
      });
      return res.send({
        status: 0,
        message: "unsuccessful",
      });
    } catch (error) {
      if (error.isjoi == true) {
        error.status = 422;
      }
      next(error);
    }
  },
  getHome: async (req, res, next) => {
    let home = await homeModel.findOne({home_id:0});
    return res.send(home);
  },
  updateHome: async (req, res, next) => {
    const { home } = req.body;
    await homeModel.update(
      { home_id:0 },
      {
        home,
      },
      {
        upsert: true
      }
    );

    return res.send({
      status: 1,
      message: "updated successfully",
    });
  },
};
