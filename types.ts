export type View = 'dashboard' | 'copilot' | 'roi' | 'knowledge' | 'visitPlanner' | 'empresas' | 'produtos' | 'propostas' | 'maquinas';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface ROIData {
  companyName: string;
  partType: string;
  currentCycleTime: number;
  currentProduction: number;
  currentPartCost: number;
  fixedCosts: number;
  investment: number;
  newCycleTime: number;
  newCapacity: number;
  newPartCost: number;
}

export interface ROIResults {
  cycleTimeReduction: number;
  capacityGain: number;
  costReduction: number;
  monthlyOperationalGain: number;
  paybackMonths: number;
  roi12Months: number;
  accumulatedGain3Years: number;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
}

export type ProposalStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';

export interface Proposal {
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
