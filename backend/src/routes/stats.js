const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');
const { redisClient } = require("../redis/client");

// GET /api/stats
router.get("/", async (req, res, next) => {
  try {
    const cachedStats = await redisClient.get("stats");

    if (cachedStats) {
      console.log("Fetched stats from Redis cache");
      return res.json(JSON.parse(cachedStats));
    }

    // Read file (non-blocking)
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const items = JSON.parse(raw);

    // Heavy CPU calculation
    const stats = {
      total: items.length,
      averagePrice:
        items.reduce((acc, cur) => acc + cur.price, 0) / items.length
    };

    redisClient.set("stats", JSON.stringify(stats)).catch(console.error);

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;