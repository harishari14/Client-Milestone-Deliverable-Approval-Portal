import React from 'react';
import { Project, ActivityLog } from '../types';
import { 
  ArrowUpRight, 
  ExternalLink, 
  Clock, 
  Layers,
  ChevronRight,
  FileCheck2
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  activities: ActivityLog[];
  onSelectProject: (projectId: string) => void;
  onOpenClientPortal: (projectId: string) => void;
  onNavigateToContracts: () => void;
  onOpenNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  activities,
  onSelectProject,
  onOpenClientPortal,
  onNavigateToContracts,
  onOpenNewProject,
}) => {
  // Aggregate KPIs
  const totalContractValue = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
  
  const allMilestones = projects.flatMap((p) => p.milestones || []);
  
  const approvedMilestones = allMilestones.filter((m) => m.status === 'APPROVED' || m.status === 'PAID');
  const approvedValue = approvedMilestones.reduce((sum, m) => sum + (m.amount || 0), 0);

  const underReviewMilestones = allMilestones.filter((m) => m.status === 'SUBMITTED');
  const underReviewValue = underReviewMilestones.reduce((sum, m) => sum + (m.amount || 0), 0);

  const revisionNeededCount = allMilestones.filter((m) => m.status === 'REVISION_REQUESTED').length;
  const draftCount = allMilestones.filter((m) => m.status === 'DRAFT').length;

  return (
    <div className="space-y-8">
      {/* Workspace Banner */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono tracking-wider uppercase text-neutral-400">
            Client Deliverable & Milestone Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            ProofLane: Milestone Approval & Deliverable Verification
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Manage client project deliverables, submit verifiable work artifacts (staging URLs, design specs, pull requests), 
            and coordinate milestone payment sign-offs with external stakeholders.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-100 rounded-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Create New Contract</span>
            </button>
            <button
              onClick={onNavigateToContracts}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>View All Contracts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quantitative KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="text-xs font-medium text-neutral-500 mb-1">Total Contract Value</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            ${totalContractValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Across {projects.length} active client contracts
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="text-xs font-medium text-neutral-500 mb-1">Approved & Released</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            ${approvedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Authorized by clients via review portals
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="text-xs font-medium text-neutral-500 mb-1">In Client Review</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-700">
            ${underReviewValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Awaiting client sign-off on deliverables
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="text-xs font-medium text-neutral-500 mb-1">Revisions Pending</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700">
            {revisionNeededCount}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Milestones flagged for developer updates
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Projects & Deliverable Milestones */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Active Client Engagements</h2>
              <p className="text-xs text-neutral-500">Live projects with milestone escrow & approval status</p>
            </div>
            <button
              onClick={onOpenNewProject}
              className="text-xs font-medium text-neutral-700 hover:text-neutral-900 cursor-pointer flex items-center gap-1"
            >
              <span>Add contract</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => {
              const milestones = project.milestones || [];
              const approvedCount = milestones.filter((m) => m.status === 'APPROVED' || m.status === 'PAID').length;
              const percent = milestones.length > 0 ? Math.round((approvedCount / milestones.length) * 100) : 0;

              return (
                <div
                  key={project.id}
                  className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-neutral-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                        <span className="font-medium text-neutral-700">{project.client?.company}</span>
                        <span aria-hidden="true">·</span>
                        <span>Client: {project.client?.name}</span>
                        <span aria-hidden="true">·</span>
                        <span>Due {project.targetCompletionDate}</span>
                      </div>
                      <h3 className="text-base font-semibold text-neutral-900 hover:text-neutral-700 cursor-pointer"
                        onClick={() => onSelectProject(project.id)}
                      >
                        {project.title}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <div className="text-xs text-neutral-500">Contract Value</div>
                      <div className="text-lg font-bold font-mono tabular-nums text-neutral-900">
                        ${project.totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Milestones Bar */}
                  <div className="py-4">
                    <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
                      <span>Milestones Completed: {approvedCount} of {milestones.length}</span>
                      <span className="font-mono tabular-nums font-semibold">{percent}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestone Track Badges */}
                  <div className="flex flex-wrap gap-2 pt-1 pb-3">
                    {milestones.map((m, idx) => {
                      let statusText = 'Draft';
                      let statusColor = 'text-neutral-500 bg-neutral-100';
                      if (m.status === 'APPROVED' || m.status === 'PAID') {
                        statusText = 'Approved';
                        statusColor = 'text-emerald-700 bg-emerald-50';
                      } else if (m.status === 'SUBMITTED') {
                        statusText = 'In Review';
                        statusColor = 'text-blue-700 bg-blue-50';
                      } else if (m.status === 'REVISION_REQUESTED') {
                        statusText = 'Revision Needed';
                        statusColor = 'text-amber-800 bg-amber-50';
                      }

                      return (
                        <div
                          key={m.id}
                          className={`text-xs px-2.5 py-1 rounded flex items-center gap-1.5 font-medium ${statusColor}`}
                          title={`${m.title} - $${m.amount}`}
                        >
                          <span className="font-mono">M{idx + 1}:</span>
                          <span className="truncate max-w-[120px]">{m.title}</span>
                          <span className="font-mono tabular-nums font-semibold">(${m.amount})</span>
                          <span>— {statusText}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="font-semibold text-neutral-900 hover:text-neutral-700 cursor-pointer flex items-center gap-1"
                    >
                      <span>Manage Milestones & Proof</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenClientPortal(project.id)}
                      className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                    >
                      <span>Simulate Client Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Milestone Summary & Audit Trail */}
        <div className="space-y-6">
          {/* Milestone Status Breakdown Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900">Milestone Pipeline Status</h3>
              <FileCheck2 className="w-4 h-4 text-neutral-500" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-600">Approved & Settled</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {approvedMilestones.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-600">Under Client Review</span>
                <span className="font-mono font-bold text-blue-700 tabular-nums">
                  {underReviewMilestones.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-600">Revisions Requested</span>
                <span className="font-mono font-bold text-amber-700 tabular-nums">
                  {revisionNeededCount}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-neutral-600">Draft / Upcoming</span>
                <span className="font-mono font-bold text-neutral-700 tabular-nums">
                  {draftCount}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Audit Log */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900">Recent Activity</h3>
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="space-y-3">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="text-xs border-b border-neutral-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-neutral-500 mb-0.5">
                    <span className="font-medium text-neutral-800">{act.actor}</span>
                    <span className="font-mono tabular-nums">
                      {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-snug">{act.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
