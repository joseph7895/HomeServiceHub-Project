import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../utils/cloudinaryHelper.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      return res.json({ message: 'No file uploaded' });
    }

    const imageUrl = await uploadImage(req.file);

    res.json({
      url: imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message || 'Image upload failed' });
  }
});

export default router;
