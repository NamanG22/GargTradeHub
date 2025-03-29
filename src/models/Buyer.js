const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    // Basic Information
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    businessType: {
        type: String,
        enum: ['retailer', 'wholesaler', 'distributor', 'manufacturer', 'other'],
        required: true
    },

    // Contact & Address
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
        street: String,
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true,
            match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
        }
    },

    // Business Details
    gstNumber: {
        type: String,
        trim: true,
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
    },
    panNumber: {
        type: String,
        trim: true,
        match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
    },

    // Account Status
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended', 'blocked'],
        default: 'pending'
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    // Shopping History
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    recentlyViewed: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Preferences
    preferredCategories: [{
        type: String,
        trim: true
    }],
    preferredSellers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    }],
    notificationPreferences: {
        orderUpdates: {
            type: Boolean,
            default: true
        },
        priceAlerts: {
            type: Boolean,
            default: true
        },
        promotions: {
            type: Boolean,
            default: true
        },
        whatsapp: {
            type: Boolean,
            default: true
        }
    },

    // Metrics
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    averageOrderValue: {
        type: Number,
        default: 0
    },
    lastOrderDate: Date,

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: Date
}, {
    timestamps: true
});

// Indexes for better query performance
buyerSchema.index({ phoneNumber: 1 });
buyerSchema.index({ 'address.city': 1, 'address.state': 1 });
buyerSchema.index({ businessType: 1 });
buyerSchema.index({ status: 1 });

// Pre-save middleware to update averageOrderValue
buyerSchema.pre('save', function(next) {
    if (this.totalOrders > 0) {
        this.averageOrderValue = this.totalSpent / this.totalOrders;
    }
    next();
});

// Instance method to check if buyer is active
buyerSchema.methods.isActive = function() {
    return this.status === 'active';
};

// Static method to find active buyers in a city
buyerSchema.statics.findActiveByCity = function(city) {
    return this.find({
        status: 'active',
        'address.city': city
    });
};

// Virtual for full address
buyerSchema.virtual('fullAddress').get(function() {
    return `${this.address.street}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}`;
});

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;