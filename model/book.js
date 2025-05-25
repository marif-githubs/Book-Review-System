const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    links: {
        type: [String],
        validate: {
            validator: function (value) {
                // Validate if each value in the array is a valid URL
                const urlRegex = /^(https?:\/\/[^\s]+)$/;
                return value.every(link => urlRegex.test(link));
            },
            message: 'Each link must be a valid URL.',
        },
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
