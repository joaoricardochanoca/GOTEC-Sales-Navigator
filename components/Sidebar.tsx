import React from 'react';
import type { View } from '../types';
import { GotecLogo } from './icons/GotecLogo';
import { DashboardIcon } from './icons/DashboardIcon';
import { CopilotIcon } from './icons/CopilotIcon';
import { ROIIcon } from './icons/ROIIcon';
import { KnowledgeIcon } from './icons/KnowledgeIcon';
import { RouteIcon } from './icons/RouteIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { PackageIcon } from './icons/PackageIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { MachineIcon } from './icons/MachineIcon';


interface SidebarProps {
  view: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isSubItem?: boolean;
}> = ({ icon, label, isActive, onClick, isSubItem = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full ${isSubItem ? 'pl-10 pr-4' : 'px-4'} py-3 text-sm font-medium text-left transition-colors duration-200 rounded-lg ${
        isActive
          ? 'bg-red-600 text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ view, setView }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-center h-16 mb-6">
        <GotecLogo className="w-40 h-auto" />
      </div>
      <nav className="flex-1 space-y-1">
        <NavItem
          icon={<DashboardIcon className="h-5 w-5" />}
          label="Dashboard"
          isActive={view === 'dashboard'}
          onClick={() => setView('dashboard')}
        />
        <NavItem
          icon={<RouteIcon className="h-5 w-5" />}
          label="Visit Planner"
          isActive={view === 'visitPlanner'}
          onClick={() => setView('visitPlanner')}
        />
        <NavItem
          icon={<MachineIcon className="h-5 w-5" />}
          label="Máquinas"
          isActive={view === 'maquinas'}
          onClick={() => setView('maquinas')}
        />
        
        <NavItem
          icon={<BuildingIcon className="h-5 w-5" />}
          label="Empresas"
          isActive={view === 'empresas'}
          onClick={() => setView('empresas')}
        />
        
        <NavItem
          icon={<PackageIcon className="h-5 w-5" />}
          label="Produtos"
          isActive={view === 'produtos'}
          onClick={() => setView('produtos')}
        />
        <NavItem
          icon={<KnowledgeIcon className="h-5 w-5" />}
          label="Knowledge Base"
          isActive={view === 'knowledge'}
          onClick={() => setView('knowledge')}
          isSubItem={true}
        />
        <NavItem
          icon={<ROIIcon className="h-5 w-5" />}
          label="ROI Calculator"
          isActive={view === 'roi'}
          onClick={() => setView('roi')}
          isSubItem={true}
        />
        
        <NavItem
          icon={<DocumentIcon className="h-5 w-5" />}
          label="Propostas"
          isActive={view === 'propostas'}
          onClick={() => setView('propostas')}
        />
        <NavItem
          icon={<CopilotIcon className="h-5 w-5" />}
          label="Sales Co-pilot"
          isActive={view === 'copilot'}
          onClick={() => setView('copilot')}
          isSubItem={true}
        />
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>GOTEC Sales Navigator</p>
        <p>&copy; 2024 GOTEC</p>
      </div>
    </aside>
  );
};

export default Sidebar;