import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import layout
import { DashboardLayout } from './components/DashboardLayout';

// Import pages
import Dashboard from './pages/dashboard';
import EventsList from './pages/EventsList';
import EventForm from './pages/EventForm';
import EventDetails from './pages/EventDetails'; // New import

// Import authentication context and guards
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Import authentication pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/UserProfile';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/events" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <EventsList />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/events/create" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <EventForm />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/events/edit/:id" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <EventForm />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          {/* New route for Event Details */}
          <Route 
            path="/events/:eventId" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <EventDetails />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
};

export default App;