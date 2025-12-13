import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'devices';

const initialDevices = [
  {
    id: 1,
    type: 'Primary GPS',
    isOwn: false,
    serialNumber: '',
    image: null,
  },
  {
    id: 2,
    type: 'Secondary GPS',
    isOwn: false,
    serialNumber: '',
    image: null,
  },
  {
    id: 3,
    type: 'Drive mate Go',
    isOwn: false,
    serialNumber: '',
    image: null,
  },
  {
    id: 4,
    type: 'Lockbox',
    isOwn: false,
    serialNumber: '',
    image: null,
  },
];

// Load initial state from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load devices from localStorage:', error);
  }
  return null;
};

// Save state to localStorage
const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save devices to localStorage:', error);
  }
};

const defaultState = {
  devices: initialDevices,
  isCompleted: false,
};

const storedState = loadFromStorage();

const initialState = storedState || defaultState;

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    toggleDeviceOwn: (state, action) => {
      const { deviceId, isOwn } = action.payload;
      const device = state.devices.find((d) => d.id === deviceId);
      if (device) {
        device.isOwn = isOwn;
        // Clear serial and image when toggling off
        if (!isOwn) {
          device.serialNumber = '';
          device.image = null;
        }
      }
      state.isCompleted = false;
      saveToStorage(state);
    },
    updateSerialNumber: (state, action) => {
      const { deviceId, serialNumber } = action.payload;
      const device = state.devices.find((d) => d.id === deviceId);
      if (device) {
        device.serialNumber = serialNumber;
      }
      state.isCompleted = false;
      saveToStorage(state);
    },
    updateDeviceImage: (state, action) => {
      const { deviceId, image } = action.payload;
      const device = state.devices.find((d) => d.id === deviceId);
      if (device) {
        device.image = image;
      }
      state.isCompleted = false;
      saveToStorage(state);
    },
    setDevicesCompleted: (state, action) => {
      state.isCompleted = action.payload;
      saveToStorage(state);
    },
    resetDevices: (state) => {
      Object.assign(state, defaultState);
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const {
  toggleDeviceOwn,
  updateSerialNumber,
  updateDeviceImage,
  setDevicesCompleted,
  resetDevices,
} = devicesSlice.actions;

// Selectors
export const selectDevices = (state) => state.devices.devices;
export const selectIsDevicesCompleted = (state) => state.devices.isCompleted;
export const selectHasOwnDevice = (state) =>
  state.devices.devices.some((device) => device.isOwn);

export default devicesSlice.reducer;
