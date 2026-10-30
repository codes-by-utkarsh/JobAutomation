"use client";

import { useEffect, useState } from "react";

interface LearningModel {
    version: number;
    keyword_weights: Record<string, number>;
    platform_match_thresholds: Record<string, number>;
    resume_aggressiveness: Record<string, number>;
    platform_success_rates: Record<string, number>;
    global_match_threshold: number;
    updated_at: string;
}

export default function LearningDashboard() {
    const [model, setModel] = useState<LearningModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchModel() {
            try {
                const res = await fetch("http://localhost:8000/learning/model");
                const data = await res.json();
                setModel(data);
            } catch (error) {
                console.error("Failed to fetch learning model:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchModel();
        const interval = setInterval(fetchModel, 10000); // Refresh every 10s

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="animate-pulse">Loading learning model...</div>;
    }

    if (!model) {
        return <div className="text-red-500">Failed to load learning model</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-600 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Learning Model</h2>
                <p className="text-gray-300">
                    Version {model.version} • Updated {new Date(model.updated_at).toLocaleString()}
                </p>
            </div>

            {/* Platform Success Rates */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Platform Success Rates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(model.platform_success_rates).map(([platform, rate]) => (
                        <div key={platform} className="bg-gray-800 p-4 rounded">
                            <div className="text-sm text-gray-400 capitalize">{platform}</div>
                            <div className="text-2xl font-bold text-white mt-1">
                                {(rate * 100).toFixed(1)}%
                            </div>
                            <div className="w-full bg-gray-700 h-2 rounded mt-2">
                                <div
                                    className={`h-2 rounded ${getSuccessColor(rate)}`}
                                    style={{ width: `${rate * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Adaptive Thresholds */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Adaptive Thresholds</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(model.platform_match_thresholds).map(([platform, threshold]) => (
                        <div key={platform} className="bg-gray-800 p-4 rounded">
                            <div className="text-sm text-gray-400 capitalize">{platform}</div>
                            <div className="text-xl font-bold text-blue-400 mt-1">
                                {threshold.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">match score required</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Keyword Weights */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Top Keyword Weights</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(model.keyword_weights)
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .slice(0, 12)
                        .map(([keyword, weight]) => (
                            <div key={keyword} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                                <span className="text-sm text-white">{keyword}</span>
                                <span
                                    className={`text-sm font-bold ${(weight as number) > 1 ? 'text-green-400' : 'text-red-400'
                                        }`}
                                >
                                    {(weight as number).toFixed(2)}x
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Resume Aggressiveness */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Resume Optimization Aggressiveness</h3>
                <div className="space-y-2">
                    {Object.entries(model.resume_aggressiveness).map(([platform, aggr]) => (
                        <div key={platform} className="flex items-center gap-3">
                            <div className="w-24 text-sm text-gray-400 capitalize">{platform}</div>
                            <div className="flex-1 bg-gray-700 h-4 rounded overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-yellow-500 h-4"
                                    style={{ width: `${(aggr as number) * 100}%` }}
                                />
                            </div>
                            <div className="w-12 text-sm text-white text-right">
                                {((aggr as number) * 100).toFixed(0)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getSuccessColor(rate: number): string {
    if (rate > 0.5) return 'bg-green-500';
    if (rate > 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
}
