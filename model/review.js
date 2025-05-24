const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    reviewer: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
