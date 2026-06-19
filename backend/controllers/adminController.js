import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import Booking from '../models/Booking.js';

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalWorkers = await User.countDocuments({ role: 'worker' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const acceptedBookings = await Booking.countDocuments({ status: 'accepted' });
    const inProgressBookings = await Booking.countDocuments({ status: 'in-progress' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Sum total revenue from completed bookings
    const revenueStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Get distribution of bookings by serviceCategory
    const categoryStats = await Booking.aggregate([
      { $group: { _id: '$serviceCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Fetch 5 most recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('worker', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      users: {
        total: totalUsers,
        customers: totalCustomers,
        workers: totalWorkers,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        accepted: acceptedBookings,
        inProgress: inProgressBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      totalRevenue,
      categoryStats,
      recentBookings,
    });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    
    const usersWithProfiles = await Promise.all(
      users.map(async (u) => {
        if (u.role === 'worker') {
          const profile = await WorkerProfile.findOne({ user: u._id });
          return {
            ...u,
            workerProfile: profile,
          };
        }
        return u;
      })
    );

    res.json(usersWithProfiles);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return res.json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      res.status(400);
      return res.json({ message: 'Cannot delete admin accounts' });
    }

    // Delete associated worker profile if they are a worker
    if (user.role === 'worker') {
      await WorkerProfile.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and all associated profiles deleted successfully' });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Approve/Disapprove worker profile
// @route   PUT /api/admin/workers/:id/approve
// @access  Private (Admin Only)
const toggleWorkerApproval = async (req, res) => {
  const { isApproved } = req.body;

  try {
    const profile = await WorkerProfile.findOne({ user: req.params.id }).populate('user', '-password');

    if (!profile) {
      res.status(404);
      return res.json({ message: 'Worker profile not found' });
    }

    profile.isApproved = isApproved !== undefined ? isApproved : !profile.isApproved;
    await profile.save();

    res.json({
      message: `Worker account status successfully updated to ${profile.isApproved ? 'Approved' : 'Disapproved'}`,
      profile,
    });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

export { getStats, getAllUsers, deleteUser, toggleWorkerApproval };
