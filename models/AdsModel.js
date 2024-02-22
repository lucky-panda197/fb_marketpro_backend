const mongoose = require("mongoose");

const AdsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: [
    {
      type: String,
    },
  ],
  assigned_group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  post_id: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ads", AdsSchema);
