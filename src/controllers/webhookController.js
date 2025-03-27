const whatsappService = require('../services/whatsapp/index');

exports.handleIncomingWebhook = async (req, res) => {
    try {
        const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
        const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

        if (message?.type === "text") {
            const messageText = message.text.body.trim().toLowerCase();

            if (messageText.startsWith("share")) {
                await whatsappService.handleShareMessage(message, business_phone_number_id);
            } else if (messageText.startsWith("help")){
                await whatsappService.handleHelpMessage(message, business_phone_number_id);
            } else {
                await whatsappService.sendMainMenu(message, business_phone_number_id);
            }
        } else if (message?.type === "interactive" && message?.interactive?.type === "button_reply") {
            await whatsappService.handleButtonInteraction(message, business_phone_number_id);
        }
        
        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.verifyWebhook = (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    } else {
        res.sendStatus(403);
    }
};

