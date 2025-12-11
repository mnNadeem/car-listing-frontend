import { Toaster } from 'react-hot-toast';

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

      <div>
        <h1>Hello World</h1>
      </div>
    </>
  );
}

export default App;
