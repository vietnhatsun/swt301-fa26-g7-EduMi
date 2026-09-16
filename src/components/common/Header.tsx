import React from 'react';
import { siteConfig } from '@/config/site';

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Docs</a>
        </nav>
      </div>
    </header>
  );
}
