class MessageBuilder {
    static buildTextMessage(to, text) {
        return {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: text }
        };
    }

    static buildWelcomeMessage(to) {
        return this.buildTextMessage(
            to,
            "🌟 Welcome to GargTradeHub! 🌟\n\n" +
            "Your One-Stop B2B Marketplace on WhatsApp\n\n" +
            "🔥 Why Choose GargTradeHub?\n" +
            "• Direct connection with verified manufacturers & wholesalers\n" +
            "• Zero commission on trades\n" +
            "• Secure payment gateway\n" +
            "• Real-time price updates\n" +
            "• Doorstep delivery options\n\n" +
            "💼 What You Can Do:\n" +
            "1. 🛍️ BUY Products\n" +
            "   • Browse trending products\n" +
            "   • Get wholesale prices\n" +
            "   • Compare multiple sellers\n" +
            "   • Track your orders\n\n" +
            "2. 💰 SELL Products\n" +
            "   • List your products\n" +
            "   • Reach genuine buyers\n" +
            "   • Manage inventory\n" +
            "   • Get business insights\n\n" +
            "3. 🌐 Visit Website\n" +
            "   • Detailed product catalog\n" +
            "   • Market trends\n" +
            "   • Success stories\n\n" +
            "Ready to get started? Choose an option:\n" +
            "1. Type 'BUY' to start shopping\n" +
            "2. Type 'SELL' to start selling\n" +
            "3. Type 'HELP' for assistance\n\n" +
            "Join thousands of successful businesses on GargTradeHub! 🚀"
        );
    }

    static buildShareSuccessMessage(to, sharedNumber) {
        return this.buildTextMessage(
            to,
            `✅ Thanks for sharing! We've sent a welcome message to +91 ${sharedNumber}.\n\n` +
            `🎁 When they make their first transaction, you'll receive special rewards!`
        );
    }

    static buildShareInstructions(to) {
        return this.buildTextMessage(
            to,
            "📱 To share GargTradeHub with others:\n\n" +
            "Send 'SHARE' followed by the phone number\n" +
            "Example: SHARE 9876543210\n\n" +
            "Note: Please don't include country code or +91"
        );
    }

    static buildShareErrorMessage(to) {
        return this.buildTextMessage(
            to,
            "❌ Invalid phone number format!\n\n" +
            "Please use format: SHARE 9876543210\n" +
            "Note: Please don't include country code or +91"
        );
    }
    
    static buildButtonMessage(to, bodyText, buttons) {
        return {
            messaging_product: "whatsapp",
            to,
            type: "interactive",
            interactive: {
                type: "button",
                body: { text: bodyText },
                action: { buttons }
            }
        };
    }

    static buildMainMenuButtons(to) {
        return this.buildButtonMessage(
            to,
            "🌟 Welcome to Garg Trade Hub! \n\nI can help you buy products, list items for sale, or visit our website for more information. What would you like to do?",
            [
                {
                    "type": "reply",
                    "reply": {
                        "id": "btn_buy",
                        "title": "Buy Products 🛍️"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "btn_sell",
                        "title": "Sell Products 💰"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "btn_website",
                        "title": "Visit Website 🌐"
                    }
                }
            ]
        );
    }

    static buildHelpMessage(to) {
        return this.buildButtonMessage(
            to,
            "📚 GargTradeHub Help Center\n\n" +
            "🤖 Available Commands:\n\n" +
            "1. SHARE [number]\n" +
            "   • Share GargTradeHub with others\n" +
            "   • Example: SHARE 9876543210\n\n" +
            "2. HELP\n" +
            "   • Show this help message\n" +
            "   • Lists all available commands\n\n" +
            "🔜 Coming Soon:\n" +
            "• AI Assistant Chatbot\n" +
            "• Product Search\n" +
            "• Price Alerts\n" +
            "• Order Tracking\n\n" +
            "Need more help? Click the button below to visit our website for detailed guidance and support.",
            [
                {
                    "type": "reply",
                    "reply": {
                        "id": "btn_website",
                        "title": "Visit Website 🌐"
                    }
                }
            ]
        );
    }

    static buildNewSellerRegistrationMessage(to) {
        return this.buildButtonMessage(
            to,
            "🎉 Welcome to GargTradeHub Seller Program!\n\n" +
            "To start selling on our platform, please complete our seller registration form. " +
            "The form collects important information such as:\n\n" +
            "📝 Required Information:\n" +
            "• Business Name\n" +
            "• Business Address\n" +
            "• GST Number (if applicable)\n" +
            "• Product Categories\n" +
            "• Bank Details\n\n" +
            "Click the button below to fill out the registration form:",
            [
                {
                    "type": "url",
                    "url": {
                        "id": "btn_seller_form",
                        "title": "Register as Seller 📝",
                        "url": "https://forms.gle/YOUR_GOOGLE_FORM_URL" // Replace with your actual Google Form URL
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "btn_main_menu",
                        "title": "Back to Menu 🏠"
                    }
                }
            ]
        );
    }

    static buildSellerFormSubmissionMessage(to) {
        return this.buildTextMessage(
            to,
            "✅ Thanks for your interest in becoming a seller!\n\n" +
            "After you submit the form:\n" +
            "1. Our team will review your application\n" +
            "2. You'll receive a confirmation within 24-48 hours\n" +
            "3. Once approved, you can start listing your products\n\n" +
            "🤝 Need help? Type HELP for support"
        );
    }
    

    static buildErrorMessage(to) {
        return this.buildTextMessage(
            to,
            "Sorry, we encountered an error. Please try again later."
        );
    }
}

module.exports = MessageBuilder;
