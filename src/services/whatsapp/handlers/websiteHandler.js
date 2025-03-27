const MessageBuilder = require('../utils/messageBuilder');
const apiClient = require('../utils/apiClient');

class WebsiteHandler {
    async handleWebsiteButton(user_phone, business_phone_number_id) {
        const response = MessageBuilder.buildTextMessage(user_phone, "🚧 Our website is currently under construction! 🏗️\n\nWe're working hard to bring you a seamless B2B marketplace experience for bulk purchases. The website will be launching soon with features tailored for shop owners and wholesale buyers.\n\nIn the meantime, you can continue using our WhatsApp service to buy and sell products! Type 'menu' anytime to see the main options.");
        await apiClient.sendMessage(response, business_phone_number_id);
    }
}

module.exports = new WebsiteHandler();

