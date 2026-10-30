"use client";

import { useEffect, useState } from "react";

interface StateTransition {
    from_state: string | null;
    to_state: string;
    reason: string;
    timestamp: string;
}

interface StateVisualizerProps {
    applicationId: number;
}

export default function StateVisualizer({ applicationId }: StateVisualizerProps) {
    const [history, setHistory] = useState<StateTransition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch(`http://localhost:8000/control/state/${applicationId}`);
                const data = await res.json();
                setHistory(data.history || []);
            } catch (error) {
                console.error("Failed to fetch state history:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
        const interval = setInterval(fetchHistory, 5000); // Refresh every 5s

        return () => clearInterval(interval);
    }, [applicationId]);

    if (loading) {
        return <div className="animate-pulse">Loading state history...</div>;
    }

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-white">State Progression</h3>

            <div className="space-y-3">
                {history.map((transition, index) => {
                    const isLatest = index === 0;
                    const stateColor = getStateColor(transition.to_state);

                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded ${isLatest ? 'bg-blue-900/30 border border-blue-600' : 'bg-gray-800'
                                }`}
                        >
                            {/* Timeline indicator */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-3 h-3 rounded-full ${stateColor}`}
                                    style={{ marginTop: '4px' }}
                                />
                                {index < history.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-600 mt-1" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm text-white">
                                        {transition.to_state.toUpperCase().replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(transition.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{transition.reason}</p>
                                {transition.from_state && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        from {transition.from_state.replace(/_/g, ' ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getStateColor(state: string): string {
    if (state.includes('failed')) return 'bg-red-500';
    if (state.includes('skipped')) return 'bg-yellow-500';
    if (state === 'applied') return 'bg-green-500';
    if (state === 'ready_to_apply') return 'bg-blue-500';
    if (state.includes('analyzing') || state.includes('optimizing')) return 'bg-purple-500';
    return 'bg-gray-500';
}
