const Review = require('../model/review');
const logger = require('../utils/logger');

// GET reviews for a specific book
const handleReview = async (bookId, skip, limit) => {
    try {

        logger.info(`Fetching reviews for bookId: ${bookId}`);

        const totalReviews = await Review.countDocuments({ bookId });
        const totalPages = Math.ceil(totalReviews / limit);

        const reviews = await Review.find({ bookId })
            .skip(skip)
            .limit(limit)

        if (!reviews.length) {
            logger.error('No reviews found for bookId:', bookId);
            return {};
        }
        logger.info(`Total reviews: ${totalReviews}, Total pages: ${totalPages}`);

        return {
            totalReviews,
            totalPages,
            currentPage: skip / limit + 1,
            reviews,
        }
    } catch (error) {
        logger.error('Error fetching reviews:', error.message);
    }
}

// POST a new review for a book
const handleCreateReview = async (req, res) => {

    const { bookId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user.userId;
    if (!userId || !comment || !bookId) {
        logger.error(`Reviewer, comment, and bookId are required: ${userId}, ${comment}, ${bookId}`);
        return res.status(400).json({ message: 'Reviewer, comment, and rating are required' });
    }

    logger.info(`New review for bookId: ${bookId}`);

    const review = new Review({
        bookId,
        userId,
        comment,
        rating,
    });

    try {

        const savedReview = await review.save();

        if (!savedReview) {
            logger.error('Error saving review:', error.message);
            return res.status(500).json({ message: 'Error saving review' });
        }
        logger.info('Review saved:', savedReview);

        res.status(201).json(savedReview);

    } catch (error) {
        logger.error('Unexpected Error Occur:', error.message);
        res.status(500).json({ message: error.message });
    }
}

// PUT to update a review
const handleUpdateReview = async (req, res) => {
    const { reviewId } = req.params || {};
    const { comment, rating } = req.body || {};

    if (!comment || !reviewId) {
        logger.error('Reviewer, comment, and reviewId are required', comment, reviewId);
        return res.status(400).json({ message: 'Comment and reviewId are required' });
    }

    logger.info(`Updating review of: ${reviewId}`);

    try {
        const updatedReview = await Review.findByIdAndUpdate(reviewId, { comment, rating }, { new: true });

        if (!updatedReview) {
            logger.error('Review not found:', reviewId);
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json(updatedReview);

    } catch (error) {
        logger.error('Unexpected Error Occur:', error.message);
        res.status(500).json({ message: error.message });
    }
}

// DELETE a review
const handleDeleteReview = async (req, res) => {
    const { reviewId } = req.params || {};

    if (!reviewId || reviewId.trim() === '') {
        logger.error('Review ID is required', reviewId);
        return res.status(400).json({ message: 'Review ID is required' });
    }

    logger.info(`Deleting review of: ${reviewId}`);

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            logger.error('Review not found:', reviewId);
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });

    } catch (error) {
        logger.error('Unexpected Error Occur:', error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { handleReview, handleCreateReview, handleUpdateReview, handleDeleteReview };
