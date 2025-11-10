import React from 'react';

export const RouteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-8-4.5-8-11.5a8 8 0 1116 0c0 7-8 11.5-8 11.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);