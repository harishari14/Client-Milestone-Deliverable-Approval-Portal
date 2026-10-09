/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project, ActivityLog, MilestoneStatus, Deliverable } from './types';
import { ProofLaneService } from './services/api';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { ActivityView } from './components/ActivityView';
import { ClientPortalModal } from './components/ClientPortalModal';
import { NewProjectModal } from './components/NewProjectModal';
import { NewMilestoneModal } from './components/NewMilestoneModal';
import { AddDeliverableModal } from './components/AddDeliverableModal';
import { 
  ExternalLink, 
  Plus, 
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'client-review' | 'activity'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [clientPortalProjectId, setClientPortalProjectId] = useState<string | null>(null);
  const [milestoneModalProjectId, setMilestoneModalProjectId] = useState<string | null>(null);
  const [deliverableModalTarget, setDeliverableModalTarget] = useState<{
    projectId: string;
    milestoneId: string;
  } | null>(null);

  const loadData = async () => {
    const list = await ProofLaneService.getProjects();
    setProjects(list);
    setActivities(ProofLaneService.getStoredActivities());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('projects');
  };

  const handleOpenClientPortal = (projectId: string) => {
    setClientPortalProjectId(projectId);
  };

  const handleCreateProject = async (projectData: Partial<Project>, clientId?: string) => {
    const created = await ProofLaneService.createProject(projectData, clientId);
    await loadData();
    setShowNewProjectModal(false);
    setSelectedProjectId(created.id);
    setCurrentView('projects');
  };

  const handleAddMilestone = async (projectId: string, milestone: any) => {
    await ProofLaneService.addMilestone(projectId, milestone);
    await loadData();
    setMilestoneModalProjectId(null);
  };

  const handleAddDeliverable = async (projectId: string, milestoneId: string, deliverable: Partial<Deliverable>) => {
    await ProofLaneService.addDeliverable(projectId, milestoneId, deliverable);
    await loadData();
    setDeliverableModalTarget(null);
  };

  const handleUpdateStatus = async (projectId: string, milestoneId: string, status: MilestoneStatus) => {
    await ProofLaneService.updateMilestoneStatus(projectId, milestoneId, status);
    await loadData();
  };

  const handleApproveMilestone = async (projectId: string, milestoneId: string, notes?: string) => {
    await ProofLaneService.approveMilestone(projectId, milestoneId, notes);
    await loadData();
  };

  const handleRequestRevision = async (projectId: string, milestoneId: string, changes: string) => {
    await ProofLaneService.requestRevision(projectId, milestoneId, changes);
    await loadData();
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const clientPortalProject = projects.find((p) => p.id === clientPortalProjectId);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
      {/* Top Bar Navigation */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view !== 'projects') {
            setSelectedProjectId(null);
          }
        }}
        onOpenNewProject={() => setShowNewProjectModal(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <DashboardView
            projects={projects}
            activities={activities}
            onSelectProject={handleSelectProject}
            onOpenClientPortal={handleOpenClientPortal}
            onNavigateToContracts={() => setCurrentView('projects')}
            onOpenNewProject={() => setShowNewProjectModal(true)}
          />
        )}

        {currentView === 'projects' && (
          <div>
            {selectedProject ? (
              <ProjectDetailView
                project={selectedProject}
                onBack={() => setSelectedProjectId(null)}
                onOpenClientPortal={handleOpenClientPortal}
                onAddMilestone={(pId) => setMilestoneModalProjectId(pId)}
                onAddDeliverable={(pId, mId) => setDeliverableModalTarget({ projectId: pId, milestoneId: mId })}
                onUpdateStatus={handleUpdateStatus}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                      Client Contracts & Milestones
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                      Manage project deliverables, test links, and payment milestone authorizations
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewProjectModal(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Contract</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p) => {
                    const approvedCount = (p.milestones || []).filter(
                      (m) => m.status === 'APPROVED' || m.status === 'PAID'
                    ).length;

                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                            <span className="font-semibold text-neutral-800">{p.client?.company}</span>
                            <span className="font-mono tabular-nums text-neutral-900 font-bold">
                              ${p.totalBudget.toLocaleString()}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-neutral-900 mb-1 leading-snug">
                            {p.title}
                          </h3>
                          <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                            {p.description}
                          </p>

                          <div className="space-y-1.5 text-xs text-neutral-500 mb-4">
                            <div className="flex justify-between">
                              <span>Milestones:</span>
                              <span className="font-mono text-neutral-800 font-medium">
                                {approvedCount} / {p.milestones?.length || 0} Complete
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Client:</span>
                              <span className="text-neutral-800">{p.client?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Due Date:</span>
                              <span className="font-mono text-neutral-800">{p.targetCompletionDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleSelectProject(p.id)}
                            className="font-semibold text-neutral-900 hover:text-neutral-700 cursor-pointer flex items-center gap-1"
                          >
                            <span>Manage Project</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenClientPortal(p.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer flex items-center gap-1"
                          >
                            <span>Client View</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'client-review' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-200">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Client Review Portal Simulation
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Experience what your clients see when they open their link to inspect deliverables and authorize payouts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((p) => {
                const pendingMilestones = (p.milestones || []).filter((m) => m.status === 'SUBMITTED');

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                          {p.client?.avatarInitials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900">{p.client?.company}</div>
                          <div className="text-[11px] text-neutral-500">{p.client?.name}</div>
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                        {p.title}
                      </h3>

                      <div className="p-3 bg-neutral-50 rounded border border-neutral-100 text-xs space-y-1 mb-4">
                        <div className="flex justify-between text-neutral-500">
                          <span>Pending Client Review:</span>
                          <span className="font-mono font-bold text-blue-700">
                            {pendingMilestones.length} milestone(s)
                          </span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Portal Token:</span>
                          <span className="font-mono text-neutral-700">{p.client?.portalToken}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenClientPortal(p.id)}
                      className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch Client Sign-Off Modal</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'activity' && (
          <ActivityView activities={activities} projects={projects} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">ProofLane</span>
            <span aria-hidden="true">·</span>
            <span>Client Milestone & Deliverable Approval Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="hover:text-neutral-900 cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('projects')}
              className="hover:text-neutral-900 cursor-pointer"
            >
              Contracts
            </button>
            <button
              onClick={() => setCurrentView('activity')}
              className="hover:text-neutral-900 cursor-pointer"
            >
              Activity Log
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {clientPortalProject && (
        <ClientPortalModal
          project={clientPortalProject}
          onClose={() => setClientPortalProjectId(null)}
          onApproveMilestone={handleApproveMilestone}
          onRequestRevision={handleRequestRevision}
        />
      )}

      {milestoneModalProjectId && (
        <NewMilestoneModal
          projectId={milestoneModalProjectId}
          onClose={() => setMilestoneModalProjectId(null)}
          onAdd={handleAddMilestone}
        />
      )}

      {deliverableModalTarget && (
        <AddDeliverableModal
          projectId={deliverableModalTarget.projectId}
          milestoneId={deliverableModalTarget.milestoneId}
          onClose={() => setDeliverableModalTarget(null)}
          onAdd={handleAddDeliverable}
        />
      )}
    </div>
  );
}
