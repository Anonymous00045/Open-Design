'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DeepOceanBackground from '@/components/ui/DeepOceanBackground';

function SignupContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'starter';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowSignup(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setShowSignup(true);
  };

  const planDetails = {
    starter: { name: 'Starter', price: 'Free', color: 'text-green-600' },
    professional: { name: 'Professional', price: '$29/month', color: 'text-blue-600' },
    enterprise: { name: 'Enterprise', price: '$99/month', color: 'text-purple-600' }
  };

  const currentPlan = planDetails[selectedPlan as keyof typeof planDetails] || planDetails.starter;

  if (!showSignup) {
    return (
      <LoadingScreen
        isLoading={isLoading}
        onComplete={handleLoadingComplete}
        minDuration={1000}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-black relative flex items-center justify-center p-4">
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
      <div className="relative z-10 w-full max-w-md">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {/* Back Link */}
          <Link
            href="/billing"
            className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Billing
          </Link>

          {/* Signup Card */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">OD</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Create Your Account
              </h1>
              <p className="text-white/70">
                Get started with Open Design today
              </p>
            </div>

            {/* Selected Plan */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Selected Plan</p>
                  <p className="font-semibold text-white">{currentPlan.name}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${currentPlan.color}`}>{currentPlan.price}</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <Check className="w-3 h-3 mr-1" />
                    <span>Selected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white placeholder-white/50"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white placeholder-white/50"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-white placeholder-white/50"
                  placeholder="Create a password"
                />
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-border"
                />
                <label htmlFor="terms" className="text-sm text-white/70">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Create Account
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center text-xs text-white/70"
          >
            🔒 Your data is encrypted and secure. We never share your information.
          </motion.div>
          
          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/" className="text-white/70 hover:text-white transition-colors">
                ← Back to Designer Studio
              </a>
              <span className="text-white/30">|</span>
              <a href="/billing" className="text-white/70 hover:text-white transition-colors">
                View Plans
              </a>
              <span className="text-white/30">|</span>
              <a href="/contact" className="text-white/70 hover:text-white transition-colors">
                Need Help?
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingScreen isLoading={true} />}>
      <SignupContent />
    </Suspense>
  );
}