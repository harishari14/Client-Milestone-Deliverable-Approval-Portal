import React, { useState } from 'react';
import { ActivityLog, Project } from '../types';
import { Clock, Search, Filter, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

interface ActivityViewProps {
  activities: ActivityLog[];
  projects: Project[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities, projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch = 
      act.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.action.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'ALL') return matchesSearch;
    return matchesSearch && act.action.includes(selectedFilter);
  });

  const getActionBadge = (action: string) => {
    if (action.includes('APPROVED')) {
      return (
        <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved</span>
        </span>
      );
    }
    if (action.includes('REVISION')) {
      return (
        <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Revision Requested</span>
        </span>
      );
    }
    return (
      <span className="text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-medium flex items-center gap-1">
        <Send className="w-3.5 h-3.5 text-blue-600" />
        <span>Deliverable Submitted</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
          Contract Audit & Activity Log
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Immutable event log tracking deliverable submissions, client feedback, and milestone payout authorizations
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activity by actor, contract, or detail..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-md outline-none focus:border-neutral-900"
          />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-md text-xs">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-colors ${
              selectedFilter === 'ALL' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setSelectedFilter('APPROVED')}
            className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-colors ${
              selectedFilter === 'APPROVED' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Approvals
          </button>
          <button
            onClick={() => setSelectedFilter('REVISION')}
            className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-colors ${
              selectedFilter === 'REVISION' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Revisions
          </button>
          <button
            onClick={() => setSelectedFilter('DELIVERABLE')}
            className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-colors ${
              selectedFilter === 'DELIVERABLE' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Submissions
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No events match your filter criteria.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const relatedProject = projects.find((p) => p.id === act.projectId);

            return (
              <div key={act.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-900">{act.actor}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {new Date(act.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {relatedProject && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-neutral-700">{relatedProject.client?.company}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-neutral-800 font-medium">
                    {act.details}
                  </p>
                </div>

                <div className="shrink-0 sm:self-center">
                  {getActionBadge(act.action)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
