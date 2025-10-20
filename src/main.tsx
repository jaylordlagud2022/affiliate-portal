import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make layout responsive with a max width, not fixed width
createRoot(document.getElementById('root')!).render(
  <div
    style={{
      maxWidth: '1235px',
      width: '100%',
      margin: '0 auto',
    }}
  >
    <App />
  </div>
);
