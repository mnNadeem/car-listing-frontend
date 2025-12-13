import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './__tests__/test-utils';
import App from './App';

describe('App', () => {
  it('renders subscription page by default', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: 'Subscription plan' })).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = renderWithProviders(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders header with logo', () => {
    renderWithProviders(<App />);
    // Multiple logos exist (header + mobile menu), so use getAllByAltText
    const logos = screen.getAllByAltText('Drive lah');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('renders sidebar with navigation items', () => {
    renderWithProviders(<App />);
    // Multiple instances exist (sidebar + mobile select), so use getAllByText
    expect(screen.getAllByText('Subscription').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Device').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Easy Access').length).toBeGreaterThan(0);
  });

  it('renders footer with Next button', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });
});

