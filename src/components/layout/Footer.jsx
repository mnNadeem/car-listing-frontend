import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectSelectedPlan,
  selectSelectedAddons,
  selectCardDetails,
  selectIsSubscriptionCompleted,
  setSubscriptionCompleted,
} from '../../store/subscriptionSlice';
import {
  selectDevices,
  selectHasOwnDevice,
  selectIsDevicesCompleted,
  setDevicesCompleted,
} from '../../store/devicesSlice';
import { plansWithCardDetails, addonsRequiringCard } from '../../pages/Subscription/data';
import { showError } from '../../utils/toast';
import './Footer.css';

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedPlan = useAppSelector(selectSelectedPlan);
  const selectedAddons = useAppSelector(selectSelectedAddons);
  const cardDetails = useAppSelector(selectCardDetails);
  const devices = useAppSelector(selectDevices);
  const hasOwnDevice = useAppSelector(selectHasOwnDevice);
  const isSubscriptionCompleted = useAppSelector(selectIsSubscriptionCompleted);
  const isDevicesCompleted = useAppSelector(selectIsDevicesCompleted);

  // Check page types
  const isSubscriptionPage = location.pathname === '/';
  const isDevicesPage = location.pathname === '/devices';
  const isEasyAccessPage = location.pathname === '/easy-access';

  // Check if any selected addon requires card details
  const addonRequiresCard = useMemo(() => {
    return selectedAddons.some((addonId) => addonsRequiringCard.includes(addonId));
  }, [selectedAddons]);

  // Check if card details are required
  const requiresCard = useMemo(() => {
    return plansWithCardDetails.includes(selectedPlan) || addonRequiresCard;
  }, [selectedPlan, addonRequiresCard]);

  // Validate card details
  const validateCardDetails = () => {
    const errors = [];

    // Card number validation (should be 16 digits, displayed with spaces as "1234 5678 1234 5678")
    const cardNumber = cardDetails.number.replace(/\s/g, '');
    if (!cardNumber) {
      errors.push('Card number is required');
    } else if (cardNumber.length !== 16) {
      errors.push('Card number must be 16 digits');
    }

    // Expiry validation (MM/YY format)
    if (!cardDetails.expiry) {
      errors.push('Expiry date is required');
    } else if (cardDetails.expiry.length !== 5) {
      errors.push('Expiry date must be in MM/YY format');
    } else {
      // Check if expiry is in the past
      const [month, year] = cardDetails.expiry.split('/').map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push('Card has expired');
      }
    }

    // CVC validation (3 digits)
    if (!cardDetails.cvc) {
      errors.push('CVC is required');
    } else if (cardDetails.cvc.length !== 3) {
      errors.push('CVC must be 3 digits');
    }

    return errors;
  };

  // Validate subscription form
  const validateSubscription = () => {
    // Check if plan is selected
    if (!selectedPlan) {
      showError('Please select a subscription plan');
      return false;
    }

    // If card details are required, validate them
    if (requiresCard) {
      const cardErrors = validateCardDetails();
      if (cardErrors.length > 0) {
        // Show first error
        showError(cardErrors[0]);
        return false;
      }
    }

    return true;
  };

  // Validate devices form
  const validateDevices = () => {
    // Check if at least one device is marked as own
    if (!hasOwnDevice) {
      showError('Please enable at least one device you are bringing');
      return false;
    }

    // Validate that all enabled devices have required fields
    const ownDevices = devices.filter((d) => d.isOwn);
    for (const device of ownDevices) {
      if (!device.serialNumber.trim()) {
        showError(`Please enter serial number for ${device.type}`);
        return false;
      }
      if (!device.image) {
        showError(`Please upload an image for ${device.type}`);
        return false;
      }
    }

    return true;
  };

  // Check if next button should be enabled
  const isNextEnabled = useMemo(() => {
    if (isSubscriptionPage) {
      // Must have a plan selected
      if (!selectedPlan) return false;

      // If card is required, check if all fields are filled
      if (requiresCard) {
        const cardNumber = cardDetails.number.replace(/\s/g, '');
        if (cardNumber.length !== 16) return false;
        if (cardDetails.expiry.length !== 5) return false;
        if (cardDetails.cvc.length !== 3) return false;
      }

      return true;
    }

    if (isDevicesPage) {
      // Must have at least one device enabled
      if (!hasOwnDevice) return false;

      // All enabled devices must have serial number and image
      const ownDevices = devices.filter((d) => d.isOwn);
      for (const device of ownDevices) {
        if (!device.serialNumber.trim()) return false;
        if (!device.image) return false;
      }

      return true;
    }

    return true;
  }, [isSubscriptionPage, isDevicesPage, selectedPlan, requiresCard, cardDetails, hasOwnDevice, devices]);

  const handleNextClick = () => {
    if (isSubscriptionPage) {
      // Validate subscription data
      if (validateSubscription()) {
        // Mark subscription as completed and navigate to devices
        dispatch(setSubscriptionCompleted(true));
        navigate('/devices');
      }
    } else if (isDevicesPage) {
      // Validate devices data
      if (validateDevices()) {
        // Mark devices as completed and navigate to easy-access
        dispatch(setDevicesCompleted(true));
        navigate('/easy-access');
      }
    }
  };

  // Hide footer on Easy Access page when both steps are completed
  if (isEasyAccessPage && isSubscriptionCompleted && isDevicesCompleted) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-btn">
          <button
            className={`btn-next ${!isNextEnabled ? 'disabled' : ''}`}
            onClick={handleNextClick}
            disabled={!isNextEnabled}
          >
            Next
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

