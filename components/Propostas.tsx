import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SyncIcon } from './icons/SyncIcon';
import { SearchIcon } from './icons/SearchIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { SortIndicatorIcon } from './icons/SortIndicatorIcon';
import Toast from './Toast';
import Modal from './Modal';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PackageIcon } from './icons/PackageIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { PencilIcon } from './icons/PencilIcon';
import { UserIcon } from './icons/UserIcon';
import { MachineIcon } from './icons/MachineIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { CsvIcon } from './icons/CsvIcon';
import { PdfIcon } from './icons/PdfIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MailIcon } from './icons/MailIcon';
import { generateText } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

type ProposalStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
type SyncStatus = 'idle' | 'syncing' | 'success';
type CustomerStatus = 'Active' | 'Lead' | 'Inactive';

interface Proposal {
  id: string; // Oportunidade ID
  date: string;
  opportunity: string;
  customerName: string;
  observations: string;
  deliveryDeadline: string;
  status: ProposalStatus;
  machine: string;
  totalValue: number;
  salesperson: string;
}

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ContactPerson {
    name: string;
    role: string;
}

interface Customer {
  id: string;
  name: string;
  contactPeople: ContactPerson[];
  country: string;
  email: string;
  phone: string;
  salesperson: string;
  status: CustomerStatus;
}

const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Moldes RP', contactPeople: [{ name: 'Ricardo Pereira', role: 'CEO' }], country: 'Portugal', email: 'ricardo.p@moldesrp.pt', phone: '+351 244 123 456', salesperson: 'João Chanoca', status: 'Active' },
  { id: 'CUST-002', name: 'Injetec', contactPeople: [{ name: 'Sofia Costa', role: 'Compras' }, { name: 'Manuel Dias', role: 'Produção' }], country: 'Portugal', email: 'sofia.c@injetec.pt', phone: '+351 244 789 123', salesperson: 'João Chanoca', status: 'Active' },
  { id: 'CUST-003', name: 'Precision Tools', contactPeople: [{ name: 'André Martins', role: 'Gerente' }], country: 'Espanha', email: 'andre.m@precision-tools.com', phone: '+34 912 345 678', salesperson: 'João Chanoca', status: 'Lead' },
  { id: 'CUST-004', name: 'Metalúrgica Central', contactPeople: [{ name: 'Carla Dias', role: 'Administração' }], country: 'Portugal', email: 'carla.d@metalurgica-central.pt', phone: '+351 239 987 654', salesperson: 'João Chanoca', status: 'Inactive' },
  { id: 'CUST-005', name: 'CNC Solutions', contactPeople: [{ name: 'Bruno Alves', role: 'Engenharia' }], country: 'Portugal', email: 'bruno.a@cncsolutions.pt', phone: '+351 244 321 654', salesperson: 'João Chanoca', status: 'Lead' },
  { id: 'CUST-006', name: 'Polimoldes', contactPeople: [{ name: 'Teresa Mendes', role: 'Diretora Técnica' }], country: 'Portugal', email: 'teresa.m@polimoldes.pt', phone: '+351 244 654 987', salesperson: 'João Chanoca', status: 'Active' },
];

