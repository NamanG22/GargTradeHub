const axios = require('axios');
const { GRAPH_API_TOKEN } = require('../../../config');

class WhatsAppApiClient {
    async sendMessage(response, business_phone_number_id) {
        try {
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                },
                data: response
            });
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }

    async readMessage(message_id, business_phone_number_id) {
        try {
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                },
                data: {
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: message_id,
                }
            });
        } catch (error) {
            console.error('Error reading WhatsApp message:', error);
            throw error;
        }
    }
}

module.exports = new WhatsAppApiClient();