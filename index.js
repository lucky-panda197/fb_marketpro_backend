const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const cors = require("cors");
const path = require("path");
const Vps = require("./models/VpsModel");
const Ads = require("./models/AdsModel");
const Comment = require("./models/CommentModel");
const { connectToMongoDb } = require("./config/connect");
const ApiRouter = require("./routes");
const cron = require("node-cron");

const app = express();
dotenv.config();
connectToMongoDb();

/* static */
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* define middlewares */
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use(
  session({
    secret: "mern-blogapp-secret", // session secret
    resave: false,
    saveUninitialized: true,
  })
);

/* define routes */
app.use("/api", ApiRouter);

app.use("/", (req, res) => {
  res.send("Hi, welcome to my RESTFUL BlogAPI 😍");
});

cron.schedule(
  "7 6 * * *",
  async () => {
    console.log("Running the database check/update at 6:00 PM Mountain Time");
    await updateAdsStatusForRepost();
    await updateCommentStatusForRepost();
  },
  {
    scheduled: true,
    timezone: "America/Denver", // For Mountain Time
  }
);

async function updateAdsStatusForRepost() {
  console.log("start updating ads");
  try {
    // Find and update all ads where repost is true, set their status to 'PENDING'
    const result = await Ads.updateMany(
      { repost: true },
      { $set: { posted: "PENDING" } }
    );

    if (result.matchedCount === 0) {
      console.log("No ads matching the criteria were found.");
      return;
    }

    console.log("Ads updated successfully:", result);
  } catch (err) {
    console.error("Error updating ads:", err);
  }
}

async function updateCommentStatusForRepost() {
  console.log("start updating comments");
  try {
    const adsWithRepost = await Ads.find({ repost: true }).select("_id");
    const adIds = adsWithRepost.map((ad) => ad._id);

    if (adIds.length === 0) {
      console.log("No Ads with repost=true found");
      return;
    }

    const result = await Comment.updateMany(
      { ads: { $in: adIds } },
      { $set: { status: "NEW" } }
    );

    if (result.matchedCount === 0) {
      console.log("No comments linked to the specified ads were found.");
      return;
    }

    console.log("Comments updated successfully:", result);
  } catch (err) {
    console.error("Error updating comments:", err);
  }
}

setInterval(async () => {
  const now = Date.now();
  const offlineThreshold = 60000; // 60,000 milliseconds = 1 minute

  try {
    const vpss = await Vps.find({});
    vpss.forEach(async (vps) => {
      if (now - vps.last_heartbeat.getTime() > offlineThreshold) {
        vps.vps_status = false;
        await vps.save();
        console.log(`VPS ${vps.ip} is now offline.`);
        console.log(`Checking login status: ${vps.fblogin_status}`);
        console.log(`FB Account Name: ${vps.fbaccount_name}`);
      }
    });
  } catch (error) {
    console.error(error);
  }
}, process.env.FETCH_INTERVAL); // Check every minute

/* start server */
app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
