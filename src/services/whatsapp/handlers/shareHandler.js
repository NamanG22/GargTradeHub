const MessageBuilder = require('../utils/messageBuilder');
const apiClient = require('../utils/apiClient');

class ShareHandler {
    async handleShareMessage(message, business_phone_number_id) {
        try {
            const user_phone = message.from;
            const messageText = message.text.body.trim();
            
            // If just "SHARE" is typed, send instructions
            if (messageText.toLowerCase() === 'share') {
                const instructions = MessageBuilder.buildShareInstructions(user_phone);
                await apiClient.sendMessage(instructions, business_phone_number_id);
                return;
            }

            // Extract phone number from message (SHARE 9876543210)
            const phoneMatch = messageText.match(/^SHARE\s+(\d{10})$/i);
            
            if (!phoneMatch) {
                const errorMsg = MessageBuilder.buildShareErrorMessage(user_phone);
                await apiClient.sendMessage(errorMsg, business_phone_number_id);
                return;
            }

            const sharedNumber = phoneMatch[1];
            
            // Additional validation for Indian mobile numbers
            if (!this.isValidIndianMobile(sharedNumber)) {
                const errorMsg = MessageBuilder.buildShareErrorMessage(user_phone);
                await apiClient.sendMessage(errorMsg, business_phone_number_id);
                return;
            }

            // Add country code for WhatsApp API
            const whatsappNumber = "91" + sharedNumber;

            // Send welcome message to the shared number
            const welcomeMsg = MessageBuilder.buildWelcomeMessage(whatsappNumber);
            await apiClient.sendMessage(welcomeMsg, business_phone_number_id);

            // Send buttons to the shared number
            const buttonMsg = MessageBuilder.buildMainMenuButtons(whatsappNumber);
            await apiClient.sendMessage(buttonMsg, business_phone_number_id);

            // Send success message to original user
            const successMsg = MessageBuilder.buildShareSuccessMessage(user_phone, sharedNumber);
            await apiClient.sendMessage(successMsg, business_phone_number_id);

        } catch (error) {
            console.error('Error in handleShareMessage:', error);
            const errorResponse = MessageBuilder.buildErrorMessage(message.from);
            await apiClient.sendMessage(errorResponse, business_phone_number_id);
        }
    }

    isValidIndianMobile(number) {
        // Check if it starts with valid Indian mobile prefixes (6-9)
        return /^[6-9]\d{9}$/.test(number);
    }
}

module.exports = new ShareHandler();