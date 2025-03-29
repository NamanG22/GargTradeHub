const MessageBuilder = require('../utils/messageBuilder');
const apiClient = require('../utils/apiClient');
const Buyer = require('../../models/Buyer');

class BuyHandler {
    async handleBuyButton(user_phone, business_phone_number_id) {
        try {
            // Check if buyer exists
            const existingBuyer = await Buyer.findOne({ phoneNumber: user_phone });
            
            if (existingBuyer) {
                // Handle existing buyer flow
                const response = MessageBuilder.buildExistingBuyerResponse(existingBuyer, user_phone);
                await apiClient.sendMessage(response, business_phone_number_id);
            } else {
                // Send new buyer registration message with Google Form
                const registrationMsg = MessageBuilder.buildNewBuyerRegistrationMessage(user_phone);
                await apiClient.sendMessage(registrationMsg, business_phone_number_id); 
            }
        } catch (error) {
            console.error('Error in handleBuyButton:', error);
            const errorResponse = MessageBuilder.buildErrorMessage(user_phone);
            await apiClient.sendMessage(errorResponse, business_phone_number_id);
        }   
    }
}

module.exports = new BuyHandler();

