# Car Listing Frontend

A modern React application for car listing subscription management. This application guides users through a multi-step process to set up their subscription plan, configure devices, and enable easy access features.

## 🚀 Features

- **Multi-step Form Wizard**: Guided flow through Subscription → Devices → Easy Access
- **Subscription Plans**: Choose between Just Mates (Free), Good Mates ($10/mo), and Best Mates ($30/mo)
- **Add-on Selection**: Optional add-ons based on selected plan
- **Card Details**: Secure card input with formatting and validation
- **Device Management**: Configure up to 4 devices with serial numbers and image uploads
- **Animated Transitions**: Smooth show/hide animations for form sections
- **Persistent State**: Data saved to localStorage for session persistence
- **Responsive Design**: Mobile-first design with adaptive layouts
- **Toast Notifications**: User-friendly error and success messages

## 🛠️ Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **React Testing Library** - Component testing utilities
- **ESLint & Prettier** - Code quality and formatting

## 📁 Project Structure

```
src/
├── __tests__/                 # Unit tests
│   ├── setup.js               # Test configuration
│   ├── test-utils.jsx         # Custom render utilities
│   ├── store/                 # Redux slice tests
│   └── components/            # Component tests
├── assets/                    # Static assets (logo, images)
├── components/
│   └── layout/                # Layout components
│       ├── Header.jsx         # App header with navigation
│       ├── Sidebar.jsx        # Step navigation sidebar
│       ├── Footer.jsx         # Footer with Next button
│       └── Layout.jsx         # Main layout wrapper
├── pages/
│   ├── Subscription/          # Subscription page
│   │   ├── components/        # Plan selector, add-ons, card details
│   │   ├── data.js            # Plans and add-ons configuration
│   │   └── SubscriptionPage.jsx
│   ├── Devices/               # Device management page
│   │   ├── components/        # Device card component
│   │   └── DevicesPage.jsx
│   └── EasyAccess/            # Easy access page
│       └── EasyAccessPage.jsx
├── store/                     # Redux store
│   ├── store.js               # Store configuration
│   ├── hooks.js               # Typed Redux hooks
│   ├── subscriptionSlice.js   # Subscription state
│   └── devicesSlice.js        # Devices state
├── utils/
│   └── toast.js               # Toast notification utilities
├── App.jsx                    # Root component with routes
├── main.jsx                   # App entry point
└── index.css                  # Global styles

e2e/                           # End-to-end tests
├── subscription.spec.js       # Subscription flow tests
├── devices.spec.js            # Device management tests
└── complete-flow.spec.js      # Full user journey tests
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd car-listing-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Open Playwright UI mode |
| `npm run test:e2e:report` | View E2E test report |

## 🧪 Testing

### Unit Tests

The project includes comprehensive unit tests using Vitest and React Testing Library:

- **Redux Slices**: Tests for all reducers and selectors
- **Components**: Tests for CardDetails, DeviceCard, Footer
- **Integration**: App rendering and routing tests

Run unit tests:
```bash
npm run test:run
```

### End-to-End Tests

E2E tests cover the complete user journey using Playwright:

- Subscription page flow
- Device management
- Complete multi-step flow
- Error handling and validation

Run E2E tests:
```bash
npm run test:e2e
```

## 📱 User Flow

### 1. Subscription Page (`/`)
- Select a subscription plan
- Choose optional add-ons (based on plan)
- Enter card details (for paid plans)
- Click "Next" to proceed

### 2. Devices Page (`/devices`)
- Toggle "Bringing your own device?" for each device
- Enter serial number for enabled devices
- Upload device image
- At least one device must be configured
- Click "Next" to proceed

### 3. Easy Access Page (`/easy-access`)
- View setup completion status
- Review next steps

## 🎨 Design Features

- **Custom Museo Sans Font**: Professional typography
- **Teal Color Scheme**: Primary brand color (#00a699)
- **Animated Sections**: Smooth height transitions with opacity fade
- **Responsive Grid**: Adapts from desktop to mobile layouts
- **Toast Notifications**: Non-intrusive error/success feedback

## 🔧 Configuration

### Environment Variables

The app uses Vite's environment variable system. Create a `.env` file for custom configuration:

```env
VITE_API_URL=your-api-url
```

### ESLint

ESLint is configured with React-specific rules. Configuration in `eslint.config.js`.

### Prettier

Code formatting rules are defined in `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 📊 State Management

The app uses Redux Toolkit for state management with two main slices:

### Subscription Slice
- `selectedPlan` - Currently selected plan ID
- `selectedAddons` - Array of selected add-on IDs
- `cardDetails` - Card number, expiry, CVC
- `isCompleted` - Whether subscription step is complete

### Devices Slice
- `devices` - Array of 4 device objects
- `isCompleted` - Whether devices step is complete

Both slices persist data to localStorage for session continuity.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using React and Vite
