
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ROIData, ROIResults } from '../types';

const initialData: ROIData = {
  companyName: '',
  partType: '',
  currentCycleTime: 120,
  currentProduction: 8000,
  currentPartCost: 5.50,
  fixedCosts: 15000,
  investment: 250000,
  newCycleTime: 90,
  newCapacity: 10667,
  newPartCost: 4.80,
};

const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: keyof ROIData; type?: string, unit?: string }> = ({ label, value, onChange, name, type = 'number', unit }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
        step="any"
      />
      {unit && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400">{unit}</span>}
    </div>
  </div>
);

const ResultCard: React.FC<{ title: string; value: string; colorClass: string }> = ({ title, value, colorClass }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <p className="text-sm text-gray-400">{title}</p>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

const ROICalculator: React.FC = () => {
  const [data, setData] = useState<ROIData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const results: ROIResults = useMemo(() => {
    const cycleTimeReduction = data.currentCycleTime > 0 ? (data.currentCycleTime - data.newCycleTime) / data.currentCycleTime : 0;
    const capacityGain = data.currentProduction > 0 ? (data.newCapacity - data.currentProduction) / data.currentProduction : 0;
    const costReduction = data.currentPartCost > 0 ? (data.currentPartCost - data.newPartCost) / data.currentPartCost : 0;
    const monthlyOperationalGain = (data.currentPartCost - data.newPartCost) * data.newCapacity;
    const paybackMonths = monthlyOperationalGain > 0 ? data.investment / monthlyOperationalGain : Infinity;
    const roi12Months = data.investment > 0 ? ((monthlyOperationalGain * 12) - data.investment) / data.investment : Infinity;
    const accumulatedGain3Years = (monthlyOperationalGain * 36) - data.investment;

    return {
      cycleTimeReduction,
      capacityGain,
      costReduction,
      monthlyOperationalGain,
      paybackMonths,
      roi12Months,
      accumulatedGain3Years,
    };
  }, [data]);
  
  const chartData = [
    { name: 'Costs', Before: data.currentPartCost, After: data.newPartCost },
    { name: 'Production', Before: data.currentProduction, After: data.newCapacity },
    { name: 'Cycle Time', Before: data.currentCycleTime, After: data.newCycleTime },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white">Project Data</h2>
          <InputField label="Company Name" name="companyName" value={data.companyName} onChange={handleInputChange} type="text" />
          <InputField label="Part/Process Type" name="partType" value={data.partType} onChange={handleInputChange} type="text" />
          
          <h3 className="text-lg font-semibold text-white pt-4 border-t border-gray-700">Current State</h3>
          <InputField label="Current Cycle Time" name="currentCycleTime" value={data.currentCycleTime} onChange={handleInputChange} unit="min" />
          <InputField label="Pieces Produced/Month" name="currentProduction" value={data.currentProduction} onChange={handleInputChange} unit="pcs" />
          <InputField label="Current Cost per Piece" name="currentPartCost" value={data.currentPartCost} onChange={handleInputChange} unit="€" />
          
          <h3 className="text-lg font-semibold text-white pt-4 border-t border-gray-700">Investment & Future State</h3>
          <InputField label="Estimated Investment" name="investment" value={data.investment} onChange={handleInputChange} unit="€" />
          <InputField label="New Cycle Time" name="newCycleTime" value={data.newCycleTime} onChange={handleInputChange} unit="min" />
          <InputField label="New Capacity" name="newCapacity" value={data.newCapacity} onChange={handleInputChange} unit="pcs/month" />
          <InputField label="New Cost per Piece" name="newPartCost" value={data.newPartCost} onChange={handleInputChange} unit="€" />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Key Performance Indicators (KPIs)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ResultCard title="Payback Period" value={`${isFinite(results.paybackMonths) ? results.paybackMonths.toFixed(1) : 'N/A'} months`} colorClass="text-green-400" />
                    <ResultCard title="12-Month ROI" value={`${isFinite(results.roi12Months) ? (results.roi12Months * 100).toFixed(1) : 'N/A'}%`} colorClass="text-green-400" />
                    <ResultCard title="Monthly Operational Gain" value={`€${results.monthlyOperationalGain.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} colorClass="text-green-400" />
                    <ResultCard title="3-Year Accumulated Gain" value={`€${results.accumulatedGain3Years.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} colorClass="text-green-400" />
                    <ResultCard title="Cycle Time Reduction" value={`${(results.cycleTimeReduction * 100).toFixed(1)}%`} colorClass="text-blue-400" />
                    <ResultCard title="Capacity Gain" value={`${(results.capacityGain * 100).toFixed(1)}%`} colorClass="text-blue-400" />
                    <ResultCard title="Unit Cost Reduction" value={`${(results.costReduction * 100).toFixed(1)}%`} colorClass="text-blue-400" />
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg h-96">
                <h2 className="text-xl font-semibold text-white mb-4">Before vs. After Comparison</h2>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                        <Legend />
                        <Bar dataKey="Before" fill="#e53e3e" />
                        <Bar dataKey="After" fill="#48bb78" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
