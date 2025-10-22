'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, CreditCard, Mail, User, X } from 'lucide-react';
import Link from 'next/link';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      href: '/dashboard',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: CreditCard, 
      href: '/billing',
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      id: 'contact', 
      label: 'Contact', 
      icon: Mail, 
      href: '/contact',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: User, 
      href: '/signup',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`flex items-center space-x-3 px-4 py-3 ${action.color} text-white rounded-lg shadow-lg transition-all hover:scale-105 min-w-[140px]`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}