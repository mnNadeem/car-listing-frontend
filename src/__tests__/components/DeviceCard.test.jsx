import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeviceCard from '../../pages/Devices/components/DeviceCard';

// Mock the AnimatedSection component to simplify testing
vi.mock('../../pages/Subscription/components/AnimatedSection', () => ({
  default: ({ show, children }) => (show ? <div data-testid="animated-section">{children}</div> : null),
}));

describe('DeviceCard', () => {
  const defaultProps = {
    deviceNumber: 1,
    deviceType: 'Primary GPS',
    isOwn: false,
    onToggle: vi.fn(),
    serialNumber: '',
    onSerialChange: vi.fn(),
    image: null,
    onImageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render device card with title', () => {
    render(<DeviceCard {...defaultProps} />);
    expect(screen.getByText('Device 1')).toBeInTheDocument();
  });

  it('should render device type', () => {
    render(<DeviceCard {...defaultProps} />);
    expect(screen.getByDisplayValue('Primary GPS')).toBeInTheDocument();
  });

  it('should render toggle switch', () => {
    render(<DeviceCard {...defaultProps} />);
    expect(screen.getByText('Bringing your own device?')).toBeInTheDocument();
  });

  it('should render toggle description', () => {
    render(<DeviceCard {...defaultProps} />);
    expect(
      screen.getByText(/Toggle this on if you're bringing your own device/i)
    ).toBeInTheDocument();
  });

  describe('Toggle Functionality', () => {
    it('should call onToggle when toggle is clicked', async () => {
      const onToggle = vi.fn();
      render(<DeviceCard {...defaultProps} onToggle={onToggle} />);

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it('should call onToggle with false when unchecked', async () => {
      const onToggle = vi.fn();
      render(<DeviceCard {...defaultProps} isOwn={true} onToggle={onToggle} />);

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('should reflect isOwn prop in checkbox state', () => {
      const { rerender } = render(<DeviceCard {...defaultProps} isOwn={false} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();

      rerender(<DeviceCard {...defaultProps} isOwn={true} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('Serial Number Field', () => {
    it('should not show serial number field when isOwn is false', () => {
      render(<DeviceCard {...defaultProps} isOwn={false} />);
      expect(screen.queryByText('Serial number')).not.toBeInTheDocument();
    });

    it('should show serial number field when isOwn is true', () => {
      render(<DeviceCard {...defaultProps} isOwn={true} />);
      expect(screen.getByText('Serial number')).toBeInTheDocument();
    });

    it('should call onSerialChange when serial number is entered', async () => {
      const onSerialChange = vi.fn();
      render(
        <DeviceCard {...defaultProps} isOwn={true} onSerialChange={onSerialChange} />
      );

      const input = screen.getByPlaceholderText('Enter the serial number of the device');
      await userEvent.type(input, 'SN123');

      expect(onSerialChange).toHaveBeenCalled();
    });

    it('should display provided serial number value', () => {
      render(
        <DeviceCard {...defaultProps} isOwn={true} serialNumber="ABC123" />
      );

      const input = screen.getByPlaceholderText('Enter the serial number of the device');
      expect(input).toHaveValue('ABC123');
    });
  });

  describe('Image Upload Field', () => {
    it('should not show image upload when isOwn is false', () => {
      render(<DeviceCard {...defaultProps} isOwn={false} />);
      expect(
        screen.queryByText('Upload an image of the device')
      ).not.toBeInTheDocument();
    });

    it('should show image upload when isOwn is true', () => {
      render(<DeviceCard {...defaultProps} isOwn={true} />);
      expect(screen.getByText('Upload an image of the device')).toBeInTheDocument();
    });

    it('should show "Click to upload" text when no image', () => {
      render(<DeviceCard {...defaultProps} isOwn={true} image={null} />);
      expect(screen.getByText('Click to upload')).toBeInTheDocument();
    });

    it('should show image preview when image is provided', () => {
      render(
        <DeviceCard
          {...defaultProps}
          isOwn={true}
          image="data:image/png;base64,ABC123"
        />
      );
      expect(screen.getByAltText('Device')).toBeInTheDocument();
    });

    it('should show remove button when image is provided', () => {
      render(
        <DeviceCard
          {...defaultProps}
          isOwn={true}
          image="data:image/png;base64,ABC123"
        />
      );
      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    });

    it('should call onImageChange with null when remove is clicked', async () => {
      const onImageChange = vi.fn();
      render(
        <DeviceCard
          {...defaultProps}
          isOwn={true}
          image="data:image/png;base64,ABC123"
          onImageChange={onImageChange}
        />
      );

      const removeButton = screen.getByRole('button', { name: '×' });
      await userEvent.click(removeButton);

      expect(onImageChange).toHaveBeenCalledWith(null);
    });

    it('should handle file selection', async () => {
      const onImageChange = vi.fn();
      render(
        <DeviceCard {...defaultProps} isOwn={true} onImageChange={onImageChange} />
      );

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();

      // Create a mock file
      const file = new File(['test'], 'test.png', { type: 'image/png' });

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadend: null,
        result: 'data:image/png;base64,test',
      };
      vi.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader);

      // Trigger file selection
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Trigger the onloadend callback
      mockFileReader.onloadend();

      await waitFor(() => {
        expect(onImageChange).toHaveBeenCalledWith('data:image/png;base64,test');
      });
    });
  });

  describe('Device Type Variations', () => {
    it('should render with different device types', () => {
      const { rerender } = render(
        <DeviceCard {...defaultProps} deviceType="Secondary GPS" />
      );
      expect(screen.getByDisplayValue('Secondary GPS')).toBeInTheDocument();

      rerender(<DeviceCard {...defaultProps} deviceType="Drive mate Go" />);
      expect(screen.getByDisplayValue('Drive mate Go')).toBeInTheDocument();

      rerender(<DeviceCard {...defaultProps} deviceType="Lockbox" />);
      expect(screen.getByDisplayValue('Lockbox')).toBeInTheDocument();
    });

    it('should render with different device numbers', () => {
      const { rerender } = render(<DeviceCard {...defaultProps} deviceNumber={2} />);
      expect(screen.getByText('Device 2')).toBeInTheDocument();

      rerender(<DeviceCard {...defaultProps} deviceNumber={3} />);
      expect(screen.getByText('Device 3')).toBeInTheDocument();

      rerender(<DeviceCard {...defaultProps} deviceNumber={4} />);
      expect(screen.getByText('Device 4')).toBeInTheDocument();
    });
  });

  describe('Device Type Input', () => {
    it('should have readonly device type input', () => {
      render(<DeviceCard {...defaultProps} />);
      const input = screen.getByDisplayValue('Primary GPS');
      expect(input).toHaveAttribute('readonly');
    });
  });
});
