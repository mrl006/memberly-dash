
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initDatabase } from './services/dbService.ts'
import { initializeSettings } from './services/settingsService.ts'

// Initialize database connection
initDatabase()
  .then(() => {
    initializeSettings()
      .catch(error => console.error('Failed to initialize settings:', error));
  })
  .catch(error => console.error('Failed to initialize database:', error));

createRoot(document.getElementById("root")!).render(<App />);

