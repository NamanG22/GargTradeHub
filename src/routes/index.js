const express = require('express');
const router = express.Router();
const webhookRoutes = require('./webhookRoutes');

router.get("/", (req, res) => {
    res.send("Hello World");
});

router.use('/webhook', webhookRoutes);

module.exports = router;
