const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  ads: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ads",
  },
  comment: String,
  vps: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vps",
  },
  status: {
    type: String,
    enum: ["NEW", "SUCCESS", "FAILED"],
    default: "NEW",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
