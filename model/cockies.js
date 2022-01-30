const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cockiesScheme = new Schema({
    user: {
        type :mongoose.ObjectId,
        required: true,
    },
    coockie: {
        type :String,
        required: true,
    },
},
{ versionKey: false })

module.exports = mongoose.model("cockies", cockiesScheme)