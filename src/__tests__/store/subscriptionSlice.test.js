import { describe, it, expect, beforeEach, vi } from 'vitest';
import subscriptionReducer, {
  setSelectedPlan,
  setSelectedAddons,
  toggleAddon,
  setCardDetails,
  updateCardField,
  setSubscriptionCompleted,
  resetSubscription,
  selectSubscription,
  selectSelectedPlan,
  selectSelectedAddons,
  selectCardDetails,
  selectIsSubscriptionCompleted,
} from '../../store/subscriptionSlice';

describe('subscriptionSlice', () => {
  const initialState = {
    selectedPlan: '',
    selectedAddons: [],
    cardDetails: {
      number: '',
      expiry: '',
      cvc: '',
    },
    isCompleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(subscriptionReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    describe('setSelectedPlan', () => {
      it('should set the selected plan', () => {
        const state = subscriptionReducer(initialState, setSelectedPlan('good-mates'));
        expect(state.selectedPlan).toBe('good-mates');
      });

      it('should clear addons when plan changes', () => {
        const stateWithAddons = {
          ...initialState,
          selectedAddons: ['byo-gps', 'byo-lockbox'],
        };
        const state = subscriptionReducer(stateWithAddons, setSelectedPlan('just-mates'));
        expect(state.selectedAddons).toEqual([]);
      });

      it('should reset isCompleted when plan changes', () => {
        const completedState = { ...initialState, isCompleted: true };
        const state = subscriptionReducer(completedState, setSelectedPlan('best-mates'));
        expect(state.isCompleted).toBe(false);
      });

      it('should save to localStorage', () => {
        subscriptionReducer(initialState, setSelectedPlan('good-mates'));
        expect(localStorage.setItem).toHaveBeenCalled();
      });
    });

    describe('setSelectedAddons', () => {
      it('should set the selected addons', () => {
        const state = subscriptionReducer(
          initialState,
          setSelectedAddons(['byo-gps', 'byo-lockbox'])
        );
        expect(state.selectedAddons).toEqual(['byo-gps', 'byo-lockbox']);
      });

      it('should reset isCompleted', () => {
        const completedState = { ...initialState, isCompleted: true };
        const state = subscriptionReducer(completedState, setSelectedAddons(['byo-gps']));
        expect(state.isCompleted).toBe(false);
      });
    });

    describe('toggleAddon', () => {
      it('should add addon if not selected', () => {
        const state = subscriptionReducer(initialState, toggleAddon('byo-gps'));
        expect(state.selectedAddons).toContain('byo-gps');
      });

      it('should remove addon if already selected', () => {
        const stateWithAddon = {
          ...initialState,
          selectedAddons: ['byo-gps'],
        };
        const state = subscriptionReducer(stateWithAddon, toggleAddon('byo-gps'));
        expect(state.selectedAddons).not.toContain('byo-gps');
      });

      it('should handle multiple addons correctly', () => {
        let state = subscriptionReducer(initialState, toggleAddon('byo-gps'));
        state = subscriptionReducer(state, toggleAddon('byo-lockbox'));
        expect(state.selectedAddons).toEqual(['byo-gps', 'byo-lockbox']);

        state = subscriptionReducer(state, toggleAddon('byo-gps'));
        expect(state.selectedAddons).toEqual(['byo-lockbox']);
      });
    });

    describe('setCardDetails', () => {
      it('should update card details', () => {
        const cardDetails = {
          number: '1234 5678 9012 3456',
          expiry: '12/25',
          cvc: '123',
        };
        const state = subscriptionReducer(initialState, setCardDetails(cardDetails));
        expect(state.cardDetails).toEqual(cardDetails);
      });

      it('should merge with existing card details', () => {
        const stateWithNumber = {
          ...initialState,
          cardDetails: { ...initialState.cardDetails, number: '1234' },
        };
        const state = subscriptionReducer(
          stateWithNumber,
          setCardDetails({ expiry: '12/25' })
        );
        expect(state.cardDetails.number).toBe('1234');
        expect(state.cardDetails.expiry).toBe('12/25');
      });
    });

    describe('updateCardField', () => {
      it('should update a single card field', () => {
        const state = subscriptionReducer(
          initialState,
          updateCardField({ field: 'number', value: '1234 5678' })
        );
        expect(state.cardDetails.number).toBe('1234 5678');
      });

      it('should update expiry field', () => {
        const state = subscriptionReducer(
          initialState,
          updateCardField({ field: 'expiry', value: '12/25' })
        );
        expect(state.cardDetails.expiry).toBe('12/25');
      });

      it('should update cvc field', () => {
        const state = subscriptionReducer(
          initialState,
          updateCardField({ field: 'cvc', value: '123' })
        );
        expect(state.cardDetails.cvc).toBe('123');
      });
    });

    describe('setSubscriptionCompleted', () => {
      it('should set isCompleted to true', () => {
        const state = subscriptionReducer(initialState, setSubscriptionCompleted(true));
        expect(state.isCompleted).toBe(true);
      });

      it('should set isCompleted to false', () => {
        const completedState = { ...initialState, isCompleted: true };
        const state = subscriptionReducer(completedState, setSubscriptionCompleted(false));
        expect(state.isCompleted).toBe(false);
      });
    });

    describe('resetSubscription', () => {
      it('should reset to initial state', () => {
        const modifiedState = {
          selectedPlan: 'best-mates',
          selectedAddons: ['byo-gps'],
          cardDetails: { number: '1234', expiry: '12/25', cvc: '123' },
          isCompleted: true,
        };
        const state = subscriptionReducer(modifiedState, resetSubscription());
        expect(state).toEqual(initialState);
      });

      it('should remove from localStorage', () => {
        subscriptionReducer(initialState, resetSubscription());
        expect(localStorage.removeItem).toHaveBeenCalledWith('subscription');
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      subscription: {
        selectedPlan: 'good-mates',
        selectedAddons: ['byo-gps'],
        cardDetails: { number: '1234', expiry: '12/25', cvc: '123' },
        isCompleted: true,
      },
    };

    it('selectSubscription should return full subscription state', () => {
      expect(selectSubscription(mockState)).toEqual(mockState.subscription);
    });

    it('selectSelectedPlan should return selected plan', () => {
      expect(selectSelectedPlan(mockState)).toBe('good-mates');
    });

    it('selectSelectedAddons should return selected addons', () => {
      expect(selectSelectedAddons(mockState)).toEqual(['byo-gps']);
    });

    it('selectCardDetails should return card details', () => {
      expect(selectCardDetails(mockState)).toEqual({
        number: '1234',
        expiry: '12/25',
        cvc: '123',
      });
    });

    it('selectIsSubscriptionCompleted should return completion status', () => {
      expect(selectIsSubscriptionCompleted(mockState)).toBe(true);
    });
  });
});
