export type MilestoneStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'PAID';

export type DeliverableType = 
  | 'STAGING_URL'
  | 'GITHUB_PR'
  | 'FIGMA_DESIGN'
  | 'DOCUMENTATION'
  | 'DEMO_VIDEO';

export interface Deliverable {
  id: string;
  milestoneId: string;
  title: string;
  type: DeliverableType;
  url: string;
  description?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  reviewNotes?: string;
  approvedAt?: string;
  deliverables: Deliverable[];
  orderIndex: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  portalToken: string;
  avatarInitials: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  totalBudget: number;
  currency: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: string;
  targetCompletionDate: string;
  client?: Client;
  milestones: Milestone[];
}

export interface ActivityLog {
  id: string;
  projectId: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}
