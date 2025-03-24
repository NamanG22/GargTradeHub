const express = require('express');
const router = express.Router();
const { handleIncomingWebhook, verifyWebhook } = require('../controllers/webhookController');

router.post('/webhook', handleIncomingWebhook);
router.get('/webhook', verifyWebhook);

module.exports = router;

