import express from 'express';
import {
  getWorkers,
  getWorkerById,
  updateAvailability,
} from '../controllers/workerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getWorkers);

router.route('/availability')
  .put(protect, authorize('worker'), updateAvailability);

router.route('/:id')
  .get(getWorkerById);

export default router;
