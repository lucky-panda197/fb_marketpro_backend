const express = require("express");
const router = express.Router();
const authRouter = require("./AuthRouter");
const vpsRouter = require("./VpsRouter");
const groupRouter = require("./GroupRouter");
const adsRouter = require("./AdsRouter");
const postRouter = require("./PostRouter");
const pageRouter = require("./PageRouter");
const commentRouter = require("./CommentRouter");

router.use("/auth", authRouter);
router.use("/vps", vpsRouter);
router.use("/groups", groupRouter);
router.use("/advertise", adsRouter);
router.use("/posts", postRouter);
router.use("/pages", pageRouter);
router.use("/comments", commentRouter);

module.exports = router;
