import WorkerProfile from '../models/WorkerProfile.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// @desc    Get all workers with optional category and geospatial location filters
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res) => {
  const { skill, lat, lng, radius } = req.query;

  try {
    let queryUserIds = null;

    // 1. If geolocation parameters are present, perform Geospatial search on User model first
    if (lat && lng) {
      const parsedLat = Number(lat);
      const parsedLng = Number(lng);
      // default radius is 15 km
      const radiusInKm = Number(radius) || 15;
      const radiusInMeters = radiusInKm * 1000;

      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        const nearbyUsers = await User.find({
          role: 'worker',
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parsedLng, parsedLat],
              },
              $maxDistance: radiusInMeters,
            },
          },
        }).select('_id');

        queryUserIds = nearbyUsers.map((u) => u._id);
      }
    }

    // 2. Build WorkerProfile filter query
    const filterQuery = { isApproved: true };

    if (queryUserIds !== null) {
      filterQuery.user = { $in: queryUserIds };
    }

    if (skill) {
      // Case-insensitive search on skills array
      filterQuery.skills = { $regex: new RegExp(skill, 'i') };
    }

    // 3. Query WorkerProfiles and populate associated User details
    const profiles = await WorkerProfile.find(filterQuery).populate({
      path: 'user',
      select: '-password',
    });

    // If geolocation sorting is active, keep the order that was returned by User geospatial $near query
    if (queryUserIds !== null) {
      const orderMap = {};
      queryUserIds.forEach((id, index) => {
        orderMap[id.toString()] = index;
      });

      profiles.sort((a, b) => {
        const indexA = orderMap[a.user?._id?.toString()] ?? 99999;
        const indexB = orderMap[b.user?._id?.toString()] ?? 99999;
        return indexA - indexB;
      });
    }

    res.json(profiles);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Get worker details by User ID (including reviews)
// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = async (req, res) => {
  try {
    const workerUser = await User.findById(req.params.id).select('-password');
    
    if (!workerUser || workerUser.role !== 'worker') {
      res.status(404);
      return res.json({ message: 'Worker not found' });
    }

    const profile = await WorkerProfile.findOne({ user: workerUser._id });

    if (!profile) {
      res.status(404);
      return res.json({ message: 'Worker profile details not initialized' });
    }

    // Fetch reviews
    const reviews = await Review.find({ worker: workerUser._id })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      user: workerUser,
      profile,
      reviews,
    });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Update worker availability (Private to worker)
// @route   PUT /api/workers/availability
// @access  Private (Worker)
const updateAvailability = async (req, res) => {
  const { availability } = req.body;

  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });

    if (!profile) {
      res.status(404);
      return res.json({ message: 'Worker profile not found' });
    }

    if (availability) {
      profile.availability = {
        ...profile.availability,
        ...availability,
      };
      await profile.save();
    }

    res.json({
      message: 'Availability updated successfully',
      availability: profile.availability,
    });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

export { getWorkers, getWorkerById, updateAvailability };
