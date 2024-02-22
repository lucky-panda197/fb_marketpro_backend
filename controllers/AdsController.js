const fs = require("fs").promises; // For using async/await
const Ads = require("../models/AdsModel");

module.exports.getAdss = async (req, res) => {
  const adss = await Ads.find({})
    .sort({ date: -1 })
    .populate("assigned_group", "name");
  if (!adss) {
    return res.status(404).json({
      status: 404,
      message: "No Adss found",
    });
  }
  return res.status(200).json(adss);
};

module.exports.getAds = async (req, res) => {
  const currentAds = await Ads.findOne({ slug: req.params.slug });
  if (!currentAds) {
    return res.status(404).json({
      message: "Ads not found",
    });
  }
  return res.status(200).json(currentAds);
};

module.exports.createAds = (req, res) => {
  // console.log(req.body);
  // if (req.files) {
  console.log(req.body.title);
  console.log(req.files);
  // }
  let images = [];
  if (req.files) {
    images = req.files.map((file) => file.path);
  }
  const newAds = new Ads({
    ...req.body,
    images,
  });

  newAds.save((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(201).json({
      message: "Ads created successfully",
    });
  });
};

module.exports.updateAds = async (req, res) => {
  const currentAds = await Ads.findById(req.params.id);
  if (!currentAds) {
    return res.status(404).json({
      message: "Ads not found",
    });
  }
  console.log(req.files);

  if (currentAds.images) {
    try {
      currentAds.images.map(async (path) => {
        await fs.unlink(path);
        console.log("Deleted old profile image:", path);
      });
    } catch (err) {
      console.error("Error deleting old profile image:", err);
      // Decide how to handle the error; maybe continue or abort the operation
    }
  }

  const images = req.files.map((file) => file.path);
  req.body.images = images;
  await Ads.updateOne({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Ads updated successfully",
    });
  });
};

module.exports.deleteAds = async (req, res) => {
  const currentAds = await Ads.findById(req.params.id);
  if (!currentAds) {
    return res.status(404).json({
      error: "Ads not found",
    });
  }
  await currentAds.remove((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Ads deleted successfully",
    });
  });
};
