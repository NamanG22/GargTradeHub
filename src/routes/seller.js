const express = require('express');
const router = express.Router();
const Seller = require('../models/seller');

// Endpoint to receive Google Form submissions
router.post('/form-submission', async (req, res) => {
    try {
        const {
            businessName,
            ownerName,
            businessAddress,
            cityState,
            pincode,
            gstin,
            category,
            deliveryService,
            notes
        } = req.body;

        console.log(req.body);

        // Create new seller
        // const seller = new Seller({
        //     name,
        //     whatsappNumber,
        //     businessName,
        //     address,
        //     gstin,
        //     status: 'pending',
        //     verified: false,
        //     onboardingComplete: true,
        //     onboardingStep: 1
        // });

        // await seller.save();

        res.status(201).json({
            success: true,
            message: 'Seller registration successful',
            data: seller
        });
    } catch (error) {
        console.error('Error in seller form submission:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing seller registration',
            error: error.message
        });
    }
});

module.exports = router; 