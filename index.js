require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const Seller = require('./models/Seller');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.post('/webhook', async (req, res) => {
    try {
        const { from, message_body } = req.body; // Adjust according to your WhatsApp API
        
        // Check if sender exists as a seller
        let seller = await Seller.findOne({ whatsappNumber: from });
        
        if (!seller && message_body.toLowerCase() === 'register as seller') {
            // Start seller onboarding
            seller = new Seller({ whatsappNumber: from });
            await seller.save();
            await sendWhatsAppMessage(from, 'Welcome! Please enter your business name:');
        } else if (seller && !seller.onboardingComplete) {
            // Handle onboarding steps
            await handleSellerOnboarding(seller, message_body);
        } else{
            await sendWhatsAppMessage(from, 'Hello');
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function sendWhatsAppMessage(to, message) {
    try {
        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: {
                    body: message
                }
            }
        });
        
        console.log('WhatsApp message sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
        throw error;
    }
}

async function handleSellerOnboarding(seller, message) {
    switch (seller.onboardingStep) {
        case 1:
            seller.businessName = message;
            seller.onboardingStep = 2;
            await seller.save();
            await sendWhatsAppMessage(seller.whatsappNumber, 'Please enter your business address:');
            break;
        case 2:
            seller.address = message;
            seller.onboardingStep = 3;
            seller.onboardingComplete = true;
            await seller.save();
            await sendWhatsAppMessage(
                seller.whatsappNumber, 
                'Thank you! Your registration is complete. To add a product, send "add product"'
            );
            break;
    }
}

app.get('/check', (req, res) => {
    res.send('Hello World');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

