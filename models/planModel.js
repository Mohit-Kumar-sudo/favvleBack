const mongoose = require("mongoose");

const planSchema = mongoose.Schema({
  plan_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  item_limit: {
    type: Number,
    required: true,
  },
  rank_limit: {
    type: Number,
    required: true,
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

module.exports = mongoose.model("Plan", planSchema);
