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
  post_vps: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vps",
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
  posted: {
    type: String,
    enum: ["NEW", "PENDING", "FAILED", "SUCCESS"],
    default: "NEW",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ads", AdsSchema);
