import React, { useState } from 'react';
import { Project } from '../types';
import { X, Sparkles, Plus } from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (project: Partial<Project>, clientId?: string) => void;
}

const TEMPLATES = [
  {
    title: 'Fintech Multi-Currency Ledger API',
    description: 'PostgreSQL ACID-compliant transaction microservice in Spring Boot with idempotency keys and audit trail.',
    budget: 5400,
    company: 'Apex Treasury Group',
    clientName: 'Julian Sterling',
  },
  {
    title: 'SaaS Stripe Billing & Webhook Dispatcher',
    description: 'Automated subscription tier sync, customer portal sessions, and failure retry dispatchers.',
    budget: 4200,
    company: 'KiteMetrics Analytics',
    clientName: 'Chloe Bennett',
  },
  {
    title: 'HIPAA Patient Booking & Telehealth Slot Engine',
    description: 'Concurrent slot locking mechanism preventing double bookings with doctor notification triggers.',
    budget: 4800,
    company: 'NovaHealth Clinical',
    clientName: 'Dr. Evelyn Reed',
  },
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalBudget, setTotalBudget] = useState('4500');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [clientName, setClientName] = useState('Elena Rostova');
  const [company, setCompany] = useState('Nordic Freight Co.');

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setTotalBudget(String(tmpl.budget));
    setCompany(tmpl.company);
    setClientName(tmpl.clientName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      totalBudget: Number(totalBudget) || 3000,
      currency: 'USD',
      targetCompletionDate: targetDate,
      milestones: [
        {
          id: `m_${Date.now()}_1`,
          projectId: '',
          title: 'Architecture & PostgreSQL Data Schema',
          description: 'Establish entities, JPA repositories, and Render database migrations.',
          amount: Math.round(Number(totalBudget) * 0.35),
          dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
          status: 'DRAFT',
          orderIndex: 1,
          deliverables: [],
        },
        {
          id: `m_${Date.now()}_2`,
          projectId: '',
          title: 'Core Business Logic & REST Endpoints',
          description: 'Build services, validation, and staging endpoints.',
          amount: Math.round(Number(totalBudget) * 0.45),
          dueDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
          status: 'DRAFT',
          orderIndex: 2,
          deliverables: [],
        },
        {
          id: `m_${Date.now()}_3`,
          projectId: '',
          title: 'Staging Delivery & Client Sign-Off',
          description: 'Final verification, testing credentials, and production handoff.',
          amount: Math.round(Number(totalBudget) * 0.2),
          dueDate: targetDate,
          status: 'DRAFT',
          orderIndex: 3,
          deliverables: [],
        },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">New Client Contract</h2>
            <p className="text-xs text-neutral-500">Create a contract with milestone payout structure</p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Idea Templates */}
        <div className="pt-4">
          <div className="text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
            <span>Load Quick Industry Preset:</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.title}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="text-left p-2.5 rounded bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-neutral-900">{tmpl.title}</div>
                  <div className="text-neutral-500 text-[11px]">{tmpl.company}</div>
                </div>
                <div className="font-mono font-bold text-neutral-800">${tmpl.budget}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Contract Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Microservice API & Payment Gateway"
              className="w-full px-3 py-2 border border-neutral-300 rounded outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of deliverables and scope..."
              className="w-full px-3 py-2 border border-neutral-300 rounded outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Total Contract Value ($)</label>
              <input
                type="number"
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Target Completion Date</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Contract</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
