import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import workerReducer from './workerSlice';
import bookingReducer from './bookingSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workers: workerReducer,
    bookings: bookingReducer,
    admin: adminReducer,
  },
});

export default store;
