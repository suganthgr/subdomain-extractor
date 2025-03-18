const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainpage.js");

router.get("/", mainController.getIndex);

module.exports = router;
