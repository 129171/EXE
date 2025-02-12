const mongoose = require('mongoose');

const SoundSchema = new mongoose.Schema({
    name: String,
    is_premium: { type: Boolean, default: false },
    file_sound_url: String,
    file_images_url: {type: String, default: null},
    duration: Number,
    tag : String,
    describtion: String,
}, {timestamps: true})

module.exports = mongoose.model('Sound', SoundSchema);
