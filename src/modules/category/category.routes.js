const express = require('express');
const { newCategory } = require('./category-controller');

const router = express.Router();

router.post('/create', newCategory);

module.exports = router;
