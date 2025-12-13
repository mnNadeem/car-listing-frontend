import { useRef } from 'react';
import AnimatedSection from '../../Subscription/components/AnimatedSection';
import './DeviceCard.css';

function DeviceCard({
  deviceNumber,
  deviceType,
  isOwn,
  onToggle,
  serialNumber,
  onSerialChange,
  image,
  onImageChange,
}) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="device-card">
      <h3 className="device-card-title">Device {deviceNumber}</h3>

      <div className="device-card-content">
        <div className="device-left">
          <div className="device-field">
            <label className="device-label">Device type</label>
            <input
              type="text"
              className="device-input"
              value={deviceType}
              readOnly
            />
          </div>

          <AnimatedSection show={isOwn}>
            <div className="device-field device-animated-field">
              <label className="device-label">Serial number</label>
              <input
                type="text"
                className="device-input"
                placeholder="Enter the serial number of the device"
                value={serialNumber}
                onChange={(e) => onSerialChange(e.target.value)}
              />
            </div>
          </AnimatedSection>
        </div>

        <div className="device-right">
          <div className="device-toggle-section">
            <div className="device-toggle-header">
              <span className="device-toggle-label">Bringing your own device?</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isOwn}
                  onChange={(e) => onToggle(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <p className="device-toggle-description">
              Toggle this on if you're bringing your own device. Leave it off if Drive mate is to provide the device.
            </p>
          </div>

          <AnimatedSection show={isOwn}>
            <div className="device-field device-animated-field">
              <label className="device-label">Upload an image of the device</label>
              <div className="device-image-upload" onClick={handleImageClick}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {image ? (
                  <div className="device-image-preview">
                    <img src={image} alt="Device" />
                    <button
                      className="device-image-remove"
                      onClick={handleRemoveImage}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="device-image-text">Click to upload</span>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

export default DeviceCard;
