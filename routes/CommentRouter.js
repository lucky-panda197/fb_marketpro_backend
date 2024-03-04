const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/VerifyToken");

/* define controller */
const CommentController = require("../controllers/CommentController");

/* define routes */
router
  .get("/", CommentController.getComments)
  .get("/:slug", CommentController.getComment)
  .post("/create", verifyToken, CommentController.createComment)
  .post("/update-comment-status", CommentController.updateCommentStatus)
  .put("/:id", verifyToken, CommentController.updateComment)
  .delete("/:id", verifyToken, CommentController.deleteComment);

module.exports = router;
