import React, { useState, useMemo, useEffect } from 'react';
import { SyncIcon } from './icons/SyncIcon';
import { SearchIcon } from './icons/SearchIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { SortIndicatorIcon } from './icons/SortIndicatorIcon';
import Toast from './Toast';
import Modal from './Modal';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';
import { UserIcon } from './icons/UserIcon';
import { GlobeIcon } from './icons/GlobeIcon';

type CustomerStatus = 'Active' | 'Lead' | 'Inactive';
type SyncStatus = 'idle' | 'syncing' | 'success';

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

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Moldes RP', contactPeople: [{ name: 'Ricardo Pereira', role: 'CEO' }], country: 'Portugal', email: 'ricardo.p@moldesrp.pt', phone: '+351 244 123 456', salesperson: 'João Chanoca', status: 'Active' },
  { id: 'CUST-002', name: 'Injetec', contactPeople: [{ name: 'Sofia Costa', role: 'Compras' }, { name: 'Manuel Dias', role: 'Produção' }], country: 'Portugal', email: 'sofia.c@injetec.pt', phone: '+351 244 789 123', salesperson: 'João Chanoca', status: 'Active' },
  { id: 'CUST-003', name: 'Precision Tools', contactPeople: [{ name: 'André Martins', role: 'Gerente' }], country: 'Espanha', email: 'andre.m@precision-tools.com', phone: '+34 912 345 678', salesperson: 'João Chanoca', status: 'Lead' },
  { id: 'CUST-004', name: 'Metalúrgica Central', contactPeople: [{ name: 'Carla Dias', role: 'Administração' }], country: 'Portugal', email: 'carla.d@metalurgica-central.pt', phone: '+351 239 987 654', salesperson: 'João Chanoca', status: 'Inactive' },
  { id: 'CUST-005', name: 'CNC Solutions', contactPeople: [{ name: 'Bruno Alves', role: 'Engenharia' }], country: 'Portugal', email: 'bruno.a@cncsolutions.pt', phone: '+351 244 321 654', salesperson: 'João Chanoca', status: 'Lead' },
  { id: 'CUST-006', name: 'Polimoldes', contactPeople: [{ name: 'Teresa Mendes', role: 'Diretora Técnica' }], country: 'Portugal', email: 'teresa.m@polimoldes.pt', phone: '+351 244 654 987', salesperson: 'João Chanoca', status: 'Active' },
];

const getUpdatedCustomerData = (): Customer[] => [
    { id: 'CUST-001', name: 'Moldes RP', contactPeople: [{ name: 'Ricardo Pereira', role: 'CEO' }], country: 'Portugal', email: 'ricardo.p@moldesrp.pt', phone: '+351 244 123 456', salesperson: 'João Chanoca', status: 'Active' },
    { id: 'CUST-002', name: 'Injetec', contactPeople: [{ name: 'Sofia C. Almeida', role: 'Compras' }, { name: 'Manuel Dias', role: 'Produção' }], country: 'Portugal', email: 'sofia.c@injetec.pt', phone: '+351 244 789 123', salesperson: 'João Chanoca', status: 'Active' }, // Updated contact name
    { id: 'CUST-003', name: 'Precision Tools SL', contactPeople: [{ name: 'André Martins', role: 'Gerente' }], country: 'Espanha', email: 'andre.m@precision-tools.com', phone: '+34 912 345 678', salesperson: 'João Chanoca', status: 'Active' }, // Updated name and status
    // CUST-004 removed
    { id: 'CUST-005', name: 'CNC Solutions', contactPeople: [{ name: 'Bruno Alves', role: 'Engenharia' }], country: 'Portugal', email: 'bruno.a@cncsolutions.pt', phone: '+351 244 321 654', salesperson: 'João Chanoca', status: 'Lead' },
    { id: 'CUST-006', name: 'Polimoldes', contactPeople: [{ name: 'Teresa Mendes', role: 'Diretora Técnica' }], country: 'Portugal', email: 'teresa.m@polimoldes.pt', phone: '+351 244 654 987', salesperson: 'João Chanoca', status: 'Active' },
    { id: 'CUST-007', name: 'Tecnoforma', contactPeople: [{ name: 'Jorge Antunes', role: 'Diretor' }], country: 'Portugal', email: 'jorge.a@tecnoforma.pt', phone: '+351 261 123 789', salesperson: 'João Chanoca', status: 'Lead' }, // New customer
];

