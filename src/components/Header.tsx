import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'projects' | 'client-review' | 'activity';
  onNavigate: (view: 'dashboard' | 'projects' | 'client-review' | 'activity') => void;
  onOpenNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenNewProject,
}) => {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Wordmark Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-left font-bold text-xl tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              ProofLane
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors cursor-pointer py-1 ${
                currentView === 'dashboard'
                  ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className={`transition-colors cursor-pointer py-1 ${
                currentView === 'projects'
                  ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              Contracts & Milestones
            </button>
            <button
              onClick={() => onNavigate('client-review')}
              className={`transition-colors cursor-pointer py-1 ${
                currentView === 'client-review'
                  ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              Client Review Portal
            </button>
            <button
              onClick={() => onNavigate('activity')}
              className={`transition-colors cursor-pointer py-1 ${
                currentView === 'activity'
                  ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              Audit Activity
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Contract</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
