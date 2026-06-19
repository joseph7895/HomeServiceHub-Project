import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// @desc    Submit a review for a completed service booking
// @route   POST /api/reviews
// @access  Private (Customer)
const createReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    return res.json({ message: 'Rating and comment are required' });
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return res.json({ message: 'Booking not found' });
    }

    // 1. Validate that the current caller is the booking's customer
    if (booking.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      return res.json({ message: 'Not authorized to review this booking' });
    }

    // 2. Validate that the booking is completed before accepting a review
    if (booking.status !== 'completed') {
      res.status(400);
      return res.json({ message: 'Reviews can only be submitted for completed services' });
    }

    // 3. Validate that a review hasn't already been submitted for this booking
    const reviewExists = await Review.findOne({ booking: bookingId });
    if (reviewExists) {
      res.status(400);
      return res.json({ message: 'You have already submitted a review for this booking' });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      worker: booking.worker,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Get reviews for a specific worker
// @route   GET /api/reviews/worker/:workerId
// @access  Public
const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

export { createReview, getWorkerReviews };
