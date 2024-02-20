const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const cors = require("cors");
//const ejs = require('ejs');
const Vps = require("./models/VpsModel");
const { connectToMongoDb } = require("./config/connect");
//const PageRouter = require('./routes/PageRouter');
const ApiRouter = require("./routes");

/* define consts */
const app = express();
dotenv.config();

/* globals */
//global.userIN = null;

/* template Engine*/
//app.set('view engine', 'ejs');

/* connect to database */
connectToMongoDb();

/* static */
app.use(express.static("public"));

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

/*
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
});
*/

/* define routes */
app.use("/api", ApiRouter);

app.use("/", (req, res) => {
  res.send("Hi, welcome to my RESTFUL BlogAPI 😍");
});

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
      }
    });
  } catch (error) {
    console.error(error);
  }
}, 60000); // Check every minute

/* start server */
app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
