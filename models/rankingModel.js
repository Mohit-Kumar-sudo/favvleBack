const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const rankingShema = mongoose.Schema({
  name:{
    type:String,
    require:true,
  },
  ranking: {
    type: Array,
    required: true,
  },
  user_id: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  backgroundcolor: {
    type:String,
  },
  textcolor:{
    type:String,
  },
  nametoggle: {
    type:Boolean,
  },
  ranktoggle:{
    type:Boolean,
  },
  columns:{
    type: Number,
  },
  texttoggle:{
    type:Boolean,
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

const ranking = mongoose.model("Ranking", rankingShema);
module.exports = ranking;