const compareCustomerData = (oldData: Customer[], newData: Customer[]) => {
    const oldIds = new Map(oldData.map(c => [c.id, c]));
    const newIds = new Map(newData.map(c => [c.id, c]));
    let added = 0, updated = 0, removed = 0;

    for (const [id, customer] of newIds.entries()) {
        if (!oldIds.has(id)) {
            added++;
        } else {
            if (JSON.stringify(oldIds.get(id)) !== JSON.stringify(customer)) {
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

const statusStyles: Record<CustomerStatus, { dot: string; text: string; bg: string }> = {
  Active: { dot: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10' },
  Lead: { dot: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  Inactive: { dot: 'bg-gray-500', text: 'text-gray-400', bg: 'bg-gray-500/10' },
};

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof Customer;
  direction: SortDirection;
}

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
    </div>
);

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

const Empresas: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
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
        const newCustomerData = getUpdatedCustomerData();
        const changes = compareCustomerData(customers, newCustomerData);
        
        setCustomers(newCustomerData);
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

  const requestSort = (key: keyof Customer) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredCustomers = useMemo(() => {
    let result = [...customers];
    
    if (statusFilter !== 'All') {
        result = result.filter(customer => customer.status === statusFilter);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(customer =>
        customer.id.toLowerCase().includes(lowercasedTerm) ||
        customer.name.toLowerCase().includes(lowercasedTerm) ||
        customer.contactPeople.some(p => p.name.toLowerCase().includes(lowercasedTerm)) ||
        customer.country.toLowerCase().includes(lowercasedTerm) ||
        customer.email.toLowerCase().includes(lowercasedTerm) ||
        customer.phone.toLowerCase().includes(lowercasedTerm) ||
        customer.salesperson.toLowerCase().includes(lowercasedTerm)
      );
    }
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = sortConfig.key === 'contactPeople' ? a.contactPeople[0]?.name || '' : a[sortConfig.key];
        const bValue = sortConfig.key === 'contactPeople' ? b.contactPeople[0]?.name || '' : b[sortConfig.key];
        const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return result;
  }, [customers, searchTerm, sortConfig, statusFilter]);

  const handleEditClick = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCustomer({ ...customer });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCustomer) return;
    const { name, value } = e.target;

     if (name === 'contactPersonName' && editingCustomer) {
        const updatedContacts = [...editingCustomer.contactPeople];
        if (updatedContacts.length > 0) {
            updatedContacts[0].name = value;
        } else {
            updatedContacts.push({ name: value, role: 'Contacto Principal' });
        }
        setEditingCustomer(prev => prev ? { ...prev, contactPeople: updatedContacts } : null);
    } else {
        setEditingCustomer(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    
    setCustomers(prevCustomers => 
      prevCustomers.map(c => c.id === editingCustomer.id ? editingCustomer : c)
    );

    showToast(`Empresa "${editingCustomer.name}" atualizada com sucesso.`, 'success');
    setEditingCustomer(null);
  };
  
  const tableHeaders: { key: keyof Customer | 'actions', label: string, sortable: boolean, className?: string }[] = [
      { key: 'id', label: 'ID', sortable: true, className: 'w-24' },
      { key: 'name', label: 'Nome', sortable: true },
      { key: 'contactPeople', label: 'Pessoas de Contacto', sortable: true },
      { key: 'country', label: 'País', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'phone', label: 'Telefone', sortable: true },
      { key: 'salesperson', label: 'Comercial', sortable: true },
      { key: 'status', label: 'Estado', sortable: true },
      { key: 'actions', label: 'Acções', sortable: false, className: 'w-20 text-center' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BuildingIcon className="w-8 h-8 mr-3 text-red-500" />
              Gestão de Empresas
            </h2>
            <p className="text-gray-400 mt-1">
              Visualize, filtre e gira a sua lista de clientes.
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
                {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'success' ? 'Sincronizado' : 'Sincronizar Clientes'}
            </button>
            <p className="text-xs text-gray-500 mt-1 h-4">
                {lastSyncTime ? `Última sinc: ${lastSyncTime.toLocaleString()}` : 'Nunca sincronizado.'}
            </p>
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
                placeholder="Pesquisar por ID, nome, país, comercial..."
                />
            </div>
            <div className="flex items-center gap-2 flex-wrap bg-gray-700/50 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-400">Estado:</span>
              {(['All', 'Active', 'Lead', 'Inactive'] as const).map(s => (
                <FilterButton key={s} label={s} isActive={statusFilter === s} onClick={() => setStatusFilter(s)} />
              ))}
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700 table-fixed">
            <thead className="bg-gray-700/50">
              <tr>
                {tableHeaders.map(({ key, label, sortable, className }) => (
                  <th key={key} scope="col" className={`px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${className || ''}`}>
                    {sortable ? (
                      <button onClick={() => requestSort(key as keyof Customer)} className="flex items-center group focus:outline-none">
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
              {sortedAndFilteredCustomers.length > 0 ? (
                sortedAndFilteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{customer.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white truncate">{customer.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{customer.contactPeople[0]?.name || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{customer.country}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{customer.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{customer.phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 truncate">{customer.salesperson}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[customer.status].bg} ${statusStyles[customer.status].text}`}>
                            <span className={`h-2 w-2 rounded-full mr-1.5 ${statusStyles[customer.status].dot}`}></span>
                            {customer.status}
                        </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <button 
                            onClick={(e) => handleEditClick(customer, e)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                            aria-label={`Editar ${customer.name}`}
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-6 py-4 text-center text-gray-400">
                    Nenhuma empresa encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <Modal title="Detalhes da Empresa" onClose={() => setSelectedCustomer(null)}>
          <div className="text-gray-300 space-y-6">
            <div className="pb-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">{selectedCustomer.name}</h3>
              <p className="text-gray-400 text-sm">ID: {selectedCustomer.id}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p className="flex items-center"><AtSymbolIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> <span className="truncate">{selectedCustomer.email}</span></p>
                <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {selectedCustomer.phone}</p>
                <p className="flex items-center"><GlobeIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {selectedCustomer.country}</p>
                <p className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {selectedCustomer.salesperson}</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Pessoas de Contacto</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {selectedCustomer.contactPeople.map((person, index) => (
                    <div key={index} className="text-sm space-y-2 bg-gray-900/50 p-3 rounded-md flex items-center">
                        <UserCircleIcon className="w-6 h-6 mr-3 text-red-500 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-white">{person.name}</p>
                            <p className="text-gray-400 text-xs">{person.role}</p>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {editingCustomer && (
        <Modal title="Editar Empresa" onClose={() => setEditingCustomer(null)}>
          <form onSubmit={handleSaveEdit}>
            <div className="space-y-4">
                <InputField label="Nome da Empresa" name="name" value={editingCustomer.name} onChange={handleEditFormChange} />
                <InputField label="Pessoa de Contacto Principal" name="contactPersonName" value={editingCustomer.contactPeople[0]?.name || ''} onChange={handleEditFormChange} />
                <InputField label="País" name="country" value={editingCustomer.country} onChange={handleEditFormChange} />
                <InputField label="Telefone" name="phone" value={editingCustomer.phone} onChange={handleEditFormChange} />
                <InputField label="Email" name="email" value={editingCustomer.email} onChange={handleEditFormChange} type="email" />
                <InputField label="Comercial" name="salesperson" value={editingCustomer.salesperson} onChange={handleEditFormChange} />

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                  >
                    Guardar Alterações
                  </button>
                </div>
            </div>
          </form>
        </Modal>
      )}

      {isConfirmingSync && (
        <Modal title="Confirmar Sincronização" onClose={() => setIsConfirmingSync(false)}>
          <div>
            <p className="text-gray-300 mb-6">
              Tem a certeza que deseja sincronizar os dados dos clientes? Esta ação irá buscar os dados mais recentes e atualizar a sua lista local.
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

export default Empresas;