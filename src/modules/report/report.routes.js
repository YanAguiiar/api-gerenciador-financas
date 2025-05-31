const express = require('express');
const { resumeTransactions, resumeIA } = require('./report-controller');
const { getStats } = require('./stats-controller');
const router = express.Router();

router.get('/resume', resumeTransactions);
router.get('/resume-ia', resumeIA);
router.get('/stats', getStats);

module.exports = router;
