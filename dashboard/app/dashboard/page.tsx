'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
    id: string
    email: string
    fullName: string
}

interface Profile {
    automationStatus: 'idle' | 'running' | 'paused'
    totalApplications: number
    interviewsReceived: number
    resumeFilePath?: string
    jobRoles?: string[]
    experienceLevel?: string
    preferredLocations?: string[]
    remoteOnly?: boolean
    minSalary?: number
    maxSalary?: number
}

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            router.push('/login')
            return
        }

        setUser(JSON.parse(userData))
        fetchProfile(token)
    }, [router])

    const fetchProfile = async (token: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/profile/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (response.ok) {
                setProfile(data.profile)
            } else {
                console.error('Failed to fetch profile')
            }
        } catch (error) {
            console.error('Network error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAutomationControl = async (action: 'start' | 'pause' | 'stop') => {
        setActionLoading(true)
        const token = localStorage.getItem('token')

        try {
            const response = await fetch(`http://localhost:8000/api/profile/automation/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (response.ok) {
                setProfile(prev => prev ? { ...prev, automationStatus: data.status } : null)
            } else {
                alert(data.error || `Failed to ${action} automation`)
            }
        } catch (error) {
            alert('Network error. Please try again.')
        } finally {
            setActionLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    const statusConfig = {
        running: { label: 'Running', color: 'status-running', icon: '🟢' },
        paused: { label: 'Paused', color: 'status-paused', icon: '🟡' },
        idle: { label: 'Idle', color: 'status-idle', icon: '⚪' }
    }

    const currentStatus = profile?.automationStatus || 'idle'
    const hasResume = !!profile?.resumeFilePath
    const hasPreferences = profile?.jobRoles && profile.jobRoles.length > 0

    return (
        <div className="min-h-screen pb-20">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center pulse-glow">
                                <span className="text-2xl font-black">🦁</span>
                            </div>
                            <h1 className="text-2xl font-black gradient-text">The Beast</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/profile">
                                <button className="btn-secondary">⚙️ Profile</button>
                            </Link>
                            <button onClick={handleLogout} className="btn-secondary">
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black mb-3">
                        Welcome Back, <span className="gradient-text">{user?.fullName?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-xl text-gray-400">Monitor your automated job hunting progress</p>
                </div>

                {/* Status Banner */}
                <div className="mb-8 glass-card p-8">
                    <div className="flex items-center justify-between flex-wrap gap-6">
                        <div>
                            <div className="text-sm text-gray-400 mb-2 font-semibold">Automation Status</div>
                            <div className={`status-badge ${statusConfig[currentStatus].color} text-lg`}>
                                {statusConfig[currentStatus].icon} {statusConfig[currentStatus].label}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {currentStatus === 'idle' && (
                                <button
                                    onClick={() => handleAutomationControl('start')}
                                    disabled={actionLoading || !hasResume || !hasPreferences}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={!hasResume ? 'Upload resume first' : !hasPreferences ? 'Set job preferences first' : ''}
                                >
                                    {actionLoading ? 'Starting...' : '▶️ Start Hunting'}
                                </button>
                            )}

                            {currentStatus === 'running' && (
                                <>
                                    <button
                                        onClick={() => handleAutomationControl('pause')}
                                        disabled={actionLoading}
                                        className="btn-secondary"
                                    >
                                        {actionLoading ? 'Pausing...' : '⏸️ Pause'}
                                    </button>
                                    <button
                                        onClick={() => handleAutomationControl('stop')}
                                        disabled={actionLoading}
                                        className="btn-secondary"
                                    >
                                        {actionLoading ? 'Stopping...' : '⏹️ Stop'}
                                    </button>
                                </>
                            )}

                            {currentStatus === 'paused' && (
                                <>
                                    <button
                                        onClick={() => handleAutomationControl('start')}
                                        disabled={actionLoading}
                                        className="btn-primary"
                                    >
                                        {actionLoading ? 'Resuming...' : '▶️ Resume'}
                                    </button>
                                    <button
                                        onClick={() => handleAutomationControl('stop')}
                                        disabled={actionLoading}
                                        className="btn-secondary"
                                    >
                                        {actionLoading ? 'Stopping...' : '⏹️ Stop'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {(!hasResume || !hasPreferences) && (
                        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300 text-sm">
                            ⚠️ {!hasResume ? 'Please upload your resume in the Profile section to start automation.' : 'Please set your job preferences in the Profile section.'}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="stat-card">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl">📝</span>
                            </div>
                            <span className="text-3xl font-black gradient-text">
                                {profile?.totalApplications || 0}
                            </span>
                        </div>
                        <div className="text-gray-400 font-semibold">Total Applications</div>
                        <div className="text-sm text-gray-500 mt-1">Applications submitted</div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <span className="text-3xl font-black gradient-text">
                                {profile?.interviewsReceived || 0}
                            </span>
                        </div>
                        <div className="text-gray-400 font-semibold">Interviews Received</div>
                        <div className="text-sm text-gray-500 mt-1">Interview invitations</div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                            <span className="text-3xl font-black gradient-text">
                                {profile?.totalApplications ? Math.round((profile.interviewsReceived || 0) / profile.totalApplications * 100) : 0}%
                            </span>
                        </div>
                        <div className="text-gray-400 font-semibold">Success Rate</div>
                        <div className="text-sm text-gray-500 mt-1">Interview conversion</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">👤</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Manage Profile</h3>
                        <p className="text-gray-400 mb-6">Update your resume, preferences, and job criteria</p>
                        <Link href="/dashboard/profile">
                            <button className="btn-primary">Edit Profile →</button>
                        </Link>
                    </div>

                    <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">📋</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">View Applications</h3>
                        <p className="text-gray-400 mb-6">Track all your submitted job applications</p>
                        <Link href="/dashboard/applications">
                            <button className="btn-primary">View Applications →</button>
                        </Link>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="mt-12 glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {profile?.totalApplications === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-6xl mb-4">🦁</div>
                                <p className="text-lg">Start the automation to see your activity here</p>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>Activity tracking coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
