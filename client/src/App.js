// Import React modules
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from 'react-router-dom';

// Hooks
import { AuthProvider } from './contexts/AuthContext';

// COMPONENTS:
import Layout from './components/layout/Layout';
import { ToastContainer } from 'react-toastify';

// PAGES:
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Auth/Dashboard';
import CurrencyMenu from './pages/Currency/CurrencyMenu';
import CryptoMenu from './pages/Crypto/CryptoMenu';


function App() {
  return (
    <div className="app">
      {/* TOAST is a popup component to display Errors */}
      <ToastContainer style={{ textAlign: "center" }} 
        position="top-center"
      />
      <Router>
        <AuthProvider>
        <Routes>
          {/* MAIN LAYOUT WRAPPER & ROUTED CHILDREN */}
          <Route path="/" element={<Layout />}>
            {/* NOTE: If the parent route matched exactly, it will render a child INDEX route or nothing if there is no index route */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            {/* AUTH */}
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* NESTED CURRENCY: API */}
            <Route path="currency">
              <Route path="prices" element={<CurrencyMenu />} />
            </Route>

            {/* NESTED CRYPTO: EXTERNAL API */}
            <Route path="crypto">
              <Route path="prices" element={<CryptoMenu />}/>   
            </Route>
            {/* NOT FOUND */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;