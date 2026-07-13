import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import GamePage from './pages/GamePage';
import VictoryPage from './pages/VictoryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import reportWebVitals from './reportWebVitals';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { SocketProvider } from './context/SocketContext';

const stripePromise = loadStripe('pk_test_51TfwIyLyHmPH8TShvan2dyWF7DJ9jC2M93TLq6k1P3fhfclvkq7oIVQ7s9HIV8Fwn51VW4cu4AF53MwNfaKa20f700VoXWib0l');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            <Route path="/"                  element={<App />} />
            <Route path="/game"              element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
            <Route path="/victory"           element={<ProtectedRoute><VictoryPage /></ProtectedRoute>} />
            <Route path="/admin"             element={<AdminLoginPage />} />
            <Route path="/admin/dashboard"   element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </Elements>

);

reportWebVitals();