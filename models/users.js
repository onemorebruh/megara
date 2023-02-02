const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
    username: {
        type :String,
        required: true,
    },
    email: {
        type :String,
        unique: true,
    },
    password: {
        type :String,
        required: true,
    },
    documents: [mongoose.Types.ObjectId],
},
{ versionKey: false })

module.exports = mongoose.model("User", userScheme)
