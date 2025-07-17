import React, { useState, useContext } from "react";
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  X,
  Menu,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import doko from "../../assets/doko.png";

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: ShoppingBag, path: "dashboard" },
    { id: "products", label: "Products", icon: Package, path: "products" },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "orders" },
    { id: "customers", label: "Customers", icon: Users, path: "customers" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, path: "analytics" },
    { id: "settings", label: "Settings", icon: Settings, path: "settings" },
  ];

  const SidebarItem = ({ icon: Icon, label, active, onClick, path }) => (
    <button
      onClick={() => {
        navigate(`/seller/${path}`);
        onClick();
      }}
      className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-red-50 text-red-600 border-l-4 border-red-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Logout Confirmation Modal
  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Confirm Logout
        </h3>
        
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to log out of your account?
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={cancelLogout}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmLogout}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-30">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <img
                  src={doko}
                  alt="DOKO Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  path={item.path}
                />
              ))}
            </nav>
          </div>

          {/* Logout Section */}
          <div className="p-6 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-600 hover:text-red-500 transition-colors w-full px-4 py-3 rounded-lg hover:bg-gray-50"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo and Close Button */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                  <img
                    src={doko}
                    alt="DOKO Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-800">DOKO</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  path={item.path}
                />
              ))}
            </nav>
          </div>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-600 hover:text-red-500 transition-colors w-full px-4 py-3 rounded-lg hover:bg-gray-50"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && <LogoutModal />}
    </>
  );
};

export default Sidebar;
