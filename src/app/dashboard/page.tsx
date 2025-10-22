'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FolderOpen, 
  Clock, 
  Star, 
  ArrowRight,
  BarChart3,
  Users,
  Zap,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowDashboard(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setShowDashboard(true);
  };

  const recentProjects = [
    { id: 1, name: 'Landing Page Redesign', lastModified: '2 hours ago', status: 'In Progress' },
    { id: 2, name: 'Mobile App UI', lastModified: '1 day ago', status: 'Completed' },
    { id: 3, name: 'Dashboard Components', lastModified: '3 days ago', status: 'Review' },
  ];

  const stats = [
    { label: 'Total Projects', value: '12', icon: FolderOpen, color: 'text-blue-400' },
    { label: 'Hours Saved', value: '48', icon: Clock, color: 'text-green-400' },
    { label: 'AI Generations', value: '156', icon: Zap, color: 'text-purple-400' },
    { label: 'Team Members', value: '3', icon: Users, color: 'text-orange-400' },
  ];

  if (!showDashboard) {
    return (
      <LoadingScreen 
        isLoading={isLoading}
        onComplete={handleLoadingComplete}
        minDuration={1000}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Deep Ocean Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(70% 55% at 50% 50%, #2a5d77 0%, #184058 18%, #0f2a43 34%, #0a1b30 50%, #071226 66%, #040d1c 80%, #020814 92%, #01040d 97%, #000309 100%),
            radial-gradient(160% 130% at 10% 10%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%),
            radial-gradient(160% 130% at 90% 90%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%)
          `
        }}
      />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, John! 👋
                </h1>
                <p className="text-white/70 text-lg">
                  Here's what's happening with your projects today.
                </p>
              </div>
              <Link
                href="/"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
                <Link 
                  href="/"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{project.name}</div>
                        <div className="text-sm text-white/70">{project.lastModified}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {project.status}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <Link
                  href="/"
                  className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Plus className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Start New Project</div>
                    <div className="text-sm text-white/70">Create a new design project</div>
                  </div>
                </Link>
                
                <Link
                  href="/billing"
                  className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-400/20 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  <div>
                    <div className="font-medium text-white">Upgrade Plan</div>
                    <div className="text-sm text-white/70">Access more features</div>
                  </div>
                </Link>
                
                <Link
                  href="/contact"
                  className="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <Users className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="font-medium text-white">Get Support</div>
                    <div className="text-sm text-white/70">Contact our team</div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                Designer Studio
              </Link>
              <span className="text-white/30">|</span>
              <Link href="/billing" className="text-white/70 hover:text-white transition-colors">
                Billing & Plans
              </Link>
              <span className="text-white/30">|</span>
              <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                Support
              </Link>
              <span className="text-white/30">|</span>
              <Link href="/signup" className="text-white/70 hover:text-white transition-colors">
                Account Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}