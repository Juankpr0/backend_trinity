const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res) => {
  const movements = await db.Movement.findAll({ include: db.Product });
  res.json(movements);
});

router.post('/', async (req, res) => {
  const movement = await db.Movement.create(req.body);
  res.json(movement);
});

module.exports = router;