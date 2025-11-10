import React from 'react';
import { PackageIcon } from './icons/PackageIcon';
import { KnowledgeIcon } from './icons/KnowledgeIcon';
import { ROIIcon } from './icons/ROIIcon';
import type { View } from '../types';

interface ProdutosProps {
  setView: (view: View) => void;
}

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 rounded-lg p-6 text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all transform hover:-translate-y-1 w-full"
  >
    <div className="flex items-center mb-3">
      {icon}
      <h4 className="text-lg font-semibold text-white ml-3">{title}</h4>
    </div>
    <p className="text-sm text-gray-400">{description}</p>
  </button>
);

const Produtos: React.FC<ProdutosProps> = ({ setView }) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-12">
        <PackageIcon className="w-24 h-24 mb-6 text-gray-600" />
        <h2 className="text-3xl font-bold text-white mb-2">Produtos e Ferramentas</h2>
        <p className="max-w-2xl text-gray-400">
          Esta secção irá albergar uma visão geral de todos os produtos GOTEC. Utilize as ferramentas abaixo para explorar o nosso portfólio e criar valor para os seus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ActionCard
          icon={<KnowledgeIcon className="h-8 w-8 text-red-500" />}
          title="Knowledge Base"
          description="Aceda a informações técnicas detalhadas sobre todo o portfólio de produtos e processos."
          onClick={() => setView('knowledge')}
        />
        <ActionCard
          icon={<ROIIcon className="h-8 w-8 text-red-500" />}
          title="ROI Calculator"
          description="Demonstre os benefícios financeiros das soluções GOTEC aos seus clientes de forma clara e eficaz."
          onClick={() => setView('roi')}
        />
      </div>
    </div>
  );
};

export default Produtos;