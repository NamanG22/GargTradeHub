const MessageBuilder = require('../utils/messageBuilder');
const apiClient = require('../utils/apiClient');

class HelpHandler {
    async handleHelpMessage(message, business_phone_number_id) {
        const response = MessageBuilder.buildHelpMessage(message.from);
        await apiClient.sendMessage(response, business_phone_number_id);
    }
}

module.exports = new HelpHandler();
