'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
    resumeFilePath?: string
    resumeText?: string
    tenthMarks?: number
    twelfthMarks?: number
    degree?: string
    university?: string
    graduationYear?: number
    jobRoles?: string[]
    experienceLevel?: string
    preferredLocations?: string[]
    remoteOnly?: boolean
    minSalary?: number
    maxSalary?: number
}

export default function ProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<Profile>({
        jobRoles: [],
        preferredLocations: [],
        experienceLevel: 'Mid',
        remoteOnly: false
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }
        fetchProfile(token)
    }, [router])

    const fetchProfile = async (token: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/profile/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (response.ok) {
                setProfile(data.profile)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        const token = localStorage.getItem('token')

        try {
            const response = await fetch('http://localhost:8000/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' })
                setTimeout(() => setMessage({ type: '', text: '' }), 3000)
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setMessage({ type: '', text: '' })
        const token = localStorage.getItem('token')

        const formData = new FormData()
        formData.append('resume', file)

        try {
            const response = await fetch('http://localhost:8000/api/profile/resume/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Resume uploaded successfully!' })
                setProfile(prev => ({ ...prev, resumeFilePath: data.filePath }))
                setTimeout(() => setMessage({ type: '', text: '' }), 3000)
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to upload resume' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setUploading(false)
        }
    }

    const addToArray = (field: 'jobRoles' | 'preferredLocations', value: string) => {
        if (!value.trim()) return
        const current = profile[field] || []
        if (!current.includes(value.trim())) {
            setProfile(prev => ({ ...prev, [field]: [...current, value.trim()] }))
        }
    }

    const removeFromArray = (field: 'jobRoles' | 'preferredLocations', index: number) => {
        const current = profile[field] || []
        setProfile(prev => ({ ...prev, [field]: current.filter((_, i) => i !== index) }))
    }

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

            <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-5xl font-black mb-3">
                        <span className="gradient-text">Profile</span> Settings
                    </h1>
                    <p className="text-xl text-gray-400">Customize your job hunting preferences</p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Resume Upload */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            📄 Resume
                        </h2>
                        <div className="space-y-4">
                            <label className="block">
                                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="spinner"></div>
                                            <p className="text-gray-400">Uploading...</p>
                                        </div>
                                    ) : profile.resumeFilePath ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-5xl">✅</span>
                                            <p className="text-green-400 font-semibold">Resume Uploaded</p>
                                            <p className="text-sm text-gray-500">Click to upload a new one</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-5xl">📤</span>
                                            <p className="text-gray-400">Click to upload your resume</p>
                                            <p className="text-sm text-gray-500">PDF or DOCX (Max 10MB)</p>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            🎓 Education
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">10th Marks (%)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="85"
                                    value={profile.tenthMarks || ''}
                                    onChange={(e) => setProfile({ ...profile, tenthMarks: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">12th Marks (%)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="90"
                                    value={profile.twelfthMarks || ''}
                                    onChange={(e) => setProfile({ ...profile, twelfthMarks: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Degree</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="B.Tech in Computer Science"
                                    value={profile.degree || ''}
                                    onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">University</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="XYZ University"
                                    value={profile.university || ''}
                                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Graduation Year</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="2024"
                                    value={profile.graduationYear || ''}
                                    onChange={(e) => setProfile({ ...profile, graduationYear: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Preferences */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            💼 Job Preferences
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Job Roles</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        className="input-field flex-1"
                                        placeholder="e.g., Software Engineer"
                                        id="jobRoleInput"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                const input = e.currentTarget as HTMLInputElement
                                                addToArray('jobRoles', input.value)
                                                input.value = ''
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('jobRoleInput') as HTMLInputElement
                                            addToArray('jobRoles', input.value)
                                            input.value = ''
                                        }}
                                        className="btn-secondary"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.jobRoles?.map((role, index) => (
                                        <span key={index} className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-sm font-semibold flex items-center gap-2">
                                            {role}
                                            <button onClick={() => removeFromArray('jobRoles', index)} className="hover:text-red-400">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Experience Level</label>
                                <select
                                    className="input-field"
                                    value={profile.experienceLevel || 'Mid'}
                                    onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                                >
                                    <option value="Entry">Entry Level</option>
                                    <option value="Mid">Mid Level</option>
                                    <option value="Senior">Senior Level</option>
                                    <option value="Lead">Lead/Principal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Preferred Locations</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        className="input-field flex-1"
                                        placeholder="e.g., San Francisco, CA"
                                        id="locationInput"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                const input = e.currentTarget as HTMLInputElement
                                                addToArray('preferredLocations', input.value)
                                                input.value = ''
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('locationInput') as HTMLInputElement
                                            addToArray('preferredLocations', input.value)
                                            input.value = ''
                                        }}
                                        className="btn-secondary"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.preferredLocations?.map((location, index) => (
                                        <span key={index} className="px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-sm font-semibold flex items-center gap-2">
                                            {location}
                                            <button onClick={() => removeFromArray('preferredLocations', index)} className="hover:text-red-400">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="remoteOnly"
                                    checked={profile.remoteOnly || false}
                                    onChange={(e) => setProfile({ ...profile, remoteOnly: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="remoteOnly" className="text-gray-300 font-semibold cursor-pointer">
                                    Remote Only
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">Min Salary (USD/year)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="80000"
                                        value={profile.minSalary || ''}
                                        onChange={(e) => setProfile({ ...profile, minSalary: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">Max Salary (USD/year)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="150000"
                                        value={profile.maxSalary || ''}
                                        onChange={(e) => setProfile({ ...profile, maxSalary: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary text-lg px-12 py-4 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes 💾'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
