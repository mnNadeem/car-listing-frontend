import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'subscription';

// Load initial state from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load subscription from localStorage:', error);
  }
  return null;
};

// Save state to localStorage
const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save subscription to localStorage:', error);
  }
};

const defaultState = {
  selectedPlan: '',
  selectedAddons: [],
  cardDetails: {
    number: '',
    expiry: '',
    cvc: '',
  },
  isCompleted: false, // Flag to track if user clicked Next with valid data
};

const storedState = loadFromStorage();

const initialState = storedState || defaultState;

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
      // Clear addons when plan changes
      state.selectedAddons = [];
      // Reset completion when plan changes
      state.isCompleted = false;
      saveToStorage(state);
    },
    setSelectedAddons: (state, action) => {
      state.selectedAddons = action.payload;
      state.isCompleted = false;
      saveToStorage(state);
    },
    toggleAddon: (state, action) => {
      const addonId = action.payload;
      if (state.selectedAddons.includes(addonId)) {
        state.selectedAddons = state.selectedAddons.filter(
          (id) => id !== addonId
        );
      } else {
        state.selectedAddons = [...state.selectedAddons, addonId];
      }
      state.isCompleted = false;
      saveToStorage(state);
    },
    setCardDetails: (state, action) => {
      state.cardDetails = { ...state.cardDetails, ...action.payload };
      state.isCompleted = false;
      saveToStorage(state);
    },
    updateCardField: (state, action) => {
      const { field, value } = action.payload;
      state.cardDetails[field] = value;
      state.isCompleted = false;
      saveToStorage(state);
    },
    setSubscriptionCompleted: (state, action) => {
      state.isCompleted = action.payload;
      saveToStorage(state);
    },
    resetSubscription: (state) => {
      Object.assign(state, defaultState);
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const {
  setSelectedPlan,
  setSelectedAddons,
  toggleAddon,
  setCardDetails,
  updateCardField,
  setSubscriptionCompleted,
  resetSubscription,
} = subscriptionSlice.actions;

// Selectors
export const selectSubscription = (state) => state.subscription;
export const selectSelectedPlan = (state) => state.subscription.selectedPlan;
export const selectSelectedAddons = (state) =>
  state.subscription.selectedAddons;
export const selectCardDetails = (state) => state.subscription.cardDetails;
export const selectIsSubscriptionCompleted = (state) =>
  state.subscription.isCompleted;

export default subscriptionSlice.reducer;
