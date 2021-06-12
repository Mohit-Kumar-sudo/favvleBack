const mongoose = require("mongoose");

const textSchema = mongoose.Schema({
    page: {
    type: String,
    required: true,
    },
    text1: {
        type: String,
    },
    text2: {
        type: String,
    },
    text3: {
        type: String,
    },
    text4: {
        type: String,
    },
    text5: {
        type: String,
    },
    list:{
        type:Array,
    }
});

module.exports = mongoose.model("Texts", textSchema);