import './EasyAccessPage.css';

function EasyAccessPage() {
  return (
    <div className="easy-access-page">
      <div className="page-header">
        <h1 className="page-title">Easy Access</h1>
        <p className="page-subtitle">
          Configure easy access options for your vehicle listing.
        </p>
      </div>

      <div className="easy-access-content">
        <div className="easy-access-card">
          <div className="easy-access-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="easy-access-card-title">Setup Complete</h3>
          <p className="easy-access-card-description">
            Your device setup is complete. You can now configure additional easy access features for your vehicle.
          </p>
        </div>

        <div className="easy-access-info">
          <h4 className="easy-access-info-title">What&apos;s Next?</h4>
          <ul className="easy-access-list">
            <li>Configure keyless entry options</li>
            <li>Set up remote access features</li>
            <li>Review your device connections</li>
            <li>Test your vehicle&apos;s connectivity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EasyAccessPage;
