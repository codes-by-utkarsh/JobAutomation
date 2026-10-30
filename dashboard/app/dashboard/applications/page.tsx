'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Application {
    _id: string
    jobId: {
        title: string
        company: string
        platform: string
        location: string
        url: string
    }
    status: 'pending' | 'applied' | 'interview' | 'rejected' | 'failed'
    appliedAt: string
    createdAt: string
}

export default function ApplicationsPage() {
    const router = useRouter()
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }
        fetchApplications(token)
    }, [router])

    const fetchApplications = async (token: string) => {
        // TODO: Implement API endpoint for fetching applications
        // For now, show mock data
        setLoading(false)
    }

    const statusConfig = {
        pending: { label: 'Pending', color: 'bg-gray-600/20 border-gray-500/30 text-gray-400', icon: '⏳' },
        applied: { label: 'Applied', color: 'bg-blue-600/20 border-blue-500/30 text-blue-400', icon: '✉️' },
        interview: { label: 'Interview', color: 'bg-green-600/20 border-green-500/30 text-green-400', icon: '🎯' },
        rejected: { label: 'Rejected', color: 'bg-red-600/20 border-red-500/30 text-red-400', icon: '❌' },
        failed: { label: 'Failed', color: 'bg-orange-600/20 border-orange-500/30 text-orange-400', icon: '⚠️' }
    }

    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl font-black">🦁</span>
                            </div>
                            <h1 className="text-2xl font-black gradient-text">The Beast</h1>
                        </div>
                        <Link href="/dashboard">
                            <button className="btn-secondary">← Back to Dashboard</button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-5xl font-black mb-3">
                        <span className="gradient-text">Applications</span> Tracker
                    </h1>
                    <p className="text-xl text-gray-400">Monitor all your job applications in one place</p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'all'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'glass-card hover:border-purple-500/30'
                            }`}
                    >
                        All Applications
                    </button>
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === key
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                    : 'glass-card hover:border-purple-500/30'
                                }`}
                        >
                            {config.icon} {config.label}
                        </button>
                    ))}
                </div>

                {/* Applications Grid */}
                {applications.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                        <div className="text-8xl mb-6">📋</div>
                        <h3 className="text-3xl font-bold mb-4">No Applications Yet</h3>
                        <p className="text-gray-400 text-lg mb-8">
                            Start the automation to begin applying to jobs automatically
                        </p>
                        <Link href="/dashboard">
                            <button className="btn-primary">Go to Dashboard</button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => {
                            const statusInfo = statusConfig[app.status]
                            return (
                                <div key={app._id} className="glass-card p-6 hover:scale-102 transition-transform duration-300">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-3">
                                                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                                    <span className="text-2xl font-bold">{app.jobId.company[0]}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1">{app.jobId.title}</h3>
                                                    <p className="text-gray-400 font-semibold">{app.jobId.company}</p>
                                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            📍 {app.jobId.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            💼 {app.jobId.platform}
                                                        </span>
                                                        {app.appliedAt && (
                                                            <span className="flex items-center gap-1">
                                                                📅 {new Date(app.appliedAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-4 py-2 rounded-xl border font-semibold text-sm ${statusInfo.color}`}>
                                                {statusInfo.icon} {statusInfo.label}
                                            </span>
                                            <a
                                                href={app.jobId.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-secondary text-sm"
                                            >
                                                View Job →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Stats Summary */}
                {applications.length > 0 && (
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="glass-card p-6 text-center">
                            <div className="text-3xl font-black gradient-text mb-2">{applications.length}</div>
                            <div className="text-sm text-gray-400">Total</div>
                        </div>
                        {Object.entries(statusConfig).map(([key, config]) => {
                            const count = applications.filter(app => app.status === key).length
                            return (
                                <div key={key} className="glass-card p-6 text-center">
                                    <div className="text-3xl font-black gradient-text mb-2">{count}</div>
                                    <div className="text-sm text-gray-400">{config.label}</div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
