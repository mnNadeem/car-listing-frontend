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

  const isSubscriptionPage = location.pathname === '/';
  const isDevicesPage = location.pathname === '/devices';
  const isEasyAccessPage = location.pathname === '/easy-access';

  const addonRequiresCard = useMemo(() => {
    return selectedAddons.some((addonId) => addonsRequiringCard.includes(addonId));
  }, [selectedAddons]);

  const requiresCard = useMemo(() => {
    return plansWithCardDetails.includes(selectedPlan) || addonRequiresCard;
  }, [selectedPlan, addonRequiresCard]);

  const validateCardDetails = () => {
    const errors = [];

    const cardNumber = cardDetails.number.replace(/\s/g, '');
    if (!cardNumber) {
      errors.push('Card number is required');
    } else if (cardNumber.length !== 16) {
      errors.push('Card number must be 16 digits');
    }

    if (!cardDetails.expiry) {
      errors.push('Expiry date is required');
    } else if (cardDetails.expiry.length !== 5) {
      errors.push('Expiry date must be in MM/YY format');
    } else {
      const [month, year] = cardDetails.expiry.split('/').map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push('Card has expired');
      }
    }

    if (!cardDetails.cvc) {
      errors.push('CVC is required');
    } else if (cardDetails.cvc.length !== 3) {
      errors.push('CVC must be 3 digits');
    }

    return errors;
  };

  const validateSubscription = () => {
    if (!selectedPlan) {
      showError('Please select a subscription plan');
      return false;
    }

    if (requiresCard) {
      const cardErrors = validateCardDetails();
      if (cardErrors.length > 0) {
        showError(cardErrors[0]);
        return false;
      }
    }

    return true;
  };

  const validateDevices = () => {
    if (!hasOwnDevice) {
      showError('Please enable at least one device you are bringing');
      return false;
    }

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

  const isNextEnabled = useMemo(() => {
    if (isSubscriptionPage) {
      if (!selectedPlan) return false;

      if (requiresCard) {
        const cardNumber = cardDetails.number.replace(/\s/g, '');
        if (cardNumber.length !== 16) return false;
        if (cardDetails.expiry.length !== 5) return false;
        if (cardDetails.cvc.length !== 3) return false;
      }

      return true;
    }

    if (isDevicesPage) {
      if (!hasOwnDevice) return false;

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
      if (validateSubscription()) {
        dispatch(setSubscriptionCompleted(true));
        navigate('/devices');
      }
    } else if (isDevicesPage) {
      if (validateDevices()) {
        dispatch(setDevicesCompleted(true));
        navigate('/easy-access');
      }
    }
  };

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
