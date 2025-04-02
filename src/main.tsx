
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initDatabase } from './services/dbService.ts'
import { initializeSettings } from './services/settingsService.ts'
import { initializeUsers } from './services/userService.ts'

// Initialize database and data
const initializeApp = async () => {
  try {
    // First, initialize database connection
    const dbConnected = await initDatabase();
    
    // Then initialize settings and users (even if DB connection failed, this will use localStorage fallback)
    await initializeSettings();
    await initializeUsers();
    
    console.log(`App initialized ${dbConnected ? 'with' : 'without'} database connection`);
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
};

// Initialize first, then render the app
initializeApp().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
