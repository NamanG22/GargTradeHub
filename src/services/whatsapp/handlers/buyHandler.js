const MessageBuilder = require('../utils/messageBuilder');
const apiClient = require('../utils/apiClient');

class BuyHandler {
    async handleBuyButton(user_phone, business_phone_number_id) {
        const response = MessageBuilder.buildTextMessage(user_phone, "🛍️ Welcome to GargTradeHub Buying Portal!\n\nAs a buyer, you can:\n• Browse bulk products\n• Get wholesale prices\n• Place bulk orders\n• Track your orders\n\nWhat would you like to do first?");
        await apiClient.sendMessage(response, business_phone_number_id);
    }
}

module.exports = new BuyHandler();

