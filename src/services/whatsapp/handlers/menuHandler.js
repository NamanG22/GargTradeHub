const MessageBuilder = require('../utils/messageBuilder');
const apiClient = require('../utils/apiClient');
class MenuHandler {
    async sendMainMenu(message, business_phone_number_id) {
        const response = MessageBuilder.buildMainMenuButtons(message.from);
        await apiClient.sendMessage(response, business_phone_number_id);
        await apiClient.readMessage(message.id, business_phone_number_id);
    }
}

module.exports = new MenuHandler(); 
