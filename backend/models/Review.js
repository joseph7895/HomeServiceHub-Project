import mongoose from 'mongoose';
import WorkerProfile from './WorkerProfile.js';

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Only one review per booking
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to calculate average rating of a worker
reviewSchema.statics.calculateAverageRating = async function (workerId) {
  const stats = await this.aggregate([
    {
      $match: { worker: workerId },
    },
    {
      $group: {
        _id: '$worker',
        numReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await WorkerProfile.findOneAndUpdate(
        { user: workerId },
        {
          rating: Math.round(stats[0].averageRating * 10) / 10,
          numReviews: stats[0].numReviews,
        }
      );
    } else {
      await WorkerProfile.findOneAndUpdate(
        { user: workerId },
        {
          rating: 0,
          numReviews: 0,
        }
      );
    }
  } catch (error) {
    console.error(`Error recalculating worker average rating: ${error}`);
  }
};

// Recalculate average rating after review is saved
reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.worker);
});

// Recalculate average rating after review is removed
reviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.worker);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
