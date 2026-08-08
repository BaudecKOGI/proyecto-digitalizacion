import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/landing/navigation/PublicNavbar';
import Footer from '@/components/landing/navigation/PublicFooter';
import { AssistantWidget } from '@/components/assistant';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>
      <Footer />
      <AssistantWidget />
    </div>
  );
}
