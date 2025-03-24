const axios = require('axios');
const { GRAPH_API_TOKEN } = require('../config');

class WhatsAppService {
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
                },
            });
        } catch (error) {
            console.error('Error reading WhatsApp message:', error);
            throw error;
        }
    }

    async sendMainMenu(message, business_phone_number_id) {
        const response = {
            messaging_product: "whatsapp",
            to: message.from,
            type: "interactive",
            interactive: {
                type: "button",
                body: {
                    text: "🌟 Welcome to Garg Trade Hub! \n\nI can help you buy products, list items for sale, or visit our website for more information. What would you like to do?"
                },
                action: {
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "btn_buy",
                                title: "Shop Products"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "btn_sell",
                                title: "Start Selling"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "btn_website",
                                title: "Visit Website"
                            }
                        }
                    ]
                }
            }
        };
        await this.sendMessage(response, business_phone_number_id);
        await this.readMessage(message.id, business_phone_number_id);
    }

    async handleButtonInteraction(message, business_phone_number_id) {
        const button_id = message.interactive.button_reply.id;
        const user_phone = message.from;
        
        switch (button_id) {
            case 'btn_website':
                await this.handleWebsiteButton(user_phone, business_phone_number_id);
                break;
            case 'btn_buy':
                await this.handleBuyButton(user_phone, business_phone_number_id);
                break;
            case 'btn_sell':
                await this.handleSellButton(user_phone, business_phone_number_id);
                break;
            default:
                await this.sendMainMenu(message, business_phone_number_id);
        }
    }

    async handleWebsiteButton(user_phone, business_phone_number_id) {
        const response = {
            messaging_product: "whatsapp",
            to: user_phone,
            type: "text",
            text: {
                body: "🚧 Our website is currently under construction! 🏗️\n\nWe're working hard to bring you a seamless B2B marketplace experience for bulk purchases. The website will be launching soon with features tailored for shop owners and wholesale buyers.\n\nIn the meantime, you can continue using our WhatsApp service to buy and sell products! Type 'menu' anytime to see the main options."
            }
        };
    
        await this.sendMessage(response, business_phone_number_id);
    }
    
    async handleBuyButton(user_phone, business_phone_number_id) {
        const response = {
            messaging_product: "whatsapp",
            to: user_phone,
            type: "text",
            text: {
                body: "🛍️ Welcome to GargTradeHub Buying Portal!\n\nAs a buyer, you can:\n• Browse bulk products\n• Get wholesale prices\n• Place bulk orders\n• Track your orders\n\nWhat would you like to do first?"
            }
        };
    
        await this.sendMessage(response, business_phone_number_id);
        // TODO: Add follow-up menu for buyers
    }
    
    async handleSellButton(user_phone, business_phone_number_id) {
        const response = {
            messaging_product: "whatsapp",
            to: user_phone,
            type: "text",
            text: {
                body: "🏪 Welcome to GargTradeHub Seller Portal!\n\nAs a seller, you can:\n• List your products\n• Set wholesale prices\n• Manage inventory\n• Track orders\n\nLet's get started with setting up your seller account!"
            }
        };
    
        await this.sendMessage(response, business_phone_number_id);
        // TODO: Add follow-up menu for sellers
    }

}

module.exports = new WhatsAppService();

