import React, { useState } from 'react';
import { generateGroundedText } from '../services/geminiService';
import { MapPinIcon } from './icons/MapPinIcon';
import { LinkIcon } from './icons/LinkIcon';

// Simple Markdown-to-JSX parser
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements = lines.map((line, index) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-semibold text-red-500 mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('* ')) {
            return <li key={index} className="list-disc ml-6">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        return <p key={index} className="text-gray-300">{line}</p>;
    });

    return <div className="space-y-2">{elements}</div>;
};


const VisitPlanner: React.FC = () => {
    const [addresses, setAddresses] = useState('');
    const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateRoute = async () => {
        if (addresses.trim() === '') {
            setError('Please enter at least one address.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const prompt = `
You are an expert logistics planner for a technical salesperson from GOTEC.
Your task is to create an optimized daily visit route starting from the user's current location.
For each stop, provide a brief summary of the potential business opportunity, suggesting relevant products from the GOTEC portfolio.
The list of addresses to visit is:

${addresses}

Generate a logical itinerary with estimated travel times between stops. The output should be in clear, readable markdown format.
`;
                try {
                    const response = await generateGroundedText(prompt, { latitude, longitude });
                    setResult(response);
                } catch (e) {
                    setError('Failed to generate the route. Please try again.');
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            },
            (geoError) => {
                setError(`Geolocation error: ${geoError.message}. Please enable location services.`);
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Visit Planner</h2>
                <p className="text-gray-400 mb-4">Enter the addresses of the companies you want to visit (one per line). The AI will use your current location to generate an optimized route with strategic insights for each stop.</p>
                
                <textarea
                    value={addresses}
                    onChange={(e) => setAddresses(e.target.value)}
                    placeholder="Example:
GOTEC Lda, Leiria
Client A, Marinha Grande
Client B, Pombal"
                    className="w-full h-32 bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
                    disabled={isLoading}
                />
                
                <button
                    onClick={handleGenerateRoute}
                    disabled={isLoading}
                    className="mt-4 w-full flex items-center justify-center bg-red-600 text-white p-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Route...
                        </>
                    ) : (
                        <>
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            Generate Route
                        </>
                    )}
                </button>

                {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mt-4 text-sm">{error}</p>}
            </div>

            {result && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
                    <h3 className="text-xl font-semibold text-white mb-4">Your Optimized Itinerary</h3>
                    <div className="prose prose-invert max-w-none">
                        <MarkdownRenderer content={result.text} />
                    </div>
                    {result.sources && result.sources.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-white mb-3 border-t border-gray-700 pt-4">Navigation Links</h4>
                            <ul className="space-y-2">
                                {result.sources.map((source, index) => (
                                    source.maps && (
                                        <li key={index}>
                                            <a
                                                href={source.maps.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-red-400 hover:text-red-300 hover:underline transition-colors"
                                            >
                                                <LinkIcon className="h-4 w-4 mr-2" />
                                                {source.maps.title}
                                            </a>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VisitPlanner;