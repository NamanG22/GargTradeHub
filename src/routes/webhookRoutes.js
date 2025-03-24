const express = require('express');
const router = express.Router();
const { handleIncomingWebhook, verifyWebhook } = require('../controllers/webhookController');

router.post('/', handleIncomingWebhook);
router.get('/', verifyWebhook);

module.exports = router;

