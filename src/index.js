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

const stripePromise = loadStripe('pk_test_51OwuO4LcfLzcwwOYdssgGfUSfOgWT1LwO6ewi3CEPewY7WEL9ATqH6WJm3oAcLDA3IgUvVYLVEBMIEu0d8fUwhlw009JwzEYmV');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<SocketProvider>
            <App />
          </SocketProvider>} />
          <Route path="/game"          element={<ProtectedRoute><SocketProvider>
            <GamePage /></SocketProvider></ProtectedRoute>} />
          <Route path="/victory"       element={<ProtectedRoute><SocketProvider>
            <VictoryPage /></SocketProvider></ProtectedRoute>} />
          <Route path="/admin"         element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Elements>
  </React.StrictMode>
);

reportWebVitals();