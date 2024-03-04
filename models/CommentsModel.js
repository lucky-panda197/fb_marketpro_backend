const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  ads: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ads",
  },
  comments: [
    {
      comment: String,
      vps: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vps",
      },
      status: String,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", CommentsSchema);