const mockProposals: Proposal[] = [
    { id: 'PROP-2024-001', date: '2024-06-15', opportunity: 'Fornecimento de Centro de Fresagem WEIDA', customerName: 'Moldes RP', observations: 'Cliente necessita de upgrade de equipamento para aumentar produção de moldes complexos.', deliveryDeadline: '2024-08-30', status: 'Sent', machine: 'WEIDA GMILL 850', totalValue: 155000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-002', date: '2024-05-20', opportunity: 'Upgrade de injetora CHEN HSONG', customerName: 'Injetec', observations: 'Proposta para substituição de injetora antiga por modelo mais eficiente energeticamente.', deliveryDeadline: '2024-07-15', status: 'Accepted', machine: 'CHEN HSONG JM268-MK6', totalValue: 85000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-003', date: '2024-06-25', opportunity: 'Sistema de medição on-machine', customerName: 'Precision Tools', observations: 'Reduzir tempo de setup e controlo de qualidade manual. Demonstração agendada.', deliveryDeadline: '2024-09-01', status: 'Draft', machine: 'HAMOO Probe + Laser', totalValue: 12500, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-004', date: '2024-04-10', opportunity: 'Solução de corte automático ZODEL', customerName: 'Metalúrgica Central', observations: 'Proposta rejeitada. Cliente optou por solução concorrente com preço inferior.', deliveryDeadline: '2024-06-10', status: 'Rejected', machine: 'ZODEL GZK4232', totalValue: 48000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-005', date: '2024-03-01', opportunity: 'Proposta de Retificação HDCNC', customerName: 'CNC Solutions', observations: 'Cliente adiou investimento. Fazer follow-up no Q4.', deliveryDeadline: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Expired', machine: 'HDCNC SGA-3063AHD', totalValue: 62000, salesperson: 'João Chanoca' },
];

const getUpdatedProposalData = (): Proposal[] => [
    { id: 'PROP-2024-001', date: '2024-06-15', opportunity: 'Fornecimento de Centro de Fresagem WEIDA', customerName: 'Moldes RP', observations: 'Cliente necessita de upgrade de equipamento para aumentar produção de moldes complexos. PO recebido.', deliveryDeadline: '2024-08-30', status: 'Accepted', machine: 'WEIDA GMILL 850', totalValue: 155000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-002', date: '2024-05-20', opportunity: 'Upgrade de injetora CHEN HSONG', customerName: 'Injetec', observations: 'Proposta para substituição de injetora antiga por modelo mais eficiente energeticamente.', deliveryDeadline: '2024-07-15', status: 'Accepted', machine: 'CHEN HSONG JM268-MK6', totalValue: 85000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-003', date: '2024-06-28', opportunity: 'Sistema de medição on-machine', customerName: 'Precision Tools', observations: 'Reduzir tempo de setup e controlo de qualidade manual. Proposta enviada após demo.', deliveryDeadline: '2024-09-01', status: 'Sent', machine: 'HAMOO Probe + Laser', totalValue: 12500, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-005', date: '2024-03-01', opportunity: 'Proposta de Retificação HDCNC', customerName: 'CNC Solutions', observations: 'Cliente adiou investimento. Fazer follow-up no Q4.', deliveryDeadline: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Expired', machine: 'HDCNC SGA-3063AHD', totalValue: 62000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-006', date: '2024-06-29', opportunity: 'Torno Vertical DONGS VTC 850', customerName: 'Polimoldes', observations: 'Novo projeto para peças de grande dimensão. Proposta em elaboração.', deliveryDeadline: '2024-09-20', status: 'Draft', machine: 'DONGS VTC 850', totalValue: 210000, salesperson: 'João Chanoca' },
];

const emptyProposal: Omit<Proposal, 'id' | 'date' | 'status'> = {
  opportunity: '',
  customerName: '',
  observations: '',
  deliveryDeadline: '',
  machine: '',
  totalValue: 0,
  salesperson: 'João Chanoca',
};

const compareProposalData = (oldData: Proposal[], newData: Proposal[]) => {
    const oldIds = new Map(oldData.map(p => [p.id, p]));
    const newIds = new Map(newData.map(p => [p.id, p]));
    let added = 0, updated = 0, removed = 0;

    for (const [id, proposal] of newIds.entries()) {
        if (!oldIds.has(id)) {
            added++;
        } else {
            if (JSON.stringify(oldIds.get(id)) !== JSON.stringify(proposal)) {
                updated++;
            }
        }
    }
    for (const id of oldIds.keys()) {
        if (!newIds.has(id)) {
            removed++;
        }
    }
    return { added, updated, removed };
};

const statusStyles: Record<ProposalStatus, { text: string; bg: string }> = {
  Draft: { text: 'text-gray-300', bg: 'bg-gray-500/20' },
  Sent: { text: 'text-blue-400', bg: 'bg-blue-500/10' },
  Accepted: { text: 'text-green-400', bg: 'bg-green-500/10' },
  Rejected: { text: 'text-red-400', bg: 'bg-red-500/10' },
  Expired: { text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof Proposal;
  direction: SortDirection;
}

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
        isActive
          ? 'bg-red-600 text-white'
          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
      }`}
    >
      {label}
    </button>
  );

const SummaryRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return (
        <div className="space-y-3 text-gray-300 font-sans text-sm leading-relaxed">
            {lines.map((line, index) => {
                const processLine = (text: string) => {
                    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
                };

                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    const text = line.replace(/^(\* |- ?)/, '');
                    return (
                        <div key={index} className="flex items-start">
                            <span className="mr-3 text-red-400 mt-1">&#8226;</span>
                            <p className="flex-1" dangerouslySetInnerHTML={{ __html: processLine(text) }} />
                        </div>
                    );
                }
                
                return <p key={index} dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
            })}
        </div>
    );
};

const Propostas: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'date', direction: 'descending' });
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  const [newProposalData, setNewProposalData] = useState(emptyProposal);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isConfirmingSync, setIsConfirmingSync] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [proposalForSummary, setProposalForSummary] = useState<Proposal | null>(null);


  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionMenu(null);
      }
    };
    if (activeActionMenu) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeActionMenu]);


  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ id: Date.now(), message, type });
  };

  const handleSync = () => {
    if (syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    showToast('Sincronização iniciada...', 'info');
    
    setTimeout(() => {
        const newProposalData = getUpdatedProposalData();
        const changes = compareProposalData(proposals, newProposalData);
        
        setProposals(newProposalData);
        setLastSyncTime(new Date());
        setSyncStatus('success');

        const messageParts = [];
        if (changes.added > 0) messageParts.push(`${changes.added} adicionada(s)`);
        if (changes.updated > 0) messageParts.push(`${changes.updated} atualizada(s)`);
        if (changes.removed > 0) messageParts.push(`${changes.removed} removida(s)`);
        
        const feedbackMessage = messageParts.length > 0
            ? `Sincronização concluída: ${messageParts.join(', ')}.`
            : 'Sincronização concluída. Sem alterações.';

        showToast(feedbackMessage, 'success');

        setTimeout(() => setSyncStatus('idle'), 3000);
    }, 1500);
  };

  const handleConfirmSync = () => {
    setIsConfirmingSync(false);
    handleSync();
  };

  const requestSort = (key: keyof Proposal) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredProposals = useMemo(() => {
    let result = [...proposals];
    
    if (statusFilter !== 'All') {
        result = result.filter(proposal => proposal.status === statusFilter);
    }

    if (searchTerm) {
      const searchKeywords = searchTerm.toLowerCase().split(' ').filter(kw => kw.trim() !== '');
      if (searchKeywords.length > 0) {
        result = result.filter(proposal => {
          const searchableText = [
            proposal.id,
            proposal.opportunity,
            proposal.customerName,
            proposal.machine,
            proposal.salesperson,
            proposal.observations
          ].join(' ').toLowerCase();
          
          return searchKeywords.every(keyword => searchableText.includes(keyword));
        });
      }
    }
    
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'date' || sortConfig.key === 'deliveryDeadline') {
            const dateA = new Date(aValue as string).getTime();
            const dateB = new Date(bValue as string).getTime();
            
            // Gracefully handle invalid dates by pushing them to the end of the list
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;

            return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }

        const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return result;
  }, [proposals, searchTerm, sortConfig, statusFilter]);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-PT');
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
  const isOverdue = (proposal: Proposal) => new Date(proposal.deliveryDeadline) < new Date() && proposal.status !== 'Accepted' && proposal.status !== 'Rejected';

  const handleEditClick = (proposal: Proposal, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProposal({ ...proposal });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProposal) return;
    const { name, value } = e.target;
    setEditingProposal(prev => prev ? { ...prev, [name]: name === 'totalValue' ? parseFloat(value) || 0 : value } : null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProposal) return;
    
    setProposals(prevProposals => 
      prevProposals.map(p => p.id === editingProposal.id ? editingProposal : p)
    );

    showToast(`Proposta "${editingProposal.opportunity}" atualizada.`, 'success');
    setEditingProposal(null);
  };

  const handleNewProposalFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProposalData(prev => ({ ...prev, [name]: name === 'totalValue' ? parseFloat(value) || 0 : value }));
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const highestIdNum = proposals.reduce((max, p) => {
        const num = parseInt(p.id.split('-')[2], 10);
        return num > max ? num : max;
    }, 0);

    const newProposal: Proposal = {
        id: `PROP-2024-${String(highestIdNum + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Draft',
        ...newProposalData,
    };
    setProposals(prev => [newProposal, ...prev]);
    showToast(`Proposta "${newProposal.opportunity}" criada como rascunho.`, 'success');
    setIsCreatingProposal(false);
    setNewProposalData(emptyProposal);
  };
  
  const handleStatusChange = (proposalId: string, newStatus: ProposalStatus) => {
    setProposals(prevProposals =>
        prevProposals.map(p =>
            p.id === proposalId ? { ...p, status: newStatus } : p
        )
    );
    showToast(`Proposta marcada como "${newStatus}".`, 'success');
    if (selectedProposal?.id === proposalId) {
        setSelectedProposal(null); // Close modal if open
    }
    setActiveActionMenu(null); // Close dropdown
  };

  const handleSendEmail = (proposal: Proposal) => {
    const customer = mockCustomers.find(c => c.name === proposal.customerName);
    const recipientEmail = customer ? customer.email : ''; // Leave empty if not found, user can fill it in.

    const subject = `Proposta GOTEC: ${proposal.opportunity} (${proposal.id})`;

    const formattedValue = formatCurrency(proposal.totalValue);
    const proposalLink = `https://www.gotec.pt/proposals/view/${proposal.id}`;

    const body = `Caro(a) ${proposal.customerName},

Na sequência da nossa conversa, envio os detalhes da nossa proposta.

ID da Proposta: ${proposal.id}
Oportunidade: ${proposal.opportunity}
Máquina/Solução: ${proposal.machine}
Valor Total: ${formattedValue}

Pode consultar a proposta completa online aqui:
${proposalLink}

Estamos à sua inteira disposição para qualquer esclarecimento.

Com os melhores cumprimentos,

---
GOTEC — Transferência Tecnológica

João Chanoca
Mobile: +351 910 929 257
E-mail: joao.chanoca@gotec.pt
Site: http://www.gotec.pt
`;
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    showToast(`A abrir o cliente de email para a proposta ${proposal.id}.`, 'info');
  };

  const handleExportCSV = () => {
    const proposalsToExport = sortedAndFilteredProposals;
    if (proposalsToExport.length === 0) {
        showToast('Nenhuma proposta para exportar.', 'info');
        return;
    }

    const headers = ['ID', 'Data Oportunidade', 'Cliente', 'Observações', 'Prazo de Entrega', 'Estado', 'Máquina', 'Valor Total', 'Comercial'];
    const csvRows = [headers.join(',')];

    for (const proposal of proposalsToExport) {
        const values = [
            `"${proposal.id.replace(/"/g, '""')}"`,
            formatDate(proposal.date),
            `"${proposal.customerName.replace(/"/g, '""')}"`,
            `"${proposal.observations.replace(/"/g, '""')}"`,
            formatDate(proposal.deliveryDeadline),
            proposal.status,
            `"${proposal.machine.replace(/"/g, '""')}"`,
            proposal.totalValue,
            `"${proposal.salesperson.replace(/"/g, '""')}"`
        ];
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `gotec_propostas_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exportação CSV iniciada.', 'success');
  };

  const handleExportPDF = () => {
      const proposalsToExport = sortedAndFilteredProposals;
      if (proposalsToExport.length === 0) {
          showToast('Nenhuma proposta para exportar.', 'info');
          return;
      }

      const date = new Date().toLocaleString('pt-PT');
      let htmlContent = `
          <html>
          <head>
              <title>Relatório de Propostas GOTEC</title>
              <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 2rem; color: #333; }
                  h1 { color: #c00; border-bottom: 2px solid #c00; padding-bottom: 5px; }
                  p { color: #555; font-size: 12px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 11px; white-space: nowrap; }
                  th { background-color: #f2f2f2; font-weight: 600; }
                  tr:nth-child(even) { background-color: #f9f9f9; }
                  .currency { text-align: right; }
                  @media print {
                      body { margin: 1cm; }
                  }
              </style>
          </head>
          <body>
              <h1>Relatório de Propostas GOTEC</h1>
              <p>Gerado em: ${date}</p>
              <table>
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Data Oport.</th>
                          <th>Cliente</th>
                          <th>Estado</th>
                          <th class="currency">Valor Total</th>
                      </tr>
                  </thead>
                  <tbody>
      `;

      for (const proposal of proposalsToExport) {
          htmlContent += `
              <tr>
                  <td>${proposal.id}</td>
                  <td>${formatDate(proposal.date)}</td>
                  <td>${proposal.customerName}</td>
                  <td>${proposal.status}</td>
                  <td class="currency">${formatCurrency(proposal.totalValue)}</td>
              </tr>
          `;
      }

      htmlContent += `
                  </tbody>
              </table>
          </body>
          </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
              printWindow.print();
              printWindow.close();
          }, 250);
          showToast('A preparar a impressão do PDF.', 'success');
      } else {
          showToast('Não foi possível abrir a janela de impressão. Verifique bloqueadores de pop-up.', 'error');
      }
  };

    const handleGenerateSummary = async (proposal: Proposal) => {
        setProposalForSummary(proposal);
        setIsGeneratingSummary(true);
        setSummaryResult(null);

        const prompt = `Gera um resumo conciso da seguinte proposta de vendas, para uma revisão interna rápida.
    Destaca os pontos-chave, de preferência em bullet points.

    - **Cliente:** ${proposal.customerName}
    - **Oportunidade:** ${proposal.opportunity}
    - **Máquina/Solução:** ${proposal.machine}
    - **Valor Total:** ${formatCurrency(proposal.totalValue)}
    - **Estado Atual:** ${proposal.status}
    - **Observações:** ${proposal.observations}

    Resume esta informação de forma clara e breve.
        `;

        try {
        const summary = await generateText(prompt);
        setSummaryResult(summary);
        } catch (error) {
        console.error("Failed to generate summary:", error);
        setSummaryResult("Lamentamos, mas não foi possível gerar um resumo neste momento. Por favor, tente novamente mais tarde.");
        showToast("Erro ao gerar resumo.", "error");
        } finally {
        setIsGeneratingSummary(false);
        }
    };

  const tableHeaders: { key: keyof Proposal | 'actions', label: string, sortable: boolean }[] = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'date', label: 'Data Oportunidade', sortable: true },
      { key: 'customerName', label: 'Cliente', sortable: true },
      { key: 'observations', label: 'Observações', sortable: true },
      { key: 'deliveryDeadline', label: 'Prazo de Entrega', sortable: true },
      { key: 'status', label: 'Estado', sortable: true },
      { key: 'machine', label: 'Máquina', sortable: true },
      { key: 'totalValue', label: 'Valor Total', sortable: true },
      { key: 'salesperson', label: 'Comercial', sortable: true },
      { key: 'actions', label: 'Acções', sortable: false },
  ];

  const ActionButton: React.FC<{ proposal: Proposal, newStatus: ProposalStatus, label: string }> = ({ proposal, newStatus, label }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            handleStatusChange(proposal.id, newStatus);
        }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-red-600 hover:text-white"
    >
        {label}
    </button>
  );

  const getRowStyle = (status: ProposalStatus) => {
    switch (status) {
        case 'Accepted':
            return 'bg-green-900/20 hover:bg-green-800/40';
        case 'Rejected':
            return 'bg-red-900/20 hover:bg-red-800/40';
        case 'Expired':
            return 'bg-yellow-900/20 hover:bg-yellow-800/40';
        default:
            return 'hover:bg-gray-700/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <DocumentIcon className="w-8 h-8 mr-3 text-red-500" />
              Gestão de Propostas
            </h2>
            <p className="text-gray-400 mt-1">
              Acompanhe o ciclo de vida das suas propostas comerciais.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col-reverse sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center px-3 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400 text-sm"
                    title="Exportar como CSV"
                >
                    <CsvIcon className="h-4 w-4 mr-2" />
                    CSV
                </button>
                <button
                    onClick={handleExportPDF}
                    className="flex items-center justify-center px-3 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400 text-sm"
                    title="Exportar como PDF"
                >
                    <PdfIcon className="h-4 w-4 mr-2" />
                    PDF
                </button>
                 <button
                    onClick={() => setIsConfirmingSync(true)}
                    disabled={syncStatus === 'syncing'}
                    className={`flex items-center justify-center px-3 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                    ${
                        syncStatus === 'syncing' ? 'bg-gray-500 cursor-not-allowed text-white' :
                        syncStatus === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white' :
                        'bg-gray-600 hover:bg-gray-500 focus:ring-gray-400 text-white'
                    }`}
                    title="Sincronizar Propostas"
                >
                    {syncStatus === 'syncing' ? <SpinnerIcon className="animate-spin h-5 w-5" /> :
                     syncStatus === 'success' ? <CheckIcon className="h-5 w-5" /> :
                     <SyncIcon className="h-5 w-5" />}
                </button>
            </div>
             <button
                onClick={() => setIsCreatingProposal(true)}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
             >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nova Proposta
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 my-4">
            <div className="relative rounded-md shadow-sm flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 bg-gray-700 py-2 pl-10 text-white ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm"
                placeholder="Pesquisar por Cliente, Máquina, etc. (ex: 'Moldes RP WEIDA')"
                />
            </div>
            <div className="flex items-center gap-2 flex-wrap bg-gray-700/50 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-400">Estado:</span>
              {(['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'] as const).map(s => (
                <FilterButton key={s} label={s} isActive={statusFilter === s} onClick={() => setStatusFilter(s)} />
              ))}
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                {tableHeaders.map(({key, label, sortable}) => (
                  <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {sortable ? (
                      <button onClick={() => requestSort(key as keyof Proposal)} className="flex items-center group focus:outline-none">
                        {label}
                        <SortIndicatorIcon direction={sortConfig?.key === key ? sortConfig.direction : undefined} />
                      </button>
                    ) : (
                      label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedAndFilteredProposals.length > 0 ? (
                sortedAndFilteredProposals.map((proposal) => (
                  <tr 
                    key={proposal.id} 
                    className={`transition-colors cursor-pointer ${getRowStyle(proposal.status)}`}
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{proposal.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(proposal.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{proposal.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 max-w-xs truncate">{proposal.observations}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isOverdue(proposal) ? 'text-red-400 font-semibold' : 'text-gray-300'}`}>{formatDate(proposal.deliveryDeadline)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[proposal.status].bg} ${statusStyles[proposal.status].text}`}>
                            {proposal.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{proposal.machine}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">{formatCurrency(proposal.totalValue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{proposal.salesperson}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1 relative">
                            <button onClick={(e) => { e.stopPropagation(); handleGenerateSummary(proposal); }} className="text-gray-400 hover:text-purple-400 p-1 rounded-full transition-colors" title="Gerar Resumo com IA"><SparklesIcon className="w-5 h-5"/></button>
                            <button onClick={(e) => { e.stopPropagation(); setSelectedProposal(proposal); }} className="text-gray-400 hover:text-blue-500 p-1 rounded-full transition-colors" title="Ver Detalhes"><EyeIcon className="w-5 h-5"/></button>
                            <button onClick={(e) => handleEditClick(proposal, e)} className="text-gray-400 hover:text-yellow-500 p-1 rounded-full transition-colors" title="Editar"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveActionMenu(activeActionMenu === proposal.id ? null : proposal.id); }} className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors" title="Mais Acções"><EllipsisVerticalIcon className="w-5 h-5"/></button>
                            {activeActionMenu === proposal.id && (
                                <div ref={actionMenuRef} className="absolute right-0 top-full mt-2 w-48 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10 overflow-hidden">
                                    <div className="py-1">
                                        <p className="px-4 py-2 text-xs text-gray-400">Alterar Estado</p>
                                        {proposal.status !== 'Sent' && proposal.status !== 'Accepted' && <ActionButton proposal={proposal} newStatus="Sent" label="Marcar como Enviada" />}
                                        {proposal.status !== 'Accepted' && <ActionButton proposal={proposal} newStatus="Accepted" label="Marcar como Aceite" />}
                                        {proposal.status !== 'Rejected' && <ActionButton proposal={proposal} newStatus="Rejected" label="Marcar como Rejeitada" />}
                                    </div>
                                    <div className="border-t border-gray-600"></div>
                                    <div className="py-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSendEmail(proposal);
                                                setActiveActionMenu(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-red-600 hover:text-white flex items-center"
                                        >
                                            <MailIcon className="w-4 h-4 mr-2" />
                                            Enviar por Email
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-6 py-4 text-center text-gray-400">
                    Nenhuma proposta encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProposal && (
        <Modal title="Detalhes da Proposta" onClose={() => setSelectedProposal(null)}>
          <div className="text-gray-300 space-y-6">
            <div>
              <p className="text-sm text-red-400 font-semibold">{selectedProposal.id}</p>
              <h3 className="text-xl font-bold text-white">{selectedProposal.opportunity}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-b border-gray-700 py-4">
                <div className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-red-500" /><div><p className="text-gray-400">Cliente</p><p className="text-white">{selectedProposal.customerName}</p></div></div>
                <div className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-red-500" /><div><p className="text-gray-400">Comercial</p><p className="text-white">{selectedProposal.salesperson}</p></div></div>
                <div className="flex items-center"><CalendarIcon className="w-5 h-5 mr-3 text-red-500" /><div><p className="text-gray-400">Data da Proposta</p><p className="text-white">{formatDate(selectedProposal.date)}</p></div></div>
                <div className="flex items-center"><CalendarIcon className="w-5 h-5 mr-3 text-red-500" /><div><p className="text-gray-400">Prazo de Entrega</p><p className={`text-white ${isOverdue(selectedProposal) ? 'text-red-400' : ''}`}>{formatDate(selectedProposal.deliveryDeadline)}</p></div></div>
                 <div className="bg-gray-900/50 p-3 rounded-md">
                    <p className="text-gray-400 font-semibold">Valor Total</p>
                    <p className="text-white text-lg">{formatCurrency(selectedProposal.totalValue)}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-md">
                    <p className="text-gray-400 font-semibold">Estado</p>
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusStyles[selectedProposal.status].bg} ${statusStyles[selectedProposal.status].text}`}>
                        {selectedProposal.status}
                    </span>
                </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2 flex items-center"><MachineIcon className="w-5 h-5 mr-2 text-red-500"/>Máquina</h4>
              <p className="text-sm bg-gray-900/50 p-3 rounded-md">{selectedProposal.machine}</p>
            </div>
             <div>
              <h4 className="font-semibold text-white mb-2">Observações</h4>
              <p className="text-sm bg-gray-900/50 p-3 rounded-md whitespace-pre-wrap">{selectedProposal.observations}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-between items-center gap-3">
            <div className="flex flex-wrap justify-start gap-3">
              {selectedProposal.status !== 'Sent' && selectedProposal.status !== 'Accepted' && (
                  <button
                      onClick={() => handleStatusChange(selectedProposal.id, 'Sent')}
                      className="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 text-sm"
                  >
                      Marcar como Enviada
                  </button>
              )}
              {selectedProposal.status !== 'Accepted' && (
                  <button
                      onClick={() => handleStatusChange(selectedProposal.id, 'Accepted')}
                      className="px-4 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 text-sm"
                  >
                      Marcar como Aceite
                  </button>
              )}
              {selectedProposal.status !== 'Rejected' && (
                  <button
                      onClick={() => handleStatusChange(selectedProposal.id, 'Rejected')}
                      className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 text-sm"
                  >
                      Marcar como Rejeitada
                  </button>
              )}
            </div>
             <button
                onClick={() => handleSendEmail(selectedProposal)}
                className="px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400 text-sm flex items-center"
              >
                <MailIcon className="w-5 h-5 mr-2" />
                Enviar por Email
              </button>
          </div>
        </Modal>
      )}

      {editingProposal && (
        <Modal title="Editar Proposta" onClose={() => setEditingProposal(null)}>
           <form onSubmit={handleSaveEdit} className="space-y-4">
                <input type="text" name="opportunity" value={editingProposal.opportunity} onChange={handleEditFormChange} placeholder="Oportunidade" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
                <input type="text" name="customerName" value={editingProposal.customerName} onChange={handleEditFormChange} placeholder="Cliente" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
                <textarea name="observations" value={editingProposal.observations} onChange={handleEditFormChange} placeholder="Observações" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" rows={3}></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" name="date" value={editingProposal.date} onChange={handleEditFormChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" style={{colorScheme: 'dark'}} required />
                    <input type="date" name="deliveryDeadline" value={editingProposal.deliveryDeadline} onChange={handleEditFormChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" style={{colorScheme: 'dark'}} required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <select name="status" value={editingProposal.status} onChange={handleEditFormChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required>
                        {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" name="machine" value={editingProposal.machine} onChange={handleEditFormChange} placeholder="Máquina" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="totalValue" value={editingProposal.totalValue} onChange={handleEditFormChange} placeholder="Valor Total" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
                    <input type="text" name="salesperson" value={editingProposal.salesperson} onChange={handleEditFormChange} placeholder="Comercial" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
                </div>
                <div className="flex justify-end gap-4 pt-6">
                  <button type="button" onClick={() => setEditingProposal(null)} className="px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700">Guardar Alterações</button>
                </div>
          </form>
        </Modal>
      )}

       {isCreatingProposal && (
        <Modal title="Criar Nova Proposta" onClose={() => setIsCreatingProposal(false)}>
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <input type="text" name="opportunity" value={newProposalData.opportunity} onChange={handleNewProposalFormChange} placeholder="Oportunidade" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
            <input type="text" name="customerName" value={newProposalData.customerName} onChange={handleNewProposalFormChange} placeholder="Nome do Cliente" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
            <textarea name="observations" value={newProposalData.observations} onChange={handleNewProposalFormChange} placeholder="Observações" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" rows={3}></textarea>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400">Prazo de Entrega</label>
                    <input type="date" name="deliveryDeadline" value={newProposalData.deliveryDeadline} onChange={handleNewProposalFormChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" style={{colorScheme: 'dark'}} required />
                </div>
                <input type="text" name="machine" value={newProposalData.machine} onChange={handleNewProposalFormChange} placeholder="Máquina" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white self-end" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" step="any" name="totalValue" value={newProposalData.totalValue} onChange={handleNewProposalFormChange} placeholder="Valor Total (€)" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
                <input type="text" name="salesperson" value={newProposalData.salesperson} onChange={handleNewProposalFormChange} placeholder="Comercial" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
            </div>
            <div className="flex justify-end gap-4 pt-6">
              <button type="button" onClick={() => setIsCreatingProposal(false)} className="px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700">Criar Proposta</button>
            </div>
          </form>
        </Modal>
      )}

      {isConfirmingSync && (
        <Modal title="Confirmar Sincronização" onClose={() => setIsConfirmingSync(false)}>
          <div>
            <p className="text-gray-300 mb-6">
              Tem a certeza que deseja sincronizar os dados das propostas? Esta ação irá buscar os dados mais recentes e atualizar a sua lista local.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmingSync(false)}
                className="px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSync}
                className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700"
              >
                Confirmar e Sincronizar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {proposalForSummary && (
        <Modal title={`Resumo IA para ${proposalForSummary.id}`} onClose={() => setProposalForSummary(null)}>
            {isGeneratingSummary ? (
                <div className="flex items-center justify-center p-8">
                    <SpinnerIcon className="animate-spin h-8 w-8 text-red-500" />
                    <p className="ml-4 text-gray-300">A gerar resumo...</p>
                </div>
            ) : (
                <SummaryRenderer content={summaryResult || "Não foi possível carregar o resumo."} />
            )}
        </Modal>
        )}
    </div>
  );
};

export default Propostas;