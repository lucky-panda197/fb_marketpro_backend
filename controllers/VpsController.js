const Vps = require("../models/VpsModel");

module.exports.getVpss = async (req, res) => {
  const vpss = await Vps.find({}).sort({ date: -1 });
  if (!vpss) {
    return res.status(404).json({
      status: 404,
      message: "No Vpss found",
    });
  }
  return res.status(200).json(vpss);
};

module.exports.getVps = async (req, res) => {
  const currentVps = await Vps.findOne({ slug: req.params.slug });
  if (!currentVps) {
    return res.status(404).json({
      message: "Vps not found",
    });
  }
  return res.status(200).json(currentVps);
};

module.exports.createVps = (req, res) => {
  const newVps = new Vps({
    ...req.body,
  });
  newVps.save((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(201).json({
      message: "Vps created successfully",
    });
  });
};

module.exports.updateVps = async (req, res) => {
  const currentVps = await Vps.findById(req.params.id);
  if (!currentVps) {
    return res.status(404).json({
      message: "Vps not found",
    });
  }
  await Vps.updateOne({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Vps updated successfully",
    });
  });
};

// module.exports.updateGroupVps = async (req, res) => {
//   const currentVps = await Vps.findById(req.params.id);
//   if (!currentVps) {
//     return res.status(404).json({
//       message: "Vps not found",
//     });
//   }

//   const updatedVps = await Vps.findOneAndUpdate(
//     { _id: req.params.id },
//     req.body,
//     { new: true } // Returns the updated document
//   );

//   // If no document was found and updated, updatedAd will be null
//   if (!updatedVps) {
//     return res.status(404).json({ message: "Ad not found" });
//   }

//   return res.status(200).json({
//     message: "Vps updated successfully",
//     vps: updatedVps,
//   });
// };

module.exports.deleteVps = async (req, res) => {
  const currentVps = await Vps.findById(req.params.id);
  if (!currentVps) {
    return res.status(404).json({
      error: "Vps not found",
    });
  }
  await currentVps.remove((err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Vps deleted successfully",
    });
  });
};

module.exports.updateVpsStatus = async (req, res) => {
  const { ip, loggedIn } = req.body;
  console.log(ip, loggedIn);
  try {
    let vps = await Vps.findOne({ ip: ip });
    if (vps) {
      vps.last_heartbeat = Date.now();
      vps.vps_status = true;
      vps.fblogin_status = loggedIn;
      await vps.save();

      res.send({ message: "Heartbeat received and status updated" });
    } else res.send({ message: "This Ip is not registered!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// module.exports.updateFBStatus = async (req, res) => {
//   const currentVps = await Vps.findById(req.params.id);
//   if (!currentVps) {
//     return res.status(404).json({
//       message: "Vps not found",
//     });
//   }
//   await Vps.updateOne({ _id: req.params.id }, req.body, (err) => {
//     if (err) {
//       return res.status(500).json({
//         error: err,
//       });
//     }
//     return res.status(200).json({
//       message: "Vps updated successfully",
//     });
//   });
// };
