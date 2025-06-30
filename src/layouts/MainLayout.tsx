import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EmergencyModal from '../components/emergency/EmergencyModal';
import { useEmergencyModal } from '../hooks/useEmergencyModal';

const MainLayout: React.FC = () => {
  const { isOpen, openModal, closeModal } = useEmergencyModal();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onEmergencyClick={openModal} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {isOpen && <EmergencyModal onClose={closeModal} />}
    </div>
  );
};

export default MainLayout;