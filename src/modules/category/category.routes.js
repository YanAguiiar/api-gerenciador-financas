const express = require('express');
const {
  newCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('./category-controller');

const router = express.Router();

router.post('/create', newCategory);

router.get('/get', getCategory);

router.put('/update', updateCategory);

router.delete('/delete/:id', deleteCategory);

module.exports = router;
