const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const verifyToken = require("../middlewares/VerifyToken");
const AdsController = require("../controllers/AdsController");

/* define controller */

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Initialize upload middleware with storage engine
const upload = multer({
  storage: storage,
  // limits: { fileSize: 1000000 },
  // fileFilter: function (req, file, cb) {
  //   checkFileType(file, cb);
  // },
});

// Function to check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

/* define routes */
router
  .get("/", AdsController.getAdss)
  .get("/:slug", AdsController.getAds)
  .post(
    "/create",
    verifyToken,
    upload.array("images", 10),
    AdsController.createAds
  )
  .post(
    "/find",
    AdsController.findAds
  )
  .put("/:id", verifyToken, upload.array("images", 10), AdsController.updateAds)
  .put("/:id/post", verifyToken, AdsController.postAds)
  .delete("/:id", verifyToken, AdsController.deleteAds);

module.exports = router;
