import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
