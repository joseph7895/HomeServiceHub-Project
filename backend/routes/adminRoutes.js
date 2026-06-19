import express from 'express';
import {
  getStats,
  getAllUsers,
  deleteUser,
  toggleWorkerApproval,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection & admin authorization to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/workers/:id/approve', toggleWorkerApproval);

export default router;
