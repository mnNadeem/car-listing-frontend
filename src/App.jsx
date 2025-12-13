import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout';
import { SubscriptionPage, DevicesPage, EasyAccessPage } from './pages';

function App() {
  return (
    <>
      {/* Toast notifications container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'var(--font-museo)',
          },
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SubscriptionPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="easy-access" element={<EasyAccessPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
