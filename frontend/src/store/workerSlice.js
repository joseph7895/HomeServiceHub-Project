import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workerService } from '../services/api';

const initialState = {
  workers: [],
  currentWorker: null, // Holds { user, profile, reviews }
  loading: false,
  error: null,
  success: false,
};

export const fetchWorkers = createAsyncThunk(
  'workers/fetchWorkers',
  async (params, thunkAPI) => {
    try {
      return await workerService.getWorkers(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchWorkerDetail = createAsyncThunk(
  'workers/fetchWorkerDetail',
  async (id, thunkAPI) => {
    try {
      return await workerService.getWorkerById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateAvailability = createAsyncThunk(
  'workers/updateAvailability',
  async (availabilityData, thunkAPI) => {
    try {
      return await workerService.updateAvailability(availabilityData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const workerSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    clearWorkerState: (state) => {
      state.currentWorker = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workers list
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Worker details
      .addCase(fetchWorkerDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkerDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorker = action.payload;
      })
      .addCase(fetchWorkerDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Availability
      .addCase(updateAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentWorker && state.currentWorker.profile) {
          state.currentWorker.profile.availability = action.payload.availability;
        }
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWorkerState } = workerSlice.actions;
export default workerSlice.reducer;
