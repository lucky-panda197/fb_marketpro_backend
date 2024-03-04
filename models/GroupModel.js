const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  vps_ips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vps",
    },
  ],
  ads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ads",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", GroupSchema);
