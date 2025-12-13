import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './subscriptionSlice';
import devicesReducer from './devicesSlice';

export const store = configureStore({
  reducer: {
    subscription: subscriptionReducer,
    devices: devicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
  devTools: import.meta.env.DEV,
});

export default store;

