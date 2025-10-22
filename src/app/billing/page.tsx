'use client';

import { useState, useEffect } from 'react';
import { Pricing } from '@/components/billing/Pricing';

// Enhanced Pricing Component
function PricingComponent({ plans, title, description }: { plans: any[], title: string, description: string }) {
  return <Pricing plans={plans} title={title} description={description} />;
}
import LoadingScreen from '@/components/ui/LoadingScreen';
import DeepOceanBackground from '@/components/ui/DeepOceanBackground';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Zap, Users, Palette, Bot, ArrowLeft } from 'lucide-react';

const pricingPlans = [
  {
    name: "Starter",
    price: "0",
    yearlyPrice: "0",
    period: "month",
    features: [
      "Up to 3 design projects",
      "Basic AI assistance",
      "Canvas editor with essential tools",
      "Export to HTML/CSS",
      "Community support",
      "Basic templates library"
    ],
    description: "Perfect for individuals getting started with design",
    buttonText: "Get Started Free",
    href: "/signup?plan=starter",
    isPopular: false,
  },
  {
    name: "Professional",
    price: "29",
    yearlyPrice: "24",
    period: "month",
    features: [
      "Unlimited design projects",
      "Advanced AI design assistant",
      "Full element toolkit & shapes",
      "Export to React, Vue, Angular",
      "Priority support",
      "Premium templates library",
      "Team collaboration (up to 5 members)",
      "Version history & backups",
      "Custom branding removal"
    ],
    description: "Ideal for professional designers and small teams",
    buttonText: "Start Professional",
    href: "/signup?plan=professional",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "99",
    yearlyPrice: "79",
    period: "month",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Advanced AI with custom training",
      "White-label solutions",
      "API access & integrations",
      "Dedicated account manager",
      "Custom templates & components",
      "Advanced analytics & reporting",
      "SSO & enterprise security",
      "24/7 phone support"
    ],
    description: "For large teams and organizations with advanced needs",
    buttonText: "Contact Sales",
    href: "/contact?plan=enterprise",
    isPopular: false,
  },
];

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBilling, setShowBilling] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowBilling(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setShowBilling(true);
  };

  if (!showBilling) {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-white/10 bg-black/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6"
          >
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-all text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>
          </motion.div>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
            >
              <CreditCard className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              My Subscription & Management
            </h1>
            <p className="text-white/70 text-lg">
              Manage your subscription, billing, and account settings
            </p>
          </div>
        </div>
      </motion.div>

      {/* Current Subscription Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="py-8 bg-transparent"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Current Plan</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-white mb-1">Plan</h3>
                <p className="text-2xl font-bold text-blue-400">Starter</p>
                <p className="text-sm text-white/70">Free Forever</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-1">Usage</h3>
                <p className="text-lg font-semibold text-white">2 / 3 Projects</p>
                <p className="text-sm text-white/70">Projects used this month</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-1">Next Billing</h3>
                <p className="text-lg font-semibold text-white">-</p>
                <p className="text-sm text-white/70">No billing for free plan</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    // Scroll to pricing section
                    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Upgrade Plan
                </button>
                <button className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                  View Usage Details
                </button>
                <button className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                  Billing History
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="py-16 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Choose Open Design?
            </h2>
            <p className="text-white/70">
              The most advanced AI-powered design platform for modern creators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "AI-Powered Design",
                description: "Generate components, layouts, and entire designs with advanced AI assistance"
              },
              {
                icon: Palette,
                title: "Professional Tools",
                description: "Complete design toolkit with shapes, elements, and advanced canvas features"
              },
              {
                icon: Zap,
                title: "Export Anywhere",
                description: "Export to HTML, React, Vue, Angular, or download as images and packages"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Work together in real-time with version control and project sharing"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with SSO, advanced permissions, and compliance"
              },
              {
                icon: CreditCard,
                title: "Flexible Billing",
                description: "Monthly or annual billing with no hidden fees and transparent pricing"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="text-center p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all"
                >
                  <Icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        id="pricing-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <PricingComponent
          plans={pricingPlans}
          title="Upgrade Your Plan"
          description="Choose the plan that works for you. All plans include access to our platform, AI assistance, and dedicated support."
        />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="py-16 bg-transparent"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, our Starter plan is completely free forever. You can also try Professional features with a 14-day free trial."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Absolutely. You can cancel your subscription at any time with no cancellation fees."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee for all paid plans."
              },
              {
                question: "Is my data secure?",
                answer: "Yes, we use enterprise-grade security with encryption, regular backups, and SOC 2 compliance."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10"
              >
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-sm text-white/70">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="py-16 text-center"
      >
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Start Designing?
          </h2>
          <p className="text-white/70 mb-8">
            Join thousands of designers who are already creating amazing projects with Open Design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/signup?plan=starter"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Start Free
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/contact"
              className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </motion.a>
          </div>
          
          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/" className="text-white/70 hover:text-white transition-colors">
              ← Back to Designer Studio
            </a>
            <span className="text-white/30">|</span>
            <a href="/dashboard" className="text-white/70 hover:text-white transition-colors">
              Dashboard
            </a>
            <span className="text-white/30">|</span>
            <a href="/contact" className="text-white/70 hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}