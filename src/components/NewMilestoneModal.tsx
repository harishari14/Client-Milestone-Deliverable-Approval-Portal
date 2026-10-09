import React, { useState } from 'react';
import { Milestone } from '../types';
import { X, Plus } from 'lucide-react';

interface NewMilestoneModalProps {
  projectId: string;
  onClose: () => void;
  onAdd: (projectId: string, milestone: Partial<Milestone>) => void;
}

export const NewMilestoneModal: React.FC<NewMilestoneModalProps> = ({ projectId, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('1500');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(projectId, {
      title: title.trim(),
      description: description.trim(),
      amount: Number(amount) || 1000,
      dueDate,
      status: 'DRAFT',
      deliverables: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Add Project Milestone</h2>
            <p className="text-xs text-neutral-500">Define a billable phase with deliverable proof criteria</p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Milestone Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Staging Environment & End-to-End Test Suite"
              className="w-full px-3 py-2 border border-neutral-300 rounded outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Scope & Acceptance Criteria</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What specifically will be proven or delivered for client sign-off?"
              className="w-full px-3 py-2 border border-neutral-300 rounded outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Milestone Value ($)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Target Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
              <span>Add Milestone</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
