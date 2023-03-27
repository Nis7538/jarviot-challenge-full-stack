const express = require("express");
const {
    generateURL,
    authenticateUser,
    revokeAccess,
    getUserDetails,
} = require("../controllers/controller");
const protect = require("../middleware/userAuth");

const router = express.Router();

router.route("/").get(generateURL);
router.route("/google/callback").get(authenticateUser);
router.route("/revokeAccess").delete(protect, revokeAccess);
router.route("/getUserDetails").get(protect, getUserDetails);

module.exports = router;
