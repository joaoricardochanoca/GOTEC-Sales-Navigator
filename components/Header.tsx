import React from 'react';
import type { View } from '../types';
import { UserIcon } from './icons/UserIcon';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface HeaderProps {
  view: View;
}

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  copilot: 'Sales Co-pilot (GSN)',
  roi: 'ROI Calculator',
  knowledge: 'Technical Knowledge Base',
  visitPlanner: 'Visit Planner',
  empresas: 'Empresas',
  produtos: 'Produtos',
  propostas: 'Propostas',
  maquinas: 'Máquinas',
};

const Header: React.FC<HeaderProps> = ({ view }) => {
  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center flex-shrink-0">
      <h1 className="text-xl font-semibold text-white">{viewTitles[view]}</h1>
      <div className="flex items-center space-x-4 text-sm text-gray-300">
        <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span>João Chanoca</span>
        </div>
        <div className="hidden md:flex items-center space-x-2">
            <PhoneIcon className="h-5 w-5" />
            <span>+351 910 929 257</span>
        </div>
         <div className="hidden lg:flex items-center space-x-2">
            <MailIcon className="h-5 w-5" />
            <span>joao.chanoca@gotec.pt</span>
        </div>
      </div>
    </header>
  );
};

export default Header;