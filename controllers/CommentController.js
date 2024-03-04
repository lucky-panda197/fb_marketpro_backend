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

module.exports.createComment = (req, res) => {
  const newComment = new Comment({
    ...req.body,
    author: req.userId,
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

// module.exports.updateGroupComment = async (req, res) => {
//   const currentComment = await Comment.findById(req.params.id);
//   if (!currentComment) {
//     return res.status(404).json({
//       message: "Comment not found",
//     });
//   }

//   const updatedComment = await Comment.findOneAndUpdate(
//     { _id: req.params.id },
//     req.body,
//     { new: true } // Returns the updated document
//   );

//   // If no document was found and updated, updatedAd will be null
//   if (!updatedComment) {
//     return res.status(404).json({ message: "Ad not found" });
//   }

//   return res.status(200).json({
//     message: "Comment updated successfully",
//     Comment: updatedComment,
//   });
// };

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

// module.exports.updateCommentStatus = async (req, res) => {
//   const { ip, loggedIn, fullName } = req.body;
//   console.log(ip, loggedIn, fullName);
//   try {
//     let comment = await Comment.findOne({ ip: ip });
//     if (comment) {
//       comment.last_heartbeat = Date.now();
//       comment.Comment_status = true;
//       comment.fbaccount_name = fullName;
//       comment.fblogin_status = loggedIn;
//       await comment.save();

//       res.send("Heartbeat received and status updated");
//     } else res.send("This Ip is not registered!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// };

// module.exports.updateFBStatus = async (req, res) => {
//   const currentComment = await Comment.findById(req.params.id);
//   if (!currentComment) {
//     return res.status(404).json({
//       message: "Comment not found",
//     });
//   }
//   await Comment.updateOne({ _id: req.params.id }, req.body, (err) => {
//     if (err) {
//       return res.status(500).json({
//         error: err,
//       });
//     }
//     return res.status(200).json({
//       message: "Comment updated successfully",
//     });
//   });
// };
