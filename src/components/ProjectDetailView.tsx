import React from 'react';
import { Project, Milestone, Deliverable, MilestoneStatus } from '../types';
import { 
  ArrowLeft, 
  ExternalLink, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Github, 
  Globe, 
  Video, 
  Figma, 
  Send,
  Sparkles
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onOpenClientPortal: (projectId: string) => void;
  onAddMilestone: (projectId: string) => void;
  onAddDeliverable: (projectId: string, milestoneId: string) => void;
  onUpdateStatus: (projectId: string, milestoneId: string, status: MilestoneStatus) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onOpenClientPortal,
  onAddMilestone,
  onAddDeliverable,
  onUpdateStatus,
}) => {
  const milestones = project.milestones || [];
  const approvedTotal = milestones
    .filter((m) => m.status === 'APPROVED' || m.status === 'PAID')
    .reduce((sum, m) => sum + m.amount, 0);

  const getDeliverableIcon = (type: string) => {
    switch (type) {
      case 'GITHUB_PR':
        return <Github className="w-3.5 h-3.5 text-neutral-800" />;
      case 'FIGMA_DESIGN':
        return <Figma className="w-3.5 h-3.5 text-purple-600" />;
      case 'DEMO_VIDEO':
        return <Video className="w-3.5 h-3.5 text-rose-600" />;
      case 'STAGING_URL':
        return <Globe className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-neutral-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Contracts</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenClientPortal(project.id)}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Client Sign-Off Portal</span>
          </button>
          <button
            onClick={() => onAddMilestone(project.id)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Project Banner Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span className="font-semibold text-neutral-900">{project.client?.company}</span>
              <span aria-hidden="true">·</span>
              <span>Primary Stakeholder: {project.client?.name} ({project.client?.email})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 shrink-0 min-w-[220px]">
            <div className="text-xs text-neutral-500">Contract Financials</div>
            <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-0.5">
              ${project.totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-neutral-500 mt-2 flex justify-between">
              <span>Released / Approved:</span>
              <span className="font-mono tabular-nums text-emerald-700 font-medium">
                ${approvedTotal.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-neutral-500 mt-1 flex justify-between">
              <span>Target Delivery:</span>
              <span className="font-mono tabular-nums text-neutral-700">
                {project.targetCompletionDate}
              </span>
            </div>
          </div>
        </div>

        {/* Client Access Token Info */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-neutral-50 -mx-6 -mb-6 p-4 rounded-b-lg border-t border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-600">
            <span className="font-medium text-neutral-800">Client Magic Review Token:</span>
            <code className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-mono text-neutral-900">
              {project.client?.portalToken}
            </code>
          </div>
          <span className="text-neutral-500">
            Clients access the review link without needing passwords to authorize payments.
          </span>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Deliverable Milestones</h2>
            <p className="text-xs text-neutral-500">
              Each milestone links code or design artifacts to payout authorizations
            </p>
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            {milestones.length} milestones defined
          </div>
        </div>

        {milestones.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center space-y-3">
            <p className="text-sm text-neutral-600">No milestones created yet for this contract.</p>
            <button
              onClick={() => onAddMilestone(project.id)}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md cursor-pointer"
            >
              Add First Milestone
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((m, idx) => {
              const deliverables = m.deliverables || [];

              return (
                <div
                  key={m.id}
                  className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                        <span className="font-mono font-semibold text-neutral-700">Milestone #{idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>Due {m.dueDate}</span>
                        {m.approvedAt && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700">
                              Approved on {new Date(m.approvedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-neutral-900">{m.title}</h3>
                      <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 sm:self-start">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Payout Amount</div>
                        <div className="text-lg font-bold font-mono tabular-nums text-neutral-900">
                          ${m.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <select
                        value={m.status}
                        onChange={(e) => onUpdateStatus(project.id, m.id, e.target.value as MilestoneStatus)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded border cursor-pointer outline-none ${
                          m.status === 'APPROVED' || m.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : m.status === 'SUBMITTED'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : m.status === 'REVISION_REQUESTED'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="SUBMITTED">SUBMITTED (IN REVIEW)</option>
                        <option value="REVISION_REQUESTED">REVISION REQUESTED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PAID">PAID</option>
                      </select>
                    </div>
                  </div>

                  {/* Revision Feedback Callout if applicable */}
                  {m.reviewNotes && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Client Review Feedback:</span>
                      </div>
                      <p className="text-amber-800 leading-relaxed pl-5">
                        "{m.reviewNotes}"
                      </p>
                    </div>
                  )}

                  {/* Deliverables List (Proof Artifacts) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                      <span>Submitted Proof & Artifacts ({deliverables.length})</span>
                      <button
                        onClick={() => onAddDeliverable(project.id, m.id)}
                        className="text-neutral-900 hover:text-neutral-700 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Deliverable Link</span>
                      </button>
                    </div>

                    {deliverables.length === 0 ? (
                      <div className="p-3 bg-neutral-50 rounded border border-dashed border-neutral-200 text-xs text-neutral-500 text-center">
                        No deliverable links attached yet. Click "Add Deliverable Link" to provide staging or code verification.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {deliverables.map((d) => (
                          <div
                            key={d.id}
                            className="p-3 rounded border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 mb-0.5">
                                {getDeliverableIcon(d.type)}
                                <span className="truncate">{d.title}</span>
                              </div>
                              {d.description && (
                                <p className="text-[11px] text-neutral-500 line-clamp-1 mb-2">
                                  {d.description}
                                </p>
                              )}
                            </div>

                            <a
                              href={d.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-[11px] font-mono text-blue-600 hover:text-blue-800 truncate flex items-center gap-1 pt-1 border-t border-neutral-100"
                            >
                              <span className="truncate">{d.url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
