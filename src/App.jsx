import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SavedJobs from './components/SavedJobs.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EstimatedSalary from './pages/EstimatedSalary.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Create a separate file for NavLink component
const CustomNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

// Separate router content component
const AppRoutes = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-blue-400 text-xl font-bold">InternFinder</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-2">
                <CustomNavLink to="/">🏠 Home</CustomNavLink>
                <CustomNavLink to="/dashboard">📊 Dashboard</CustomNavLink>
                <CustomNavLink to="/saved">💾 Saved Jobs</CustomNavLink>
                <CustomNavLink to="/salary">💰 Salary</CustomNavLink>
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <button 
                  onClick={logout}
                  className="ml-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-300"
                >
                  🚪 Logout
                </button>
              ) : (
                <Link to="/login" className="ml-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-700 bg-gray-800">
          <div className="grid grid-cols-4 gap-1 p-2">
            <CustomNavLink to="/">🏠 Home</CustomNavLink>
            <CustomNavLink to="/dashboard">📊 Dashboard</CustomNavLink>
            <CustomNavLink to="/saved">💾 Saved</CustomNavLink>
            <CustomNavLink to="/salary">💰 Salary</CustomNavLink>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/salary" element={<EstimatedSalary />} />
        </Routes>
      </main>
      
      <footer className="bg-gray-950 text-gray-400 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-lg font-semibold text-white mr-2">InternFinder</span>
              <span className="text-sm">© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <Router basename="/jobhunt">
      <AppRoutes />
    </Router>
  );
};

export default App;