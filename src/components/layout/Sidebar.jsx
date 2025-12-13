import { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectIsSubscriptionCompleted } from '../../store/subscriptionSlice';
import { selectIsDevicesCompleted } from '../../store/devicesSlice';
import './Sidebar.css';

const baseSidebarItems = [
  { id: 'location', label: 'Location', path: '#', completed: true, disabled: false },
  { id: 'about', label: 'About', path: '#', completed: true, disabled: false },
  { id: 'features', label: 'Features', path: '#', completed: true, disabled: false },
  { id: 'rules', label: 'Rules', path: '#', completed: true, disabled: false },
  { id: 'pricing', label: 'Pricing', path: '#', completed: true, disabled: false },
  { id: 'promotion', label: 'Promotion', path: '#', completed: true, disabled: false },
  { id: 'pictures', label: 'Pictures', path: '#', completed: true, disabled: false },
  { id: 'insurance', label: 'Insurance', path: '#', completed: true, disabled: false },
  { id: 'subscription', label: 'Subscription', path: '/', completed: false },
  { id: 'device', label: 'Device', path: '/devices', completed: false, disabled: true },
  { id: 'easy-access', label: 'Easy Access', path: '/easy-access', completed: false, disabled: true },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSubscriptionCompleted = useAppSelector(selectIsSubscriptionCompleted);
  const isDevicesCompleted = useAppSelector(selectIsDevicesCompleted);

  // Compute sidebar items with dynamic states
  const sidebarItems = useMemo(() => {
    return baseSidebarItems.map((item) => {
      if (item.id === 'subscription') {
        return {
          ...item,
          completed: isSubscriptionCompleted,
        };
      }
      if (item.id === 'device') {
        return {
          ...item,
          disabled: !isSubscriptionCompleted,
          completed: isDevicesCompleted,
        };
      }
      if (item.id === 'easy-access') {
        return {
          ...item,
          disabled: !isDevicesCompleted,
        };
      }
      return item;
    });
  }, [isSubscriptionCompleted, isDevicesCompleted]);

  const handleSelectChange = (e) => {
    const selectedPath = e.target.value;
    const selectedItem = sidebarItems.find((item) => item.path === selectedPath);

    // Only navigate if the item is not disabled
    if (selectedPath && selectedItem && !selectedItem.disabled) {
      navigate(selectedPath);
    }
  };

  return (
    <>
      {/* Mobile select dropdown */}
      <div className="sidebar-mobile">
        <div className="sidebar-select-wrapper">
          <select
            className="sidebar-select"
            value={location.pathname}
            onChange={handleSelectChange}
          >
            {sidebarItems.map((item) => (
              <option
                key={item.id}
                value={item.path}
                disabled={item.disabled}
              >
                {item.label}
              </option>
            ))}
          </select>
          <svg
            className="sidebar-select-arrow"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.disabled ? '#' : item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive && !item.disabled && item.path !== '#' ? 'active' : ''} ${item.disabled ? 'disabled' : ''
                }`
              }
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <span className="sidebar-label">{item.label}</span>
              {item.completed && (
                <svg
                  className="check-icon"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="9" fill="var(--color-primary-text)" />
                  <path
                    d="M6 10l3 3 5-6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
