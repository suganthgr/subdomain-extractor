const express = require("express");
const router = express.Router();

const fetchController = require("../controllers/fetching.js");

router.post("/", fetchController.getData);

module.exports = router;
