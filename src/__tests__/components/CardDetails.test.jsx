import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CardDetails from '../../pages/Subscription/components/CardDetails';

describe('CardDetails', () => {
  const defaultProps = {
    cardDetails: {
      number: '',
      expiry: '',
      cvc: '',
    },
    onCardChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all input fields', () => {
    render(<CardDetails {...defaultProps} />);

    expect(screen.getByPlaceholderText('1234 5678 1234 5678')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CVC')).toBeInTheDocument();
  });

  it('should render section title', () => {
    render(<CardDetails {...defaultProps} />);
    expect(screen.getByText('Add card details')).toBeInTheDocument();
  });

  it('should render card notice', () => {
    render(<CardDetails {...defaultProps} />);
    expect(
      screen.getByText(/You will not be charged right now/i)
    ).toBeInTheDocument();
  });

  describe('Card Number Input', () => {
    it('should format card number with spaces on change', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('1234 5678 1234 5678');
      fireEvent.change(input, { target: { value: '1234567812345678' } });

      expect(onCardChange).toHaveBeenCalledWith('number', '1234 5678 1234 5678');
    });

    it('should strip non-numeric characters', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('1234 5678 1234 5678');
      fireEvent.change(input, { target: { value: '12ab34cd' } });

      expect(onCardChange).toHaveBeenCalled();
      const [, value] = onCardChange.mock.calls[0];
      expect(value.replace(/\s/g, '')).toMatch(/^\d+$/);
    });

    it('should limit card number to 16 digits', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('1234 5678 1234 5678');
      fireEvent.change(input, { target: { value: '12345678901234567890' } });

      const [, value] = onCardChange.mock.calls[0];
      const digitsOnly = value.replace(/\s/g, '');
      expect(digitsOnly.length).toBe(16);
    });

    it('should display provided card number value', () => {
      render(
        <CardDetails
          {...defaultProps}
          cardDetails={{ ...defaultProps.cardDetails, number: '1234 5678' }}
        />
      );

      const input = screen.getByPlaceholderText('1234 5678 1234 5678');
      expect(input).toHaveValue('1234 5678');
    });
  });

  describe('Expiry Input', () => {
    it('should format expiry with slash', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('MM/YY');
      fireEvent.change(input, { target: { value: '1225' } });

      expect(onCardChange).toHaveBeenCalledWith('expiry', '12/25');
    });

    it('should limit month to 12', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('MM/YY');
      fireEvent.change(input, { target: { value: '15' } });

      expect(onCardChange).toHaveBeenCalledWith('expiry', '12');
    });

    it('should set month to 01 if 00 entered', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('MM/YY');
      fireEvent.change(input, { target: { value: '00' } });

      expect(onCardChange).toHaveBeenCalledWith('expiry', '01');
    });

    it('should only allow numeric input', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('MM/YY');
      fireEvent.change(input, { target: { value: '12ab' } });

      const [, value] = onCardChange.mock.calls[0];
      const valueWithoutSlash = value.replace(/\//g, '');
      expect(valueWithoutSlash).toMatch(/^\d*$/);
    });

    it('should display provided expiry value', () => {
      render(
        <CardDetails
          {...defaultProps}
          cardDetails={{ ...defaultProps.cardDetails, expiry: '12/25' }}
        />
      );

      const input = screen.getByPlaceholderText('MM/YY');
      expect(input).toHaveValue('12/25');
    });
  });

  describe('CVC Input', () => {
    it('should only allow numeric input', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('CVC');
      fireEvent.change(input, { target: { value: '12a' } });

      const [, value] = onCardChange.mock.calls[0];
      expect(value).toMatch(/^\d*$/);
    });

    it('should limit CVC to 3 digits', () => {
      const onCardChange = vi.fn();
      render(<CardDetails {...defaultProps} onCardChange={onCardChange} />);

      const input = screen.getByPlaceholderText('CVC');
      fireEvent.change(input, { target: { value: '12345' } });

      const [, value] = onCardChange.mock.calls[0];
      expect(value.length).toBe(3);
    });

    it('should display provided CVC value', () => {
      render(
        <CardDetails
          {...defaultProps}
          cardDetails={{ ...defaultProps.cardDetails, cvc: '123' }}
        />
      );

      const input = screen.getByPlaceholderText('CVC');
      expect(input).toHaveValue('123');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle backspace on expiry field correctly', () => {
      const onCardChange = vi.fn();
      render(
        <CardDetails
          cardDetails={{ number: '', expiry: '12/', cvc: '' }}
          onCardChange={onCardChange}
        />
      );

      const input = screen.getByPlaceholderText('MM/YY');
      fireEvent.keyDown(input, { key: 'Backspace' });

      expect(onCardChange).toHaveBeenCalledWith('expiry', '12');
    });
  });
});
