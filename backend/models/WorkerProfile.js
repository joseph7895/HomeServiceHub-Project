import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: true },
  },
  { _id: false }
);

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: [
        (val) => val.length > 0,
        'Please list at least one service skill',
      ],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    serviceArea: {
      type: String,
      required: [true, 'Service area name is required'],
      trim: true,
    },
    serviceRadius: {
      type: Number,
      default: 10, // Default service radius in kilometers
      min: [1, 'Service radius must be at least 1 km'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly service rate is required'],
      min: [0, 'Hourly rate cannot be negative'],
    },
    availability: {
      type: availabilitySchema,
      default: () => ({}),
    },
    description: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);

export default WorkerProfile;
