import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

export const seedDatabase = async () => {
  try {
    console.log('Checking database status for seeding...');
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('Database already populated. Skipping seeding.');
      return;
    }

    console.log('Database is empty. Seeding initial data...');

    // 1. Create Admins
    const admin = await User.create({
      name: 'Hub Administrator',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      phoneNumber: '+91 98765 43210',
      avatar: '',
      address: 'Connaught Place, New Delhi',
    });

    // 2. Create Customers
    const customer = await User.create({
      name: 'Arjun Mehta',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
      phoneNumber: '+91 91234 56789',
      avatar: '',
      address: 'Bandra West, Mumbai, MH',
      location: {
        type: 'Point',
        coordinates: [72.8224, 19.0596], // Bandra coordinates
      },
    });

    // 3. Create Workers
    const workersData = [
      {
        name: 'Ramesh Kumar',
        email: 'ramesh.k@example.com',
        password: 'password123',
        role: 'worker',
        phoneNumber: '+91 92345 67890',
        avatar: '',
        address: 'Bandra Link Road, Mumbai',
        coordinates: [72.8300, 19.0650],
        profile: {
          skills: ['Plumber', 'Home Repair'],
          experience: 6,
          serviceArea: 'Bandra & Khar',
          serviceRadius: 15,
          hourlyRate: 250,
          description: 'Licensed plumber with over 6 years of experience. Expert in leak detection, pipe fixing, drainage issues, bathroom fitting, and emergency repairs. Prompt and professional.',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: false,
          },
        },
      },
      {
        name: 'Sunita Sharma',
        email: 'sunita.s@example.com',
        password: 'password123',
        role: 'worker',
        phoneNumber: '+91 93456 78901',
        avatar: '',
        address: 'Connaught Place, New Delhi',
        coordinates: [77.2244, 28.6289],
        profile: {
          skills: ['Electrician', 'AC Technician'],
          experience: 9,
          serviceArea: 'Connaught Place & New Delhi',
          serviceRadius: 20,
          hourlyRate: 350,
          description: 'Certified electrical specialist and HVAC service provider. Expert in residential wiring, appliance repairs, breaker panels, and air conditioner servicing.',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
        },
      },
      {
        name: 'Amit Patel',
        email: 'amit.p@example.com',
        password: 'password123',
        role: 'worker',
        phoneNumber: '+91 94567 89012',
        avatar: '',
        address: 'Andheri East, Mumbai',
        coordinates: [72.8550, 19.1130],
        profile: {
          skills: ['Carpenter', 'Home Repair'],
          experience: 5,
          serviceArea: 'Andheri & Vile Parle',
          serviceRadius: 10,
          hourlyRate: 200,
          description: 'Experienced carpenter for general home woodwork and repairs. Specializing in doors, modular kitchen cabinets, lock repairs, and custom shelving.',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
        },
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.s@example.com',
        password: 'password123',
        role: 'worker',
        phoneNumber: '+91 95678 90123',
        avatar: '',
        address: 'Karol Bagh, New Delhi',
        coordinates: [77.2090, 28.6139],
        profile: {
          skills: ['Painter', 'Home Repair'],
          experience: 4,
          serviceArea: 'Karol Bagh & Rajendra Nagar',
          serviceRadius: 12,
          hourlyRate: 180,
          description: 'Professional interior and exterior house painter. Specialized in wall prep, texture designs, wall putty, and high-quality paint finishing.',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: false,
          },
        },
      },
      {
        name: 'Rajesh Rao',
        email: 'rajesh.r@example.com',
        password: 'password123',
        role: 'worker',
        phoneNumber: '+91 96789 01234',
        avatar: '',
        address: 'Gachibowli, Hyderabad',
        coordinates: [78.3489, 17.4483],
        profile: {
          skills: ['Electrician'],
          experience: 7,
          serviceArea: 'Gachibowli & Hyderabad',
          serviceRadius: 15,
          hourlyRate: 300,
          description: 'Expert residential and commercial electrician based in Hyderabad. 7 years experience in house wiring, repairs, and appliance installations.',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
        },
      },
      {
        name: 'Suresh Reddy',
        email: 'suresh.r@example.com',
        password: 'password123',
        role: 'worker',
        phoneNumber: '+91 97890 12345',
        avatar: '',
        address: 'Hanamkonda, Warangal',
        coordinates: [79.5941, 17.9689],
        profile: {
          skills: ['Plumber'],
          experience: 5,
          serviceArea: 'Hanamkonda & Warangal',
          serviceRadius: 10,
          hourlyRate: 220,
          description: 'Professional plumbing services in Warangal. Expert in leak fixes, pipe repairs, drainage cleaning, and sanitary installations.',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: false,
          },
        },
      },
    ];

    for (const data of workersData) {
      // Create user
      const workerUser = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phoneNumber: data.phoneNumber,
        avatar: data.avatar,
        address: data.address,
        location: {
          type: 'Point',
          coordinates: data.coordinates,
        },
      });

      // Create worker profile
      const workerProfile = await WorkerProfile.create({
        user: workerUser._id,
        ...data.profile,
        isApproved: true,
      });

      // 4. Seed a completed booking + review to generate ratings
      const booking = await Booking.create({
        customer: customer._id,
        worker: workerUser._id,
        serviceCategory: data.profile.skills[0],
        bookingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        bookingTime: '10:00 AM - 12:00 PM',
        address: customer.address,
        location: customer.location,
        status: 'completed',
        description: `Need support with general ${data.profile.skills[0].toLowerCase()} repairs in my kitchen area. Please check.`,
        totalAmount: data.profile.hourlyRate * 2,
        notes: 'Job completed successfully and workspace cleaned.',
      });

      // Create Review
      await Review.create({
        booking: booking._id,
        customer: customer._id,
        worker: workerUser._id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 star reviews
        comment: `Highly satisfied with the ${data.profile.skills[0].toLowerCase()} service! Punctual, polite, and resolved all my issues quickly.`,
      });
    }

    console.log('Database successfully seeded with mock data!');
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};
