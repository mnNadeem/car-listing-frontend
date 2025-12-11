import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

/**
 * Creates a test store with optional preloaded state
 * @param {Object} preloadedState - Initial state for the store
 * @returns {Object} Redux store
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      // Add your reducers here
    },
    preloadedState,
  });
}

/**
 * Custom render function that wraps components with providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result with store
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from '@testing-library/react';
export { renderWithProviders as render };

