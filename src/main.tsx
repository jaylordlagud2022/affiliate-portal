
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(
  <div style={{ width: "1235px", margin: "0 auto" }}>
    <App />
  </div>
);