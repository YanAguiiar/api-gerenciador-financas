const express = require('express');
const { resumeTransactions } = require('./report-controller');
const router = express.Router();

router.get('/resume', resumeTransactions);

module.exports = router;
