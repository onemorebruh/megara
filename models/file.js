const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileScheme = new Schema({
  filename: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  blob: {
        data: Buffer,
        contentType: String
  },
  text: String
},
{ versionKey: false})

module.exports = mongoose.model("File", fileScheme)

