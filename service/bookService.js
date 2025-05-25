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
        logger.info(`Author Filter: ${authorFilter.author}`);
        // console.log(`req.user: ${req.user.userId}`);
        const totalBooks = await Book.countDocuments(authorFilter);
        const totalPages = Math.ceil(totalBooks / limit);

        const books = await Book.find(authorFilter).skip(skip).limit(limit);

        if (!books.length) {
            return res.status(404).json({
                status: 'fail',
                message: 'No books found',
                payload: {
                    totalBooks: 0,
                    totalPages: 0,
                    currentPage: page,
                    books: []
                }
            });
        }

        res.json({
            status: 'success',
            message: 'Books fetched successfully',
            payload: {
                totalBooks,
                totalPages,
                currentPage: page,
                books
            }
        }).status(200);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Post a new book
const handleCreateBook = async (req, res) => {

    const { title, author, description, links } = req.body;
    //--todo--
    //handle image upload, free_resource.

    // Validate the book data
    if (!title || !author) {
        logger.error('Title and author are required', req.body);
        return res.status(400).json({
            status: 'fail',
            message: 'Title and author are required',
            payload: {}
        });
    }
    logger.info(`New book data: ${req.body}`);

    const userId = req.user.userId;
    const book = new Book({ userId, title, author, description, links });

    //--todo--
    // Check if the book already exists 
    // description should be max 300 words

    try {

        const savedBook = await book.save();
        if (!savedBook) {
            logger.error('Error saving book:', error.message);
            return res.status(500).json({
                status: 'error',
                message: 'Error saving book',
                payload: {}
            });
        }

        logger.info(`Book saved: ${savedBook}`);

        res.status(201).json({
            status: 'success',
            message: 'Book created successfully',
            payload: savedBook
        });

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
        return res.status(400).json({
            status: 'fail',
            message: 'Book ID is required',
            payload: {}
        });
    }
    logger.info(`bookId: ${bookId}`);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {

        const book = await Book.findById(bookId);
        if (!book) {
            logger.error('Book not found with ID:', bookId);
            return res.status(404).json({
                status: 'fail',
                message: 'Book not found',
                payload: {}
            });
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

        res.status(200).json({
            status: 'success',
            message: 'Book and reviews fetched successfully',
            payload: {
                book,
                reviews
            }
        });

    } catch (error) {
        logger.error('Unexpected Error Occur:', error.message);
        res.status(500).json({ message: error.message });
    }
}

//search books by title or author
const handleSearchBooks = async (req, res) => {

    let { key } = req.query;
    if (!key) {
        logger.error('Search query is required');
        return res.status(400).json({ message: 'Search query is required' });
    }
    logger.info(`Search query: ${key}`);
    key = key.trim().toLowerCase();
    const searchRegex = new RegExp(key, 'i'); // Case-insensitive search
    const authorFilter = { $or: [{ title: searchRegex }, { author: searchRegex }] };
    try {
        const books = await Book.find(authorFilter);
        if (!books.length) {
            logger.warn('No books found for query:', key);
            return res.status(404).json({ message: 'No books found' });
        }
        logger.info(`${books.length} books found for query:`, key);
        res.status(200).json(books);
    } catch (error) {
        logger.error('Unexpected Error Occur:', error.message);
        res.status(500).json({ message: error.message });
    }
}


module.exports = { handleGetBooks, handleCreateBook, handleBook, handleSearchBooks };

