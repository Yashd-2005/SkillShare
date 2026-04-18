const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    savedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
