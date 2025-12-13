import { describe, it, expect, beforeEach, vi } from 'vitest';
import devicesReducer, {
  toggleDeviceOwn,
  updateSerialNumber,
  updateDeviceImage,
  setDevicesCompleted,
  resetDevices,
  selectDevices,
  selectIsDevicesCompleted,
  selectHasOwnDevice,
} from '../../store/devicesSlice';

describe('devicesSlice', () => {
  const initialDevices = [
    { id: 1, type: 'Primary GPS', isOwn: false, serialNumber: '', image: null },
    { id: 2, type: 'Secondary GPS', isOwn: false, serialNumber: '', image: null },
    { id: 3, type: 'Drive mate Go', isOwn: false, serialNumber: '', image: null },
    { id: 4, type: 'Lockbox', isOwn: false, serialNumber: '', image: null },
  ];

  const initialState = {
    devices: initialDevices,
    isCompleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  describe('reducers', () => {
    it('should return the initial state', () => {
      const state = devicesReducer(undefined, { type: 'unknown' });
      expect(state.devices).toHaveLength(4);
      expect(state.isCompleted).toBe(false);
    });

    describe('toggleDeviceOwn', () => {
      it('should toggle device ownership to true', () => {
        const state = devicesReducer(
          initialState,
          toggleDeviceOwn({ deviceId: 1, isOwn: true })
        );
        const device = state.devices.find((d) => d.id === 1);
        expect(device.isOwn).toBe(true);
      });

      it('should toggle device ownership to false and clear data', () => {
        const stateWithOwn = {
          ...initialState,
          devices: initialState.devices.map((d) =>
            d.id === 1
              ? { ...d, isOwn: true, serialNumber: 'ABC123', image: 'data:image...' }
              : d
          ),
        };
        const state = devicesReducer(
          stateWithOwn,
          toggleDeviceOwn({ deviceId: 1, isOwn: false })
        );
        const device = state.devices.find((d) => d.id === 1);
        expect(device.isOwn).toBe(false);
        expect(device.serialNumber).toBe('');
        expect(device.image).toBeNull();
      });

      it('should reset isCompleted when toggling', () => {
        const completedState = { ...initialState, isCompleted: true };
        const state = devicesReducer(
          completedState,
          toggleDeviceOwn({ deviceId: 1, isOwn: true })
        );
        expect(state.isCompleted).toBe(false);
      });

      it('should save to localStorage', () => {
        devicesReducer(initialState, toggleDeviceOwn({ deviceId: 1, isOwn: true }));
        expect(localStorage.setItem).toHaveBeenCalled();
      });

      it('should not affect other devices', () => {
        const state = devicesReducer(
          initialState,
          toggleDeviceOwn({ deviceId: 1, isOwn: true })
        );
        const otherDevices = state.devices.filter((d) => d.id !== 1);
        otherDevices.forEach((device) => {
          expect(device.isOwn).toBe(false);
        });
      });
    });

    describe('updateSerialNumber', () => {
      it('should update serial number for a device', () => {
        const state = devicesReducer(
          initialState,
          updateSerialNumber({ deviceId: 1, serialNumber: 'SN123456' })
        );
        const device = state.devices.find((d) => d.id === 1);
        expect(device.serialNumber).toBe('SN123456');
      });

      it('should reset isCompleted', () => {
        const completedState = { ...initialState, isCompleted: true };
        const state = devicesReducer(
          completedState,
          updateSerialNumber({ deviceId: 1, serialNumber: 'SN123456' })
        );
        expect(state.isCompleted).toBe(false);
      });

      it('should not update if device not found', () => {
        const state = devicesReducer(
          initialState,
          updateSerialNumber({ deviceId: 999, serialNumber: 'SN123456' })
        );
        expect(state.devices).toEqual(initialState.devices);
      });
    });

    describe('updateDeviceImage', () => {
      it('should update image for a device', () => {
        const imageData = 'data:image/png;base64,ABC123...';
        const state = devicesReducer(
          initialState,
          updateDeviceImage({ deviceId: 1, image: imageData })
        );
        const device = state.devices.find((d) => d.id === 1);
        expect(device.image).toBe(imageData);
      });

      it('should set image to null when clearing', () => {
        const stateWithImage = {
          ...initialState,
          devices: initialState.devices.map((d) =>
            d.id === 1 ? { ...d, image: 'data:image...' } : d
          ),
        };
        const state = devicesReducer(
          stateWithImage,
          updateDeviceImage({ deviceId: 1, image: null })
        );
        const device = state.devices.find((d) => d.id === 1);
        expect(device.image).toBeNull();
      });

      it('should reset isCompleted', () => {
        const completedState = { ...initialState, isCompleted: true };
        const state = devicesReducer(
          completedState,
          updateDeviceImage({ deviceId: 1, image: 'data:image...' })
        );
        expect(state.isCompleted).toBe(false);
      });
    });

    describe('setDevicesCompleted', () => {
      it('should set isCompleted to true', () => {
        const state = devicesReducer(initialState, setDevicesCompleted(true));
        expect(state.isCompleted).toBe(true);
      });

      it('should set isCompleted to false', () => {
        const completedState = { ...initialState, isCompleted: true };
        const state = devicesReducer(completedState, setDevicesCompleted(false));
        expect(state.isCompleted).toBe(false);
      });

      it('should save to localStorage', () => {
        devicesReducer(initialState, setDevicesCompleted(true));
        expect(localStorage.setItem).toHaveBeenCalled();
      });
    });

    describe('resetDevices', () => {
      it('should reset to initial state', () => {
        const modifiedState = {
          devices: initialState.devices.map((d) =>
            d.id === 1
              ? { ...d, isOwn: true, serialNumber: 'SN123', image: 'data:...' }
              : d
          ),
          isCompleted: true,
        };
        const state = devicesReducer(modifiedState, resetDevices());
        expect(state.isCompleted).toBe(false);
        state.devices.forEach((device) => {
          expect(device.isOwn).toBe(false);
          expect(device.serialNumber).toBe('');
          expect(device.image).toBeNull();
        });
      });

      it('should remove from localStorage', () => {
        devicesReducer(initialState, resetDevices());
        expect(localStorage.removeItem).toHaveBeenCalledWith('devices');
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      devices: {
        devices: [
          { id: 1, type: 'Primary GPS', isOwn: true, serialNumber: 'SN123', image: 'data:...' },
          { id: 2, type: 'Secondary GPS', isOwn: false, serialNumber: '', image: null },
          { id: 3, type: 'Drive mate Go', isOwn: true, serialNumber: 'SN456', image: 'data:...' },
          { id: 4, type: 'Lockbox', isOwn: false, serialNumber: '', image: null },
        ],
        isCompleted: true,
      },
    };

    it('selectDevices should return all devices', () => {
      const devices = selectDevices(mockState);
      expect(devices).toHaveLength(4);
      expect(devices[0].type).toBe('Primary GPS');
    });

    it('selectIsDevicesCompleted should return completion status', () => {
      expect(selectIsDevicesCompleted(mockState)).toBe(true);
    });

    it('selectHasOwnDevice should return true if any device is owned', () => {
      expect(selectHasOwnDevice(mockState)).toBe(true);
    });

    it('selectHasOwnDevice should return false if no device is owned', () => {
      const noOwnState = {
        devices: {
          devices: initialDevices,
          isCompleted: false,
        },
      };
      expect(selectHasOwnDevice(noOwnState)).toBe(false);
    });
  });
});
