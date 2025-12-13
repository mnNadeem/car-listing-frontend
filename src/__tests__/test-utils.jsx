import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from '../store/subscriptionSlice';
import devicesReducer from '../store/devicesSlice';

// Create a test store with optional preloaded state
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      subscription: subscriptionReducer,
      devices: devicesReducer,
    },
    preloadedState,
  });
}

// Custom render function that wraps components with providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
