const express = require("express");
const router = express.Router();
const { getMessage } = require("../controllers/sampleController");

router.get("/test", getMessage);

module.exports = router;
