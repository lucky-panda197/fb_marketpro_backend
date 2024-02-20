const Group = require("../models/GroupModel");

module.exports.getGroups = async (req, res) => {
  const groups = await Group.find({})
    .sort({ created_at: -1 })
    .populate("vps_ips", "ip");
  if (!groups) {
    return res.status(404).json({
      status: 404,
      message: "No Groups found",
    });
  }
  return res.status(200).json(groups);
};

module.exports.getGroup = async (req, res) => {
  const currentGroup = await Group.findOne({ slug: req.params.slug }).populate(
    "author",
    "name"
  );
  if (!currentGroup) {
    return res.status(404).json({
      message: "Group not found",
    });
  }
  return res.status(200).json(currentGroup);
};

module.exports.createGroup = (req, res) => {
  const newGroup = new Group({
    ...req.body,
  });

  newGroup.save((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(201).json({
      message: "Group created successfully",
    });
  });
};

module.exports.updateGroup = async (req, res) => {
  const currentGroup = await Group.findById(req.params.id);
  if (!currentGroup) {
    return res.status(404).json({
      message: "Group not found",
    });
  }
  await Group.updateOne({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Group updated successfully",
    });
  });
};

module.exports.deleteGroup = async (req, res) => {
  const currentGroup = await Group.findById(req.params.id);
  if (!currentGroup) {
    return res.status(404).json({
      error: "Group not found",
    });
  }
  await currentGroup.remove((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Group deleted successfully",
    });
  });
};
