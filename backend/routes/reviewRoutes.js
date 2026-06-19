import express from 'express';
import { createReview, getWorkerReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/worker/:workerId')
  .get(getWorkerReviews);

export default router;
