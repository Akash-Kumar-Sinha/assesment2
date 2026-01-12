const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');
const { redisClient } = require("../redis/client");

async function readData() {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const cachedStats = await redisClient.get("stats");
  let length
  if (cachedStats) {
    length = JSON.parse(cachedStats).length;
  } else {
    await redisClient.set("stats", JSON.stringify({ length: parsed.length }));
    length = parsed.length;
  }
  return {
    data: parsed,
    length: length
  };
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q, page } = req.query;
    let results = data.data;
    let pageNum = parseInt(page) || 1;

    const totalItems = results.length;
    const limitNum = parseInt(limit);

    const totalPages = Math.ceil(totalItems / limitNum);
    if (pageNum > totalPages) {
      pageNum = totalPages;
    }

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    if (limit) {
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      results = results.slice(startIndex, endIndex);
    }

    // setTimeout(() => {
    //   res.json({
    //   items: results,
    //   length: data.length,
    // });
    // }, 5000);

    res.json({
      items: results,
      length: data.length,
      page: pageNum
    });

  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const results = await readData();
    const data = results.data;
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const { data: items } = await readData();
    const newItem = {
      ...item,
      id: Date.now()
    };
    items.push(newItem);

    await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2));

    const stats = {
      total: items.length,
      averagePrice: items.length
        ? items.reduce((acc, cur) => acc + cur.price, 0) / items.length
        : 0
    };
    await redisClient.set("stats", JSON.stringify(stats));
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;