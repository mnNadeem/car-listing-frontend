import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectDevices,
  toggleDeviceOwn,
  updateSerialNumber,
  updateDeviceImage,
} from '../../store/devicesSlice';
import { DeviceCard } from './components';
import './DevicesPage.css';

function DevicesPage() {
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectDevices);

  const handleToggle = (deviceId, isOwn) => {
    dispatch(toggleDeviceOwn({ deviceId, isOwn }));
  };

  const handleSerialChange = (deviceId, serialNumber) => {
    dispatch(updateSerialNumber({ deviceId, serialNumber }));
  };

  const handleImageChange = (deviceId, image) => {
    dispatch(updateDeviceImage({ deviceId, image }));
  };

  return (
    <div className="devices-page">
      <div className="page-header">
        <h1 className="page-title">Device management</h1>
        <p className="page-subtitle">
          Add details of the device, if any already installed on your car. If none, then continue to next step.
        </p>
      </div>

      <div className="devices-list">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            deviceNumber={device.id}
            deviceType={device.type}
            isOwn={device.isOwn}
            onToggle={(isOwn) => handleToggle(device.id, isOwn)}
            serialNumber={device.serialNumber}
            onSerialChange={(serial) => handleSerialChange(device.id, serial)}
            image={device.image}
            onImageChange={(image) => handleImageChange(device.id, image)}
          />
        ))}
      </div>
    </div>
  );
}

export default DevicesPage;
