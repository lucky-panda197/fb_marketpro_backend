const fs = require("fs").promises; // For using async/await
const Ads = require("../models/AdsModel");
const Vps = require("../models/VpsModel");

module.exports.getAdss = async (req, res) => {
  const adss = await Ads.find({})
    .sort({ date: -1 })
    .populate({
      path: "assigned_group",
      populate: { path: "vps_ips", model: "Vps" },
    });
  if (!adss) {
    return res.status(404).json({
      status: 404,
      message: "No Adss found",
    });
  }
  return res.status(200).json(adss);
};

module.exports.findAds = async (req, res) => {
  const { ip } = req.body;
  const adss = await Ads.find({}).populate("post_vps", "ip");
  if (!adss) {
    return res.status(404).json({
      status: 404,
      message: "No Adss found",
    });
  }
  const filteredAds = adss.filter(
    (ads) => ads?.post_vps?.ip === ip && ads?.posted === "PENDING"
  );
  if (filteredAds.length > 0) {
    console.log("filteredAds", filteredAds[0]);
    return res.status(200).json(filteredAds[0]);
  } else return res.status(404).json({ message: "No Ads found" });
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
  console.log(req.body);
  // console.log(JSON.parse(req.body.comments));
  console.log(req.files);
  let images = [];
  if (req.files) {
    images = req.files.map((file) => file.path);
  }
  // if (req.body.comments) req.body.comments = JSON.parse(req.body.comments);

  const newAds = new Ads({
    ...req.body,
    images,
  });

  newAds.save((err, newAd) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(201).json({
      message: "Ads created successfully",
      ad: newAd,
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
  try {
    // Use findOneAndUpdate with the { new: true } option to get the updated document
    const updatedAd = await Ads.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // Returns the updated document
    );

    // If no document was found and updated, updatedAd will be null
    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // Successfully updated, send back the updated document
    return res.status(200).json({
      message: "Ads updated successfully",
      ad: updatedAd, // Send the updated document back to the client
    });
  } catch (err) {
    console.error("Error updating the ad:", err);
    return res.status(500).json({ error: err });
  }
};

module.exports.postAds = async (req, res) => {
  var currentAds = await Ads.findById(req.params.id);
  if (!currentAds) {
    return res.status(404).json({
      message: "Ads not found",
    });
  }

  currentAds.posted = req.body.posted;
  currentAds.post_vps = req.body.postVps;
  // currentAds.comments = req.body.comments;
  await Ads.updateOne({ _id: req.params.id }, currentAds, (err) => {
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
