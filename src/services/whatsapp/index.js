const apiClient = require('./utils/apiClient');
const sellHandler = require('./handlers/sellHandler');
const buyHandler = require('./handlers/buyHandler');
const menuHandler = require('./handlers/menuHandler');
const websiteHandler = require('./handlers/websiteHandler');
const shareHandler = require('./handlers/shareHandler');
const helpHandler = require('./handlers/helpHandler');

class WhatsAppService {
    async handleButtonInteraction(message, business_phone_number_id) {
        const button_id = message.interactive.button_reply.id;
        const user_phone = message.from;
        
        switch (button_id) {
            case 'btn_website':
                await websiteHandler.handleWebsiteButton(user_phone, business_phone_number_id);
                break;
            case 'btn_buy':
                await buyHandler.handleBuyButton(user_phone, business_phone_number_id);
                break;
            case 'btn_sell':
                await sellHandler.handleSellButton(user_phone, business_phone_number_id);
                break;
            case 'btn_main_menu':
                await menuHandler.sendMainMenu(message, business_phone_number_id);
                break;
            default:
                await menuHandler.sendMainMenu(message, business_phone_number_id);
        }
    }

    async sendMainMenu(message, business_phone_number_id) {
        await menuHandler.sendMainMenu(message, business_phone_number_id);
    }

    async handleShareMessage(message, business_phone_number_id) {
        await shareHandler.handleShareMessage(message, business_phone_number_id);
    }

    async handleHelpMessage(message, business_phone_number_id) {
        await helpHandler.handleHelpMessage(message, business_phone_number_id);
    }
}

module.exports = new WhatsAppService();
