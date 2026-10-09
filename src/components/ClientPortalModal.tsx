import React, { useState } from 'react';
import { Project, Milestone } from '../types';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Send, 
  Clock, 
  ChevronRight,
  FileCheck
} from 'lucide-react';

interface ClientPortalModalProps {
  project: Project;
  onClose: () => void;
  onApproveMilestone: (projectId: string, milestoneId: string, notes?: string) => void;
  onRequestRevision: (projectId: string, milestoneId: string, changes: string) => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  project,
  onClose,
  onApproveMilestone,
  onRequestRevision,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    project.milestones.find((m) => m.status === 'SUBMITTED')?.id || project.milestones[0]?.id || ''
  );
  const [actionTab, setActionTab] = useState<'approve' | 'revision'>('approve');
  const [clientNotes, setClientNotes] = useState('');
  const [revisionChanges, setRevisionChanges] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedMilestone = project.milestones.find((m) => m.id === selectedMilestoneId);

  const handleApprove = () => {
    if (!selectedMilestone) return;
    onApproveMilestone(project.id, selectedMilestone.id, clientNotes);
    setSuccessMessage(`Milestone "${selectedMilestone.title}" ($${selectedMilestone.amount}) has been approved!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleRevision = () => {
    if (!selectedMilestone || !revisionChanges.trim()) return;
    onRequestRevision(project.id, selectedMilestone.id, revisionChanges);
    setSuccessMessage(`Revision request sent to developer for "${selectedMilestone.title}".`);
    setRevisionChanges('');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200">
        {/* Client Top Header */}
        <div className="bg-neutral-900 text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-200 font-mono">
              {project.client?.avatarInitials || 'CL'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>Client Review Portal</span>
                <span aria-hidden="true">·</span>
                <span>{project.client?.company}</span>
              </div>
              <h2 className="text-base font-bold text-white">
                {project.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Milestone Selector */}
            <div className="md:col-span-1 space-y-2 border-r border-neutral-100 pr-0 md:pr-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Project Milestones
              </div>

              {project.milestones.map((m, idx) => {
                const isSelected = m.id === selectedMilestoneId;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMilestoneId(m.id);
                      setSuccessMessage(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-[11px] opacity-80">Phase {idx + 1}</span>
                      <span className="font-mono tabular-nums font-semibold">${m.amount}</span>
                    </div>
                    <div className="text-xs font-semibold truncate leading-tight">{m.title}</div>
                    <div className="text-[11px] mt-1.5 opacity-80">
                      Status: {m.status}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Milestone Detail & Review Decision */}
            <div className="md:col-span-2 space-y-6">
              {selectedMilestone ? (
                <>
                  <div className="space-y-3 pb-4 border-b border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        Payment Authorization Amount
                      </span>
                      <span className="text-xl font-bold font-mono tabular-nums text-neutral-900">
                        ${selectedMilestone.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900">
                      {selectedMilestone.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {selectedMilestone.description}
                    </p>

                    <div className="text-xs text-neutral-500 flex items-center gap-2">
                      <span>Target Due Date: {selectedMilestone.dueDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>Current Status: <strong className="text-neutral-900">{selectedMilestone.status}</strong></span>
                    </div>
                  </div>

                  {/* Deliverable Proof Links */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-neutral-800">
                      Submitted Verification Artifacts
                    </div>

                    {selectedMilestone.deliverables?.length === 0 ? (
                      <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-500">
                        Developer has not uploaded deliverable links for this milestone yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedMilestone.deliverables.map((d) => (
                          <div
                            key={d.id}
                            className="p-3 bg-neutral-50 border border-neutral-200 rounded-md flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-neutral-900">{d.title}</div>
                              {d.description && (
                                <div className="text-neutral-500 text-[11px] mt-0.5">{d.description}</div>
                              )}
                            </div>
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="px-3 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-neutral-800 font-medium flex items-center gap-1 shrink-0 ml-3"
                            >
                              <span>Test Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Action Controls */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
                      <button
                        onClick={() => setActionTab('approve')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                          actionTab === 'approve'
                            ? 'bg-emerald-700 text-white'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        Approve & Authorize Payout
                      </button>
                      <button
                        onClick={() => setActionTab('revision')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                          actionTab === 'revision'
                            ? 'bg-amber-700 text-white'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        Request Changes
                      </button>
                    </div>

                    {actionTab === 'approve' ? (
                      <div className="space-y-3">
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          By approving this milestone, you confirm that the deliverables satisfy the contract requirements and authorize releasing <strong>${selectedMilestone.amount}</strong>.
                        </p>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Optional Approval Note to Developer:
                          </label>
                          <input
                            type="text"
                            value={clientNotes}
                            onChange={(e) => setClientNotes(e.target.value)}
                            placeholder="e.g. Looks great, verified on staging and ready to deploy."
                            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 outline-none"
                          />
                        </div>
                        <button
                          onClick={handleApprove}
                          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Confirm Sign-Off & Release Milestone</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          Specify what adjustments or bug fixes are required before approving this payment milestone.
                        </p>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Required Adjustments / Feedback:
                          </label>
                          <textarea
                            rows={3}
                            value={revisionChanges}
                            onChange={(e) => setRevisionChanges(e.target.value)}
                            placeholder="e.g. The checkout button on mobile viewport overlaps the summary card. Please fix and resubmit."
                            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 outline-none"
                          />
                        </div>
                        <button
                          onClick={handleRevision}
                          disabled={!revisionChanges.trim()}
                          className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-50 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Revision Request to Developer</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs text-neutral-500 py-8 text-center">
                  Select a milestone to review.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Secure Sign-Off Session · Authenticated via Magic Token</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-neutral-700 hover:text-neutral-900 cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
