import React from 'react';

interface SortIndicatorIconProps {
  direction?: 'ascending' | 'descending';
}

export const SortIndicatorIcon: React.FC<SortIndicatorIconProps> = ({ direction }) => {
  return (
    <span className="inline-flex flex-col ml-1 text-gray-500 w-4 h-4 justify-center items-center">
      <svg
        className={`w-3 h-3 transition-colors ${direction === 'ascending' ? 'text-white' : 'group-hover:text-gray-400'}`}
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 3L4 9h12z" />
      </svg>
      <svg
        className={`w-3 h-3 transition-colors ${direction === 'descending' ? 'text-white' : 'group-hover:text-gray-400'}`}
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 17l6-6H4z" />
      </svg>
    </span>
  );
};