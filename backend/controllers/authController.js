import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user (Customer or Worker)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    address,
    coordinates, // Array: [lng, lat]
    // Worker fields
    skills,
    experience,
    serviceArea,
    hourlyRate,
    description,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return res.json({ message: 'User already exists' });
    }

    // Set coordinates default if not passed or invalid
    const parsedCoordinates =
      Array.isArray(coordinates) && coordinates.length === 2
        ? [Number(coordinates[0]), Number(coordinates[1])]
        : [0, 0];

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phoneNumber: phoneNumber || '',
      address: address || '',
      location: {
        type: 'Point',
        coordinates: parsedCoordinates,
      },
    });

    if (user) {
      // If role is worker, create WorkerProfile record
      if (user.role === 'worker') {
        const parsedSkills = Array.isArray(skills)
          ? skills
          : skills
          ? skills.split(',').map((s) => s.trim())
          : ['General Handyman'];

        await WorkerProfile.create({
          user: user._id,
          skills: parsedSkills,
          experience: Number(experience) || 0,
          serviceArea: serviceArea || address || 'Local City',
          hourlyRate: Number(hourlyRate) || 20,
          description: description || '',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        location: user.location,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      res.json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Get worker profile details if worker
      let workerInfo = null;
      if (user.role === 'worker') {
        workerInfo = await WorkerProfile.findOne({ user: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        location: user.location,
        avatar: user.avatar,
        workerProfile: workerInfo,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      res.json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      let workerProfile = null;
      if (user.role === 'worker') {
        workerProfile = await WorkerProfile.findOne({ user: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        location: user.location,
        avatar: user.avatar,
        workerProfile,
      });
    } else {
      res.status(404);
      res.json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.coordinates) {
        user.location = {
          type: 'Point',
          coordinates: [Number(req.body.coordinates[0]), Number(req.body.coordinates[1])],
        };
      }

      const updatedUser = await user.save();

      // If user is worker, update worker details too
      let workerProfile = null;
      if (updatedUser.role === 'worker') {
        workerProfile = await WorkerProfile.findOne({ user: updatedUser._id });

        if (workerProfile) {
          if (req.body.skills) {
            workerProfile.skills = Array.isArray(req.body.skills)
              ? req.body.skills
              : req.body.skills.split(',').map((s) => s.trim());
          }
          if (req.body.experience !== undefined) {
            workerProfile.experience = Number(req.body.experience);
          }
          if (req.body.serviceArea !== undefined) {
            workerProfile.serviceArea = req.body.serviceArea;
          }
          if (req.body.serviceRadius !== undefined) {
            workerProfile.serviceRadius = Number(req.body.serviceRadius);
          }
          if (req.body.hourlyRate !== undefined) {
            workerProfile.hourlyRate = Number(req.body.hourlyRate);
          }
          if (req.body.description !== undefined) {
            workerProfile.description = req.body.description;
          }
          if (req.body.availability !== undefined) {
            workerProfile.availability = {
              ...workerProfile.availability,
              ...req.body.availability,
            };
          }

          await workerProfile.save();
        }
      }

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        location: updatedUser.location,
        avatar: updatedUser.avatar,
        workerProfile,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      res.json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
