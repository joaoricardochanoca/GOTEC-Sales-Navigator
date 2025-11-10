import React, { useState, useMemo, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { SortIndicatorIcon } from './icons/SortIndicatorIcon';
import Toast from './Toast';
import Modal from './Modal';
import { MachineIcon } from './icons/MachineIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { UserIcon } from './icons/UserIcon';
import { EyeIcon } from './icons/EyeIcon';
import { SyncIcon } from './icons/SyncIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';

type MachineStatus = 'Operational' | 'Maintenance' | 'Offline';
type SyncStatus = 'idle' | 'syncing' | 'success';

interface InstalledMachine {
    assetId: string;
    machineModel: string;
    machineBrand: string;
    customerName: string;
    contactPerson: string;
    customerCountry: string;
    customerEmail: string;
    customerPhone: string;
    salesperson: string;
    status: MachineStatus;
}

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const mockInstalledMachines: InstalledMachine[] = [
    { assetId: 'WEIDA-001', machineModel: 'GMILL 850', machineBrand: 'WEIDA', customerName: 'Moldes RP', contactPerson: 'Ricardo Pereira', customerCountry: 'Portugal', customerEmail: 'ricardo.p@moldesrp.pt', customerPhone: '+351 244 123 456', salesperson: 'João Chanoca', status: 'Operational' },
    { assetId: 'ZODEL-001', machineModel: 'GZK4232', machineBrand: 'ZODEL', customerName: 'Metalúrgica Central', contactPerson: 'Carla Dias', customerCountry: 'Portugal', customerEmail: 'carla.d@metalurgica-central.pt', customerPhone: '+351 239 987 654', salesperson: 'João Chanoca', status: 'Operational' },
    { assetId: 'CHENH-001', machineModel: 'JM168-MK6', machineBrand: 'CHEN HSONG', customerName: 'Injetec', contactPerson: 'Sofia Costa', customerCountry: 'Portugal', customerEmail: 'sofia.c@injetec.pt', customerPhone: '+351 244 789 123', salesperson: 'João Chanoca', status: 'Offline' },
    { assetId: 'DONGS-001', machineModel: 'VTC 850', machineBrand: 'DONGS', customerName: 'Polimoldes', contactPerson: 'Teresa Mendes', customerCountry: 'Portugal', customerEmail: 'teresa.m@polimoldes.pt', customerPhone: '+351 244 654 987', salesperson: 'João Chanoca', status: 'Maintenance' },
    { assetId: 'HDCNC-001', machineModel: 'SGA-3063AHD', machineBrand: 'HDCNC', customerName: 'CNC Solutions', contactPerson: 'Bruno Alves', customerCountry: 'Portugal', customerEmail: 'bruno.a@cncsolutions.pt', customerPhone: '+351 244 321 654', salesperson: 'João Chanoca', status: 'Operational' },
];

const getUpdatedInstalledMachinesData = (): InstalledMachine[] => [
    { assetId: 'WEIDA-001', machineModel: 'GMILL 850', machineBrand: 'WEIDA', customerName: 'Moldes RP', contactPerson: 'Ricardo Pereira', customerCountry: 'Portugal', customerEmail: 'ricardo.p@moldesrp.pt', customerPhone: '+351 244 123 456', salesperson: 'João Chanoca', status: 'Operational' },
    { assetId: 'CHENH-001', machineModel: 'JM168-MK6', machineBrand: 'CHEN HSONG', customerName: 'Injetec', contactPerson: 'Sofia Costa', customerCountry: 'Portugal', customerEmail: 'sofia.c@injetec.pt', customerPhone: '+351 244 789 123', salesperson: 'João Chanoca', status: 'Operational' }, // Status updated from Offline
    { assetId: 'DONGS-001', machineModel: 'VTC 850', machineBrand: 'DONGS', customerName: 'Polimoldes', contactPerson: 'Teresa Mendes', customerCountry: 'Portugal', customerEmail: 'teresa.m@polimoldes.pt', customerPhone: '+351 244 654 987', salesperson: 'João Chanoca', status: 'Operational' }, // Status updated from Maintenance
    { assetId: 'HDCNC-001', machineModel: 'SGA-3063AHD', machineBrand: 'HDCNC', customerName: 'CNC Solutions', contactPerson: 'Bruno Alves', customerCountry: 'Portugal', customerEmail: 'bruno.a@cncsolutions.pt', customerPhone: '+351 244 321 654', salesperson: 'João Chanoca', status: 'Operational' },
    { assetId: 'NOVICK-001', machineModel: 'A5 Wire EDM', machineBrand: 'NOVICK', customerName: 'Precision Tools', contactPerson: 'André Martins', customerCountry: 'Espanha', customerEmail: 'andre.m@precision-tools.com', customerPhone: '+34 912 345 678', salesperson: 'João Chanoca', status: 'Operational' }, // New machine
    // ZODEL-001 is removed.
];

const compareMachineData = (oldData: InstalledMachine[], newData: InstalledMachine[]) => {
    const oldIds = new Map(oldData.map(m => [m.assetId, m]));
    const newIds = new Map(newData.map(m => [m.assetId, m]));
    let added = 0, updated = 0, removed = 0;

    for (const [id, machine] of newIds.entries()) {
        if (!oldIds.has(id)) {
            added++;
        } else {
            if (JSON.stringify(oldIds.get(id)) !== JSON.stringify(machine)) {
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

const statusStyles: Record<MachineStatus, { dot: string; text: string; bg: string }> = {
  Operational: { dot: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10' },
  Maintenance: { dot: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  Offline: { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10' },
};

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof InstalledMachine;
  direction: SortDirection;
}

const Maquinas: React.FC = () => {
  const [machines, setMachines] = useState<InstalledMachine[]>(mockInstalledMachines);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<InstalledMachine | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isConfirmingSync, setIsConfirmingSync] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ id: Date.now(), message, type });
  };
  
  const handleSync = () => {
    if (syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    showToast('Sincronização iniciada...', 'info');
    
    setTimeout(() => {
        const newMachineData = getUpdatedInstalledMachinesData();
        const changes = compareMachineData(machines, newMachineData);
        
        setMachines(newMachineData);
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

  const requestSort = (key: keyof InstalledMachine) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredMachines = useMemo(() => {
    let result = [...machines];
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(machine =>
        Object.values(machine).some(value =>
          String(value).toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return result;
  }, [machines, searchTerm, sortConfig]);
  
  const tableHeaders: { key: keyof InstalledMachine | 'actions', label: string, sortable: boolean }[] = [
      { key: 'assetId', label: 'ID', sortable: true },
      { key: 'customerName', label: 'Nome do Cliente', sortable: true },
      { key: 'contactPerson', label: 'Contacto', sortable: true },
      { key: 'customerCountry', label: 'País', sortable: true },
      { key: 'customerEmail', label: 'Email', sortable: true },
      { key: 'customerPhone', label: 'Telefone', sortable: true },
      { key: 'salesperson', label: 'Comercial', sortable: true },
      { key: 'status', label: 'Estado da Máquina', sortable: true },
      { key: 'actions', label: 'Acções', sortable: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <MachineIcon className="w-8 h-8 mr-3 text-red-500" />
              Máquinas Instaladas
            </h2>
            <p className="text-gray-400 mt-1">
              Visualize e gira o parque de máquinas nos seus clientes.
            </p>
          </div>
           <div className="mt-4 sm:mt-0 text-center sm:text-right">
            <button
                onClick={() => setIsConfirmingSync(true)}
                disabled={syncStatus === 'syncing'}
                className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                ${
                    syncStatus === 'syncing' ? 'bg-gray-500 cursor-not-allowed text-white' :
                    syncStatus === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white' :
                    'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
                }`}
            >
                {syncStatus === 'syncing' && <SpinnerIcon className="animate-spin h-5 w-5 mr-2" />}
                {syncStatus === 'success' && <CheckIcon className="h-5 w-5 mr-2" />}
                {syncStatus === 'idle' && <SyncIcon className="h-5 w-5 mr-2" />}
                {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'success' ? 'Sincronizado' : 'Sincronizar Parque'}
            </button>
            <p className="text-xs text-gray-500 mt-1 h-4">
                {lastSyncTime ? `Última sinc: ${lastSyncTime.toLocaleString('pt-PT')}` : 'Nunca sincronizado.'}
            </p>
          </div>
        </div>
        
        <div className="my-4">
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 bg-gray-700 py-2 pl-10 text-white ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm"
                placeholder="Pesquisar por ID, cliente, contacto, país..."
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                {tableHeaders.map(({ key, label, sortable }) => (
                  <th key={key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {sortable ? (
                      <button onClick={() => requestSort(key as keyof InstalledMachine)} className="flex items-center group focus:outline-none">
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
              {sortedAndFilteredMachines.length > 0 ? (
                sortedAndFilteredMachines.map((machine) => (
                  <tr key={machine.assetId} className="hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => setSelectedMachine(machine)}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{machine.assetId}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white truncate">{machine.customerName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{machine.contactPerson}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{machine.customerCountry}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{machine.customerEmail}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{machine.customerPhone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{machine.salesperson}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[machine.status].bg} ${statusStyles[machine.status].text}`}>
                            <span className={`h-2 w-2 rounded-full mr-1.5 ${statusStyles[machine.status].dot}`}></span>
                            {machine.status}
                        </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedMachine(machine); }}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                            aria-label={`Ver detalhes de ${machine.machineModel}`}
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-6 py-4 text-center text-gray-400">
                    Nenhuma máquina encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMachine && (
        <Modal title="Detalhes da Máquina Instalada" onClose={() => setSelectedMachine(null)}>
          <div className="text-gray-300 space-y-6">
            <div className="pb-4 border-b border-gray-700">
              <p className="text-sm text-red-400 font-semibold">{selectedMachine.assetId}</p>
              <h3 className="text-xl font-bold text-white">{selectedMachine.machineBrand} {selectedMachine.machineModel}</h3>
            </div>
            
            <div>
                <h4 className="font-semibold text-white mb-2">Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-900/50 p-4 rounded-md">
                    <p className="flex items-center"><UserCircleIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> <span className="truncate">{selectedMachine.customerName}</span></p>
                    <p className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> <span className="truncate">{selectedMachine.contactPerson}</span></p>
                    <p className="flex items-center"><AtSymbolIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> <span className="truncate">{selectedMachine.customerEmail}</span></p>
                    <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {selectedMachine.customerPhone}</p>
                    <p className="flex items-center"><GlobeIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {selectedMachine.customerCountry}</p>
                    <p className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {selectedMachine.salesperson}</p>
                </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Estado da Máquina</h4>
                <div className="bg-gray-900/50 p-3 rounded-md">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusStyles[selectedMachine.status].bg} ${statusStyles[selectedMachine.status].text}`}>
                        <span className={`h-2 w-2 rounded-full mr-1.5 ${statusStyles[selectedMachine.status].dot}`}></span>
                        {selectedMachine.status}
                    </span>
                </div>
            </div>
          </div>
        </Modal>
      )}

      {isConfirmingSync && (
        <Modal title="Confirmar Sincronização" onClose={() => setIsConfirmingSync(false)}>
          <div>
            <p className="text-gray-300 mb-6">
                Tem a certeza que deseja sincronizar os dados das máquinas instaladas? Esta ação irá buscar os dados mais recentes do sistema central e atualizar a sua lista local.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmingSync(false)}
                className="px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSync}
                className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
              >
                Confirmar e Sincronizar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Maquinas;