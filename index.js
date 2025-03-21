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
            
            sendWhatsAppMessage(message, business_phone_number_id);
            
          }
        
          res.sendStatus(200);
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function sendWhatsAppMessage(message, business_phone_number_id) {
    try {
        // Check if this is a new conversation or needs main menu
        const response = {
            messaging_product: "whatsapp",
            to: message.from,
            type: "interactive",
            interactive: {
                type: "button",
                body: {
                    text: "👋 Welcome to our service! Please select an option from below:"
                },
                action: {
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "btn_1",
                                title: "Option 1"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "btn_2",
                                title: "Option 2"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "btn_3",
                                title: "Option 3"
                            }
                        }
                    ]
                }
            }
        };

        await axios({
            method: "POST",
            url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: response
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
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
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
    res.send("Hello World");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

