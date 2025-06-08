import React from 'react';
import { FaTasks } from 'react-icons/fa';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <FaTasks className="text-2xl" />
          <h1 className="text-2xl font-bold">TaskFlow</h1>
        </div>
      </div>
    </header>
  );
};