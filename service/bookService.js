const express = require('express');
const router = express.Router();
const Book = require('../model/book');
const logger = require('../utils/logger'); // Importing the logger utility
const { log } = require('winston');
const { handleReview } = require('./reviewService');

// Get all books
const handleGetBooks = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let authorFilter = {};

        if (req.query.author) {
            authorFilter = req.query.author ? { author: req.query.author } : {};
        }
        logger.info('Author Filter:', authorFilter);

        const totalBooks = await Book.countDocuments(authorFilter);
        const totalPages = Math.ceil(totalBooks / limit);

        const books = await Book.find(authorFilter).skip(skip).limit(limit);

        if (!books.length) {
            return res.status(404).json({ message: 'No books found' });
        }

        res.json({
            totalBooks,
            totalPages,
            currentPage: page,
            books
        }).status(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Post a new book
const handleCreateBook = async (req, res) => {

    //--todo--
    //handle image upload, free_resource.

    const { title, author, description, links } = req.body;

    // Validate the book data
    if (!title || !author) {
        logger.error('Title and author are required', req.body);
        return res.status(400).json({ message: 'Title and author are required' });
    }
    logger.info('New book data:', req.body);

    const book = new Book({ title, author, description, links });

    //--todo--
    // Check if the book already exists 
    // description should be max 300 words

    try {

        const savedBook = await book.save();
        if (!savedBook) {
            logger.error('Error saving book:', error.message);
            return res.status(500).json({ message: 'Error saving book' });
        }
        logger.info('Book saved:', savedBook);

        res.status(201).json(savedBook);

    } catch (error) {
        logger.error('Unexpected Error Occur:', error.message);
        res.status(500).json({ message: error.message });
    }
}

// Get a specific book by ID and its reviews
const handleBook = async (req, res) => {

    const { bookId } = req.params;
    if (!bookId) {
        logger.error('Book ID is required');
        return res.status(400).json({ message: 'Book ID is required' });
    }
    logger.info(`bookId: ${bookId}`);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {

        const book = await Book.findById(bookId);
        if (!book) {
            logger.error('Book not found with ID:', bookId);
            return res.status(404).json({ message: 'Book not found' });
        }
        logger.info(`Book found: ${book._id}`);

        // Fetch reviews for the book
        const reviews = await handleReview(bookId, skip, limit);
        if (!reviews.totalReviews) {
            logger.warn('No reviews found for book:', bookId);
        } else {
            logger.info(`${reviews.totalReviews} Reviews found for book:`, bookId);
        }

        logger.info('Book details:');

        res.status(200).json({ book, reviews });

    } catch (error) {
        logger.error('Unexpected Error Occur:', error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { handleGetBooks, handleCreateBook, handleBook };

