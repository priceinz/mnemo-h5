import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Override the fixed width/height to be full screen on mobile
const MobileApp = () => {
  const [size, setSize] = React.useState({ w: window.innerWidth, h: window.innerHeight });
  
  React.useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    // Handle mobile viewport changes (keyboard, orientation)
    window.visualViewport?.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      overflow: 'hidden',
    }}>
      <style>{`
        /* Override the app's fixed 375x740 to fill screen */
        #root > div > div {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
      `}</style>
      <App />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<MobileApp />);
