const Comment = require("../models/CommentModel");

module.exports.getComments = async (req, res) => {
  const comments = await Comment.find({}).sort({ date: -1 });
  if (!comments) {
    return res.status(404).json({
      status: 404,
      message: "No Comments found",
    });
  }
  return res.status(200).json(comments);
};

module.exports.getComment = async (req, res) => {
  const currentComment = await Comment.findOne({ slug: req.params.slug });
  if (!currentComment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }
  return res.status(200).json(currentComment);
};

module.exports.findComment = async (req, res) => {
  const { ip } = req.body;
  const comments = await Comment.find({})
    .populate({ path: "ads", populate: { path: "post_vps", model: "Vps" } })
    .populate("vps", "ip");
  if (!comments) {
    return res.status(404).json({
      status: 404,
      message: "No Comments found",
    });
  }
  const filteredComment = comments.filter(
    (comment) =>
      comment?.status !== "SUCCESS" &&
      comment?.vps?.ip === ip &&
      comment?.ads?.posted === "SUCCESS"
  );
  if (filteredComment.length > 0) {
    console.log("filteredComment", filteredComment[0]);
    return res.status(200).json(filteredComment[0]);
  } else return res.status(404).json({ message: "No Comment found" });
};

module.exports.createComment = (req, res) => {
  const newComment = new Comment({
    ...req.body,
  });
  newComment.save((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(201).json({
      message: "Comment created successfully",
    });
  });
};

module.exports.updateComment = async (req, res) => {
  const currentComment = await Comment.findById(req.params.id);
  if (!currentComment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }
  await Comment.updateOne({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Comment updated successfully",
    });
  });
};

module.exports.updateCommentStatus = async (req, res) => {
  var currentComment = await Comment.findById(req.params.id);
  if (!currentComment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  currentComment.status = req.body.status === true ? "SUCCESS" : "FAILED";

  await Comment.updateOne({ _id: req.params.id }, currentComment, (err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Comment updated successfully",
    });
  });
};

module.exports.deleteComment = async (req, res) => {
  const currentComment = await Comment.findById(req.params.id);
  if (!currentComment) {
    return res.status(404).json({
      error: "Comment not found",
    });
  }
  await currentComment.remove((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  });
};
