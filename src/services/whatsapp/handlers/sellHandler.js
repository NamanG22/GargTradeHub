const Seller = require('../../../models/seller');
const MessageBuilder = require('../utils/messageBuilder');
const apiClient = require('../utils/apiClient');

class SellHandler {
    async handleSellButton(user_phone, business_phone_number_id) {
        try {
            // Check if seller exists
            const existingSeller = await Seller.findOne({ phoneNumber: user_phone });
            
            if (existingSeller) {
                // Handle existing seller flow
                const response = MessageBuilder.buildExistingSellerResponse(existingSeller, user_phone);
                await apiClient.sendMessage(response, business_phone_number_id);
            } else {
                // Send new seller registration message with Google Form
                const registrationMsg = MessageBuilder.buildNewSellerRegistrationMessage(user_phone);
                await apiClient.sendMessage(registrationMsg, business_phone_number_id);

                // Send follow-up message about next steps
                setTimeout(async () => {
                    const followUpMsg = MessageBuilder.buildSellerFormSubmissionMessage(user_phone);
                    await apiClient.sendMessage(followUpMsg, business_phone_number_id);
                }, 1000);
            }
        } catch (error) {
            console.error('Error in handleSellButton:', error);
            const errorResponse = MessageBuilder.buildErrorMessage(user_phone);
            await apiClient.sendMessage(errorResponse, business_phone_number_id);
        }
    }
}

module.exports = new SellHandler();
