"use client";

import { useState } from "react";

interface ControlPanelProps {
    applicationId?: number;
}

export default function ControlPanel({ applicationId }: ControlPanelProps) {
    const [systemPaused, setSystemPaused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function pauseSystem() {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/control/system/pause", {
                method: "POST",
            });
            const data = await res.json();
            setSystemPaused(true);
            setMessage("System paused successfully");
        } catch (error) {
            setMessage("Failed to pause system");
        } finally {
            setLoading(false);
        }
    }

    async function resumeSystem() {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/control/system/resume", {
                method: "POST",
            });
            const data = await res.json();
            setSystemPaused(false);
            setMessage("System resumed successfully");
        } catch (error) {
            setMessage("Failed to resume system");
        } finally {
            setLoading(false);
        }
    }

    async function pauseApplication() {
        if (!applicationId) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/control/pause/${applicationId}`, {
                method: "POST",
            });
            const data = await res.json();
            setMessage(`Application ${applicationId} paused`);
        } catch (error) {
            setMessage("Failed to pause application");
        } finally {
            setLoading(false);
        }
    }

    async function resumeApplication() {
        if (!applicationId) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/control/resume/${applicationId}`, {
                method: "POST",
            });
            const data = await res.json();
            setMessage(`Application ${applicationId} resumed`);
        } catch (error) {
            setMessage("Failed to resume application");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Control Panel</h3>

            {/* System Controls */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">System Controls</h4>
                <div className="flex gap-3">
                    <button
                        onClick={pauseSystem}
                        disabled={loading || systemPaused}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        🛑 Emergency Pause
                    </button>
                    <button
                        onClick={resumeSystem}
                        disabled={loading || !systemPaused}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        ▶️ Resume System
                    </button>
                </div>
            </div>

            {/* Application Controls */}
            {applicationId && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                        Application #{applicationId} Controls
                    </h4>
                    <div className="flex gap-3">
                        <button
                            onClick={pauseApplication}
                            disabled={loading}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors"
                        >
                            ⏸️ Pause
                        </button>
                        <button
                            onClick={resumeApplication}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors"
                        >
                            ▶️ Resume
                        </button>
                    </div>
                </div>
            )}

            {/* Status Message */}
            {message && (
                <div className="bg-gray-800 border border-gray-600 rounded p-3 text-sm text-gray-300">
                    {message}
                </div>
            )}

            {/* System Status */}
            <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">System Status:</span>
                    <span
                        className={`text-sm font-bold ${systemPaused ? 'text-red-400' : 'text-green-400'
                            }`}
                    >
                        {systemPaused ? '🔴 PAUSED' : '🟢 ACTIVE'}
                    </span>
                </div>
            </div>
        </div>
    );
}
