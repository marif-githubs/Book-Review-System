const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        validate: {
            validator: function (value) {
                // Validate if the value is a valid image URL or file path
                const urlRegex = /^(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif))$/i;
                const fileRegex = /\.(jpg|jpeg|png|gif)$/i;
                return urlRegex.test(value) || fileRegex.test(value);
            },
            message: 'Image must be a valid URL or a file path to an image.',
        },
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
    free_resources: {
        type: String,
        validate: {
            validator: function (value) {
                // Validate if the value is a URL or a file path (basic validation)
                const urlRegex = /^(https?:\/\/[^\s]+)$/;
                const fileRegex = /\.(pdf|jpg|jpeg|png)$/i;
                return urlRegex.test(value) || fileRegex.test(value);
            },
            message: 'free_resources must be a valid URL or a file path to a PDF/image.',
        },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
