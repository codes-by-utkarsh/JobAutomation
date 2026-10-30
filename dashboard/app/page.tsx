'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center pulse-glow">
                            <span className="text-2xl font-black">🦁</span>
                        </div>
                        <h1 className="text-2xl font-black gradient-text">The Beast</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <button className="btn-secondary">Login</button>
                        </Link>
                        <Link href="/register">
                            <button className="btn-primary">Get Started</button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                <div className="max-w-5xl mx-auto text-center">
                    <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold gradient-text-accent glass-card">
                            ⚡ AI-Powered Job Automation
                        </span>
                        <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
                            Hunt Jobs on
                            <br />
                            <span className="gradient-text">Autopilot</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            The Beast autonomously searches, customizes, and applies to jobs 24/7.
                            Powered by AI, driven by your career goals.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/register">
                                <button className="btn-primary text-lg px-12 py-5">
                                    Start Hunting 🎯
                                </button>
                            </Link>
                            <Link href="#features">
                                <button className="btn-secondary text-lg px-12 py-5">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="stat-card">
                            <div className="text-5xl font-black gradient-text mb-2">10k+</div>
                            <div className="text-gray-400 font-medium">Jobs Applied</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-5xl font-black gradient-text mb-2">24/7</div>
                            <div className="text-gray-400 font-medium">Automation</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-5xl font-black gradient-text mb-2">95%</div>
                            <div className="text-gray-400 font-medium">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 container mx-auto px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4">
                            <span className="gradient-text">Unleash</span> the Power
                        </h2>
                        <p className="text-xl text-gray-400">Built for the modern job seeker</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🔍',
                                title: 'Auto-Search',
                                description: 'Scrapes LinkedIn, Indeed, and Glassdoor every 2 hours for perfect matches',
                                gradient: 'from-purple-600 to-indigo-600'
                            },
                            {
                                icon: '🤖',
                                title: 'AI Auto-Apply',
                                description: 'Headless browser applies to jobs automatically with optimized responses',
                                gradient: 'from-indigo-600 to-cyan-600'
                            },
                            {
                                icon: '📝',
                                title: 'Smart Resumes',
                                description: 'AI customizes your resume for each job to maximize success rate',
                                gradient: 'from-cyan-600 to-teal-600'
                            },
                            {
                                icon: '🎯',
                                title: 'Strategy Engine',
                                description: 'Adapts application strategy based on context and response patterns',
                                gradient: 'from-pink-600 to-rose-600'
                            },
                            {
                                icon: '📊',
                                title: 'Analytics',
                                description: 'Track applications, interviews, and success metrics in real-time',
                                gradient: 'from-orange-600 to-amber-600'
                            },
                            {
                                icon: '🔐',
                                title: 'Secure & Private',
                                description: 'Enterprise-grade security with encrypted data storage',
                                gradient: 'from-violet-600 to-purple-600'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-8 group cursor-pointer"
                                style={{
                                    transitionDelay: `${index * 100}ms`
                                }}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-xl text-gray-400">Three simple steps to career success</p>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                step: '01',
                                title: 'Upload Your Profile',
                                description: 'Upload your resume and set your job preferences, desired roles, and salary expectations',
                                color: 'purple'
                            },
                            {
                                step: '02',
                                title: 'Activate The Beast',
                                description: 'Our AI starts hunting for perfect job matches across multiple platforms 24/7',
                                color: 'indigo'
                            },
                            {
                                step: '03',
                                title: 'Track & Interview',
                                description: 'Monitor applications in real-time and prepare for interviews that come flooding in',
                                color: 'cyan'
                            }
                        ].map((item, index) => (
                            <div key={index} className="glass-card p-8 flex items-start gap-6 group hover:scale-105 transition-transform duration-300">
                                <div className={`text-6xl font-black ${item.color === 'purple' ? 'text-purple-600' : item.color === 'indigo' ? 'text-indigo-600' : 'text-cyan-600'} opacity-20 group-hover:opacity-40 transition-opacity`}>
                                    {item.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10"></div>
                        <div className="relative z-10">
                            <h2 className="text-5xl font-black mb-6">
                                Ready to <span className="gradient-text">Dominate</span> Your Job Search?
                            </h2>
                            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                                Join thousands of professionals who've automated their way to success
                            </p>
                            <Link href="/register">
                                <button className="btn-primary text-xl px-16 py-6">
                                    Unleash The Beast 🦁
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 mt-20">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-xl font-black">🦁</span>
                            </div>
                            <span className="text-lg font-bold gradient-text">The Beast</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2026 The Beast. Autonomous Job Application Platform.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
