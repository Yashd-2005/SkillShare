const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    thumbnailUrl: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String, // Telegram link or Cloudinary secure_url
        required: true,
    },
    sourceType: {
        type: String,
        enum: ['telegram', 'cloudinary'],
        default: 'telegram'
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

// Text index for search functionality
videoSchema.index({ title: 'text', description: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Video', videoSchema);
