import React, { useEffect } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { ErrorIcon } from './icons/ErrorIcon';
import { InfoIcon } from './icons/InfoIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const toastConfig = {
  success: {
    bg: 'bg-green-600',
    icon: <CheckIcon className="h-6 w-6 text-white" />,
  },
  error: {
    bg: 'bg-red-600',
    icon: <ErrorIcon className="h-6 w-6 text-white" />,
  },
  info: {
    bg: 'bg-blue-600',
    icon: <InfoIcon className="h-6 w-6 text-white" />,
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const config = toastConfig[type];

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 mb-4 w-full max-w-xs text-white rounded-lg shadow-lg ${config.bg} animate-fade-in-down`}
      role="alert"
    >
      <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg bg-black bg-opacity-20">
        {config.icon}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white bg-opacity-10 text-white hover:text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-opacity-20 inline-flex h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

// Add this animation to index.html or a global CSS file if you have one.
// For now, let's add it directly to index.html style tag for simplicity.
// @keyframes fade-in-down {
//   0% {
//     opacity: 0;
//     transform: translateY(-20px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-down {
//   animation: fade-in-down 0.5s ease-out forwards;
// }

export default Toast;