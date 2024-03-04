const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/VerifyToken");

/* define controller */
const VpsController = require("../controllers/VpsController");

/* define routes */
router
  .get("/", VpsController.getVpss)
  .get("/:slug", VpsController.getVps)
  .post("/create", verifyToken, VpsController.createVps)
  .post("/update-vps-status", VpsController.updateVpsStatus)
  .put("/:id", verifyToken, VpsController.updateVps)
  .delete("/:id", verifyToken, VpsController.deleteVps);

module.exports = router;
