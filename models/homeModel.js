const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  home: {
    type: Boolean,
    default:true
  },
  home_id: {
    type: Number,
    default:0
  },
});

module.exports = mongoose.model("Home", homeSchema);