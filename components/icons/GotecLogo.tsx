
import React from 'react';

export const GotecLogo: React.FC<{ className?: string, simple?: boolean }> = ({ className, simple = false }) => (
    simple ? (
         <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L50 0L100 50L50 100L0 50Z" fill="#EF4444"/>
            <path d="M50 0V100" stroke="white" strokeWidth="5"/>
            <path d="M0 50H100" stroke="white" strokeWidth="5"/>
            <path d="M12.5 25L87.5 75" stroke="white" strokeWidth="5"/>
            <path d="M12.5 75L87.5 25" stroke="white" strokeWidth="5"/>
        </svg>
    ) : (
        <svg className={className} viewBox="0 0 260 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text fill="#FFFFFF" style={{ whiteSpace: 'pre' }} fontFamily="Arial,sans-serif" fontSize="36" fontWeight="bold" letterSpacing="0em">
                <tspan x="0" y="35.5">GOTEC</tspan>
            </text>
            <text fill="#EF4444" style={{ whiteSpace: 'pre' }} fontFamily="Arial,sans-serif" fontSize="36" fontWeight="bold" letterSpacing="0em">
                <tspan x="135" y="35.5">!</tspan>
            </text>
            <text fill="#CCCCCC" style={{ whiteSpace: 'pre' }} fontFamily="Arial,sans-serif" fontSize="12" letterSpacing="0.1em">
                <tspan x="0" y="48.5">TRANSFERÊNCIA TECNOLÓGICA</tspan>
            </text>
        </svg>
    )
);
