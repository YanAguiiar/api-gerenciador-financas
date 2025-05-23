const express = require('express');
const {
  newTransaction,
  getTransaction,
  updateTransctions,
  deleteTransactions,
} = require('./transaction-controller');
const router = express.Router();

router.post('/create', newTransaction);

router.get('/', getTransaction);

router.put('/update', updateTransctions);

router.delete('/delete', deleteTransactions);

module.exports = router;
