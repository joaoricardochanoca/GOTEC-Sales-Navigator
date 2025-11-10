import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SalesCopilot from './components/SalesCopilot';
import ROICalculator from './components/ROICalculator';
import KnowledgeBase from './components/KnowledgeBase';
import VisitPlanner from './components/VisitPlanner';
import Empresas from './components/Empresas';
import Produtos from './components/Produtos';
import Propostas from './components/Propostas';
import Maquinas from './components/Maquinas';
import type { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');

  const renderView = () => {
    switch (view) {
      case 'copilot':
        return <SalesCopilot />;
      case 'roi':
        return <ROICalculator />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'visitPlanner':
        return <VisitPlanner />;
      case 'empresas':
        return <Empresas />;
      case 'produtos':
        return <Produtos setView={setView} />;
      case 'propostas':
        return <Propostas />;
      case 'maquinas':
        return <Maquinas />;
      case 'dashboard':
      default:
        return <Dashboard setView={setView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header view={view} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;