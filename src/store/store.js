import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add your slices here
    // example: exampleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
  devTools: import.meta.env.DEV,
});

export default store;

