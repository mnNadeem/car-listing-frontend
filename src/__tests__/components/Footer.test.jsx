import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Footer from '../../components/layout/Footer';

vi.mock('../../utils/toast', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Next button', () => {
      renderWithProviders(<Footer />);
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });
  });

  describe('Subscription Page Validation', () => {
    it('should disable Next button when no plan is selected', () => {
      renderWithProviders(<Footer />, {
        preloadedState: {
          subscription: {
            selectedPlan: '',
            selectedAddons: [],
            cardDetails: { number: '', expiry: '', cvc: '' },
            isCompleted: false,
          },
          devices: {
            devices: [],
            isCompleted: false,
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should disable Next button when paid plan selected but card details incomplete', () => {
      renderWithProviders(<Footer />, {
        preloadedState: {
          subscription: {
            selectedPlan: 'good-mates',
            selectedAddons: [],
            cardDetails: { number: '', expiry: '', cvc: '' },
            isCompleted: false,
          },
          devices: {
            devices: [],
            isCompleted: false,
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should disable Next button when card number is incomplete', () => {
      renderWithProviders(<Footer />, {
        preloadedState: {
          subscription: {
            selectedPlan: 'good-mates',
            selectedAddons: [],
            cardDetails: {
              number: '1234 5678',
              expiry: '12/25',
              cvc: '123',
            },
            isCompleted: false,
          },
          devices: {
            devices: [],
            isCompleted: false,
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should disable Next button when expiry is incomplete', () => {
      renderWithProviders(<Footer />, {
        preloadedState: {
          subscription: {
            selectedPlan: 'good-mates',
            selectedAddons: [],
            cardDetails: {
              number: '1234 5678 9012 3456',
              expiry: '12',
              cvc: '123',
            },
            isCompleted: false,
          },
          devices: {
            devices: [],
            isCompleted: false,
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should disable Next button when CVC is incomplete', () => {
      renderWithProviders(<Footer />, {
        preloadedState: {
          subscription: {
            selectedPlan: 'good-mates',
            selectedAddons: [],
            cardDetails: {
              number: '1234 5678 9012 3456',
              expiry: '12/25',
              cvc: '12',
            },
            isCompleted: false,
          },
          devices: {
            devices: [],
            isCompleted: false,
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should require card details when addon requires card', () => {
      renderWithProviders(<Footer />, {
        preloadedState: {
          subscription: {
            selectedPlan: 'just-mates',
            selectedAddons: ['byo-gps'],
            cardDetails: { number: '', expiry: '', cvc: '' },
            isCompleted: false,
          },
          devices: {
            devices: [],
            isCompleted: false,
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should show Next button as disabled when no plan selected', () => {
      renderWithProviders(<Footer />, {
        preloadedState: {
          subscription: {
            selectedPlan: '',
            selectedAddons: [],
            cardDetails: { number: '', expiry: '', cvc: '' },
            isCompleted: false,
          },
          devices: {
            devices: [],
            isCompleted: false,
          },
        },
      });

      const button = screen.getByRole('button', { name: 'Next' });
      expect(button).toBeDisabled();
    });
  });
});
