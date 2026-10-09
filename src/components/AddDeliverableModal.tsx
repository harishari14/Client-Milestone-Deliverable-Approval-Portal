import React, { useState } from 'react';
import { Deliverable, DeliverableType } from '../types';
import { X, Plus, Link as LinkIcon } from 'lucide-react';

interface AddDeliverableModalProps {
  projectId: string;
  milestoneId: string;
  onClose: () => void;
  onAdd: (projectId: string, milestoneId: string, deliverable: Partial<Deliverable>) => void;
}

export const AddDeliverableModal: React.FC<AddDeliverableModalProps> = ({
  projectId,
  milestoneId,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DeliverableType>('STAGING_URL');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onAdd(projectId, milestoneId, {
      title: title.trim(),
      type,
      url: url.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Add Deliverable Proof</h2>
            <p className="text-xs text-neutral-500">Attach verifiable artifact for client inspection</p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Deliverable Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Render Staging Endpoint & Swagger UI"
              className="w-full px-3 py-2 border border-neutral-300 rounded outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Deliverable Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DeliverableType)}
              className="w-full px-3 py-2 border border-neutral-300 rounded outline-none bg-white focus:border-neutral-900"
            >
              <option value="STAGING_URL">Live Staging URL / Deployment</option>
              <option value="GITHUB_PR">GitHub Pull Request / Commit</option>
              <option value="FIGMA_DESIGN">Figma UI / Design Spec</option>
              <option value="DEMO_VIDEO">Loom / Video Walkthrough</option>
              <option value="DOCUMENTATION">Documentation / API Docs</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Artifact URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourapp-staging.onrender.com or https://github.com/..."
              className="w-full px-3 py-2 border border-neutral-300 rounded font-mono outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Testing Instructions / Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Test credentials: testuser@demo.com / pass123. Swagger is accessible on /swagger-ui"
              className="w-full px-3 py-2 border border-neutral-300 rounded outline-none focus:border-neutral-900"
            />
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
              <span>Submit Deliverable</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
