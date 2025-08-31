const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");

const URL = require("../models/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);


// delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await URL.deleteOne({ shortId: id });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
