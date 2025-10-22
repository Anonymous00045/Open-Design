'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DeepOceanBackground from '@/components/ui/DeepOceanBackground';

function ContactContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContact(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setShowContact(true);
  };

  if (!showContact) {
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
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link 
            href="/billing"
            className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Billing
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Contact Our Sales Team
            </h1>
            <p className="text-white/70 text-lg">
              {plan === 'enterprise' 
                ? 'Let&apos;s discuss your Enterprise needs'
                : 'Get in touch with our team'
              }
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Send us a message
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white placeholder-white/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white placeholder-white/50"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white placeholder-white/50"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white placeholder-white/50"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Team Size
                </label>
                <select className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white">
                  <option>1-10 people</option>
                  <option>11-50 people</option>
                  <option>51-200 people</option>
                  <option>200+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 resize-none text-white placeholder-white/50"
                  placeholder="Tell us about your needs..."
                  defaultValue={plan === 'enterprise' ? 'I&apos;m interested in the Enterprise plan and would like to discuss our requirements.' : ''}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Get in touch
              </h2>
              <p className="text-white/70 mb-8">
                Our team is here to help you get the most out of Open Design. 
                Reach out and we&apos;ll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-white/90">sales@opendesign.com</p>
                  <p className="text-sm text-white/70">We&apos;ll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <p className="text-white/90">+1 (555) 123-4567</p>
                  <p className="text-sm text-white/70">Mon-Fri 9am-6pm EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Live Chat</h3>
                  <p className="text-white/90">Available in-app</p>
                  <p className="text-sm text-white/70">Real-time support</p>
                </div>
              </div>
            </div>

            {plan === 'enterprise' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="p-6 bg-blue-500/10 border border-blue-400/20 rounded-lg"
              >
                <h3 className="font-semibold text-white mb-2">Enterprise Benefits</h3>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• Dedicated account manager</li>
                  <li>• Custom onboarding & training</li>
                  <li>• Priority support & SLA</li>
                  <li>• Custom integrations</li>
                  <li>• Volume discounts available</li>
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Quick Navigation Footer */}
        <div className="text-center py-8 border-t border-white/10 mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/" className="text-white/70 hover:text-white transition-colors">
              ← Back to Designer Studio
            </a>
            <span className="text-white/30">|</span>
            <a href="/dashboard" className="text-white/70 hover:text-white transition-colors">
              Dashboard
            </a>
            <span className="text-white/30">|</span>
            <a href="/billing" className="text-white/70 hover:text-white transition-colors">
              Billing & Plans
            </a>
            <span className="text-white/30">|</span>
            <a href="/signup" className="text-white/70 hover:text-white transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<LoadingScreen isLoading={true} />}>
      <ContactContent />
    </Suspense>
  );
}