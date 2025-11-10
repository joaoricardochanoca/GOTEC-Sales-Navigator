import React, { useState, useMemo } from 'react';
import type { View, Task, TaskPriority, Proposal, ProposalStatus } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { DocumentIcon } from './icons/DocumentIcon';

interface DashboardProps {
  setView: (view: View) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
};

const priorityOrder: Record<TaskPriority, number> = {
  High: 1,
  Medium: 2,
  Low: 3,
};

const upcomingVisits = [
  { id: 1, date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), customer: 'Moldes RP', location: 'Marinha Grande' },
  { id: 2, date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), customer: 'Injetec', location: 'Leiria' },
  { id: 3, date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), customer: 'Precision Tools', location: 'Pombal' },
];

const mockProposals: Proposal[] = [
    { id: 'PROP-2024-001', date: '2024-06-15', opportunity: 'Fornecimento de Centro de Fresagem WEIDA', customerName: 'Moldes RP', observations: 'Cliente necessita de upgrade de equipamento.', deliveryDeadline: '2024-08-30', status: 'Sent', machine: 'WEIDA GMILL 850', totalValue: 155000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-002', date: '2024-05-20', opportunity: 'Upgrade de injetora CHEN HSONG', customerName: 'Injetec', observations: 'Proposta para substituição de injetora antiga.', deliveryDeadline: '2024-07-15', status: 'Accepted', machine: 'CHEN HSONG JM268-MK6', totalValue: 85000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-003', date: '2024-06-25', opportunity: 'Sistema de medição on-machine', customerName: 'Precision Tools', observations: 'Reduzir tempo de setup.', deliveryDeadline: '2024-09-01', status: 'Draft', machine: 'HAMOO Probe + Laser', totalValue: 12500, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-004', date: '2024-04-10', opportunity: 'Solução de corte automático ZODEL', customerName: 'Metalúrgica Central', observations: 'Proposta rejeitada.', deliveryDeadline: '2024-06-10', status: 'Rejected', machine: 'ZODEL GZK4232', totalValue: 48000, salesperson: 'João Chanoca' },
    { id: 'PROP-2024-005', date: '2024-07-01', opportunity: 'Proposta de Retificação HDCNC', customerName: 'CNC Solutions', observations: 'Cliente adiou investimento.', deliveryDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Sent', machine: 'HDCNC SGA-3063AHD', totalValue: 62000, salesperson: 'João Chanoca' },
];
const statusStyles: Record<ProposalStatus, { text: string; bg: string }> = {
  Draft: { text: 'text-gray-300', bg: 'bg-gray-500/20' },
  Sent: { text: 'text-blue-400', bg: 'bg-blue-500/10' },
  Accepted: { text: 'text-green-400', bg: 'bg-green-500/10' },
  Rejected: { text: 'text-red-400', bg: 'bg-red-500/10' },
  Expired: { text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Follow up with Client X on WEIDA proposal', completed: false, priority: 'High', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 2, text: 'Prepare ROI calculation for Client Y', completed: false, priority: 'Medium' },
    { id: 3, text: 'Schedule a technical demo for Client Z', completed: true, priority: 'Low', dueDate: new Date().toISOString().split('T')[0] },
     { id: 4, text: 'Review overdue proposal for Client A', completed: false, priority: 'High', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  // FIX: Updated the type for the 'statusFilter' state to include 'Completed' to match the filter options.
  const [statusFilter, setStatusFilter] = useState<'All' | 'Incomplete' | 'Completed'>('All');
  const [proposalStatusFilter, setProposalStatusFilter] = useState<ProposalStatus | 'All'>('All');


  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = tasks;

    if (priorityFilter !== 'All') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    if (statusFilter !== 'All') {
      filteredTasks = filteredTasks.filter(task =>
        statusFilter === 'Completed' ? task.completed : !task.completed
      );
    }
      
    return filteredTasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (!a.completed) {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        if (aDate !== bDate) {
          return aDate - bDate;
        }
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks, priorityFilter, statusFilter]);

  const filteredProposals = useMemo(() => {
    let filtered = mockProposals;
    if (proposalStatusFilter !== 'All') {
        filtered = filtered.filter(p => p.status === proposalStatusFilter);
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [proposalStatusFilter]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      priority: 'Medium',
      dueDate: newDueDate || undefined,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNewDueDate('');
  };

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const handlePriorityChange = (id: number) => {
    setTasks(tasks.map(task => {
        if (task.id === id) {
            const newPriority: TaskPriority = 
                task.priority === 'High' ? 'Medium' :
                task.priority === 'Medium' ? 'Low' : 'High';
            return { ...task, priority: newPriority };
        }
        return task;
    }));
  };
  
  const isOverdue = (task: Task): boolean => {
    if (!task.dueDate || task.completed) {
        return false;
    }
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(23, 59, 59, 999);
    return dueDate < today;
  }

  const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, isActive, onClick }) => (
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

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-8">Welcome to the GOTEC Sales Navigator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Widget */}
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">My Tasks</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-400">Priority:</span>
              {(['All', 'High', 'Medium', 'Low'] as const).map(p => (
                <FilterButton key={p} label={p} isActive={priorityFilter === p} onClick={() => setPriorityFilter(p)} />
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-400">Status:</span>
              {(['All', 'Incomplete', 'Completed'] as const).map(s => (
                <FilterButton key={s} label={s} isActive={statusFilter === s} onClick={() => setStatusFilter(s)} />
              ))}
            </div>
          </div>
          
          <form onSubmit={handleAddTask} className="flex items-center mb-4 gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{colorScheme: 'dark'}}
            />
            <button type="submit" className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold text-sm h-full px-4">
              Add
            </button>
          </form>
          <div className="flex-1 overflow-y-auto pr-2">
            {filteredAndSortedTasks.length > 0 ? (
                <ul className="space-y-3">
                  {filteredAndSortedTasks.map(task => (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-md group transition-all duration-300 ease-in-out ${
                        task.completed ? 'bg-green-900/20 opacity-70' : 'bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center overflow-hidden flex-1">
                         <button 
                            onClick={() => handlePriorityChange(task.id)} 
                            className={`h-4 w-4 rounded-full flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-white ${priorityColors[task.priority]}`}
                            title={`Priority: ${task.priority}. Click to change.`}
                         />
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          className="ml-3 h-5 w-5 rounded bg-gray-600 border-gray-500 text-red-600 focus:ring-red-500 cursor-pointer flex-shrink-0"
                        />
                        <span className={`ml-3 text-sm truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center ml-2">
                        {task.dueDate && (
                            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${isOverdue(task) ? 'bg-red-500/20 text-red-400' : 'bg-gray-600 text-gray-400'}`}>
                                <CalendarIcon className="h-4 w-4 mr-1"/>
                                <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                            </div>
                        )}
                        <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center text-sm py-4">
                  {tasks.length === 0 ? 'You have no tasks.' : 'No tasks match the current filters.'}
                </p>
              )}
          </div>
        </div>

        {/* Visits Widget */}
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">Próximas Visitas</h3>
          {upcomingVisits.length > 0 ? (
            <ul className="space-y-4 flex-1">
              {upcomingVisits.map(visit => (
                <li key={visit.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-gray-700 rounded-lg">
                    <span className="text-xs text-red-400 font-semibold">{visit.date.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-lg text-white font-bold">{visit.date.getDate()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{visit.customer}</p>
                    <p className="text-sm text-gray-400 flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1.5" />
                      {visit.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center text-sm flex-1 flex items-center justify-center">Nenhuma visita agendada.</p>
          )}
          <button
            onClick={() => setView('visitPlanner')}
            className="mt-4 w-full bg-red-600/80 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold text-sm transition-colors"
          >
            Ver Planeador
          </button>
        </div>
      </div>

      {/* Proposals Widget */}
      <div className="mt-6 bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <DocumentIcon className="w-6 h-6 mr-3 text-red-500" />
            Propostas Recentes
          </h3>
          <button
            onClick={() => setView('propostas')}
            className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
          >
            Ver Todas &rarr;
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-sm font-medium text-gray-400">Estado:</span>
          {(['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'] as const).map(s => (
            <FilterButton key={s} label={s} isActive={proposalStatusFilter === s} onClick={() => setProposalStatusFilter(s)} />
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="text-left text-xs font-medium text-gray-400 uppercase py-2 pr-4">Cliente</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase py-2 px-4">Máquina</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase py-2 px-4">Valor</th>
                <th className="text-center text-xs font-medium text-gray-400 uppercase py-2 pl-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.length > 0 ? filteredProposals.map(p => (
                <tr key={p.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-white">{p.customerName}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{p.opportunity}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300 whitespace-nowrap">{p.machine}</td>
                  <td className="py-3 px-4 text-sm text-gray-300 whitespace-nowrap text-right">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(p.totalValue)}</td>
                  <td className="py-3 pl-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[p.status].bg} ${statusStyles[p.status].text}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhuma proposta encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;