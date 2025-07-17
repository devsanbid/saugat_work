import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideBar from './Sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <SideBar />
        <main className="flex-1 min-h-screen">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
