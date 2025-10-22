'use client';

import { ReactNode } from 'react';
import DeepOceanBackground from '@/components/ui/DeepOceanBackground';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <DeepOceanBackground>
      <div className={`min-h-screen w-full ${className}`}>
        {children}
      </div>
    </DeepOceanBackground>
  );
}