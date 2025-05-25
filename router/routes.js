const express = require('express');
const router = express.Router();
const { handleCreateReview, handleUpdateReview, handleDeleteReview } = require('../service/reviewService');
const { handleGetBooks, handleCreateBook, handleBook, handleSearchBooks } = require('../service/bookService');

router.post('/books/:bookId/reviews', handleCreateReview); // Post a new review for a book
router.put('/reviews/:reviewId', handleUpdateReview); // Update a review
router.delete('/reviews/:reviewId', handleDeleteReview); // Delete a review

router.get('/books', handleGetBooks); // Get all books
router.post('/books', handleCreateBook); // Post a new book
router.get('/books/:bookId', handleBook); // Get a specific book by ID
router.get('/search', handleSearchBooks); // Search books by title or author

module.exports = router;