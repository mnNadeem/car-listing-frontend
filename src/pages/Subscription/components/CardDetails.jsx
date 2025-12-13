import { useRef } from 'react';
import './CardDetails.css';

function CardDetails({ cardDetails, onCardChange }) {
  const cardNumberRef = useRef(null);
  const expiryRef = useRef(null);
  const cvcRef = useRef(null);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');

    if (value.length > 16) {
      value = value.slice(0, 16);
    }

    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');

    onCardChange('number', formatted);

    if (value.length === 16) {
      expiryRef.current?.focus();
    }
  };

  const isExpiryInPast = (month, year) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (year < currentYear) {
      return true;
    }
    if (year === currentYear && month < currentMonth) {
      return true;
    }
    return false;
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\//g, '').replace(/\D/g, '');

    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    if (value.length >= 2) {
      let month = parseInt(value.slice(0, 2), 10);
      if (month > 12) {
        value = '12' + value.slice(2);
      } else if (month === 0) {
        value = '01' + value.slice(2);
      }
    }

    if (value.length === 4) {
      const month = parseInt(value.slice(0, 2), 10);
      const year = parseInt(value.slice(2, 4), 10);
      
      if (isExpiryInPast(month, year)) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear() % 100;
        
        if (year < currentYear) {
          value = value.slice(0, 2) + String(currentYear).padStart(2, '0');
        } else if (year === currentYear && month < currentMonth) {
          value = String(currentMonth).padStart(2, '0') + value.slice(2);
        }
      }
    }

    let formatted = value;
    if (value.length > 2) {
      formatted = value.slice(0, 2) + '/' + value.slice(2);
    }

    onCardChange('expiry', formatted);

    if (formatted.length === 5) {
      cvcRef.current?.focus();
    }
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 3) {
      value = value.slice(0, 3);
    }

    onCardChange('cvc', value);
  };

  const handleExpiryKeyDown = (e) => {
    if (e.key === 'Backspace' && cardDetails.expiry.length === 3) {
      e.preventDefault();
      onCardChange('expiry', cardDetails.expiry.slice(0, 2));
    }
  };

  return (
    <section className="section">
      <h2 className="section-title">Add card details</h2>
      <div className="card-input-container">
        <div className="card-icon">
          <svg viewBox="0 0 32 24" fill="none" width="32" height="24" aria-hidden="true">
            <rect x="1" y="2" width="30" height="20" rx="3" fill="#e6e6e6" />
            <rect x="4" y="6" width="24" height="3" rx="1.5" fill="#a3bdd1" />
            <rect x="4" y="14" width="6" height="4" rx="1" fill="#a3bdd1" />
            <rect x="12" y="14" width="10" height="4" rx="1" fill="#a3bdd1" />
          </svg>
        </div>
        <input
          ref={cardNumberRef}
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 1234 5678"
          maxLength={19}
          className="card-input card-number"
          value={cardDetails.number}
          onChange={handleCardNumberChange}
        />
        <input
          ref={expiryRef}
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="MM/YY"
          className="card-input card-expiry"
          value={cardDetails.expiry}
          onChange={handleExpiryChange}
          onKeyDown={handleExpiryKeyDown}
        />
        <input
          ref={cvcRef}
          type="text"
          inputMode="numeric"
          maxLength={3}
          placeholder="CVC"
          className="card-input card-cvc"
          value={cardDetails.cvc}
          onChange={handleCvcChange}
        />
      </div>
      <p className="card-notice">
        You will not be charged right now. Subscription will only start once your
        listing is published and live.
      </p>
    </section>
  );
}

export default CardDetails;
