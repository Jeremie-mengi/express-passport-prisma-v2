const express = require("express");
const authUser = require("../Midellware/AuthUser");
const router = express.Router();

router.post("/login", authUser);

module.exports = router;
