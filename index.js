require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const Seller = require('./models/Seller');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.post('/webhook', async (req, res) => {
    try {
        console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

        const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

        if (message?.type === "text") {
            const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
        
            await axios({
              method: "POST",
              url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
              headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
              },
              data: {
                messaging_product: "whatsapp",
                to: message.from,
                text: { body: "Echo: " + message.text.body },
                context: {
                  message_id: message.id, // shows the message as a reply to the original user message
                },
              },
            });
        
            // mark incoming message as read
            await axios({
              method: "POST",
              url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
              headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
              },
              data: {
                messaging_product: "whatsapp",
                status: "read",
                message_id: message.id,
              },
            });
          }
        
          res.sendStatus(200);
        
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

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
  
    // check the mode and token sent are correct
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
      // respond with 200 OK and challenge token from the request
      res.status(200).send(challenge);
      console.log("Webhook verified successfully!");
    } else {
      // respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  });
  
  app.get("/", (req, res) => {
    res.send(`<pre>Nothing to see here.
  Checkout README.md to start.</pre>`);
  });

app.get('/check', (req, res) => {
    res.send('Hello World');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

