const mongoose = require("mongoose");

const VpsSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  vps_status: {
    type: Boolean,
    default: false,
    required: true,
    trim: true,
  },
  fblogin_status: {
    type: Boolean,
    default: false,
    required: true,
    trim: true,
  },
  fbaccount_name: String,
  group_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  last_heartbeat: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vps", VpsSchema);
