import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SellerApprovalCheck from '../seller/SellerApprovalCheck';

const SellerLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname.split('/').pop();
    return path || 'dashboard';
  };

  const handleApprovalChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Close sidebar when clicking outside or on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      // Only close if sidebar is open and click is outside both sidebar and menu button
      if (sidebarOpen) {
        const sidebar = document.querySelector('.mobile-sidebar');
        const menuButton = document.querySelector('.menu-button');
        
        // Check if click is outside both sidebar and menu button
        if (sidebar && menuButton && 
            !sidebar.contains(event.target) && 
            !menuButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside); // Changed to mousedown
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleTabChange = (tab) => {
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <SellerApprovalCheck onApprovalChange={handleApprovalChange}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar 
          activeTab={getActiveTab()} 
          setActiveTab={handleTabChange}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <div className="lg:ml-64 transition-all duration-300">
          <Header 
            activeTab={getActiveTab()} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SellerApprovalCheck>
  );
};

export default SellerLayout;
