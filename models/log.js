const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logScheme = new Schema({
    username: {
        type :String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
},
{ versionKey: false })

module.exports = mongoose.model("Log", logScheme)