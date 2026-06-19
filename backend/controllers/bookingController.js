import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
  const {
    workerId,
    serviceCategory,
    bookingDate,
    bookingTime,
    address,
    coordinates, // Array: [lng, lat]
    description,
    totalAmount,
  } = req.body;

  try {
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      res.status(404);
      return res.json({ message: 'Worker not found or invalid' });
    }

    const parsedCoordinates =
      Array.isArray(coordinates) && coordinates.length === 2
        ? [Number(coordinates[0]), Number(coordinates[1])]
        : [0, 0];

    const booking = await Booking.create({
      customer: req.user._id,
      worker: workerId,
      serviceCategory,
      bookingDate: new Date(bookingDate),
      bookingTime,
      address,
      location: {
        type: 'Point',
        coordinates: parsedCoordinates,
      },
      description,
      totalAmount: Number(totalAmount) || 0,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Get user bookings (role-based filter)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'worker') {
      query.worker = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admins see all bookings
      query = {};
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phoneNumber avatar address')
      .populate('worker', 'name email phoneNumber avatar address')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phoneNumber avatar address')
      .populate('worker', 'name email phoneNumber avatar address');

    if (!booking) {
      res.status(404);
      return res.json({ message: 'Booking not found' });
    }

    // Authorization check: Must be the customer, worker, or an admin
    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isWorker = booking.worker._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isWorker && !isAdmin) {
      res.status(403);
      return res.json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Update booking status (Pending -> Accepted -> In Progress -> Completed -> Cancelled)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  const { status, notes } = req.body;
  const validStatuses = ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    return res.json({ message: 'Invalid status value' });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      return res.json({ message: 'Booking not found' });
    }

    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isWorker = booking.worker.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isWorker && !isAdmin) {
      res.status(403);
      return res.json({ message: 'Not authorized to modify this booking' });
    }

    // Role-based status transition validation rules
    if (isCustomer && !isAdmin) {
      // Customers can only cancel a booking, and only if it is pending or accepted
      if (status !== 'cancelled') {
        res.status(400);
        return res.json({ message: 'Customers can only cancel bookings' });
      }
      if (booking.status !== 'pending' && booking.status !== 'accepted') {
        res.status(400);
        return res.json({ message: 'Booking is already active and cannot be cancelled' });
      }
    }

    if (isWorker && !isAdmin) {
      // Workers cannot regress to pending
      if (status === 'pending') {
        res.status(400);
        return res.json({ message: 'Cannot revert booking back to pending status' });
      }
      
      // Workers cannot transition from completed/cancelled to anything else
      if (booking.status === 'completed' || booking.status === 'cancelled') {
        res.status(400);
        return res.json({ message: 'Cannot update a completed or cancelled booking' });
      }
    }

    // Apply the status update
    booking.status = status;
    if (notes !== undefined) {
      booking.notes = notes;
    }

    const updatedBooking = await booking.save();
    
    // Fetch populated booking to return to front-end
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('customer', 'name email phoneNumber avatar address')
      .populate('worker', 'name email phoneNumber avatar address');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

export { createBooking, getBookings, getBookingById, updateBookingStatus };
