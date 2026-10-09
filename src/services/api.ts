import { Project, Milestone, Deliverable, MilestoneStatus, ActivityLog } from '../types';
import { INITIAL_PROJECTS, INITIAL_ACTIVITY_LOGS, INITIAL_CLIENTS } from '../data/sampleData';

const STORAGE_KEY_PROJECTS = 'prooflane_projects_v1';
const STORAGE_KEY_ACTIVITY = 'prooflane_activity_v1';
const STORAGE_KEY_BACKEND_URL = 'prooflane_backend_url_v1';
const STORAGE_KEY_API_MODE = 'prooflane_api_mode_v1';
const STORAGE_KEY_MONGO_URI = 'prooflane_mongo_uri_v1';

export type ApiMode = 'SANDBOX' | 'LIVE_SPRING_BOOT';

export interface BackendStatus {
  mode: ApiMode;
  url: string;
  isOnline: boolean;
  dbConnected: boolean;
  lastChecked?: string;
  errorMessage?: string;
}

export class ProofLaneService {
  private static getStoredProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  private static saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }

  public static getStoredActivities(): ActivityLog[] {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
      return INITIAL_ACTIVITY_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  }

  public static logActivity(projectId: string, action: string, actor: string, details: string): void {
    const current = this.getStoredActivities();
    const entry: ActivityLog = {
      id: `act_${Date.now()}`,
      projectId,
      action,
      actor,
      timestamp: new Date().toISOString(),
      details,
    };
    const updated = [entry, ...current].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(updated));
  }

  public static getBackendUrl(): string {
    return localStorage.getItem(STORAGE_KEY_BACKEND_URL) || 'http://localhost:8080';
  }

  public static setBackendUrl(url: string): void {
    localStorage.setItem(STORAGE_KEY_BACKEND_URL, url);
  }

  public static getApiMode(): ApiMode {
    return (localStorage.getItem(STORAGE_KEY_API_MODE) as ApiMode) || 'SANDBOX';
  }

  public static setApiMode(mode: ApiMode): void {
    localStorage.setItem(STORAGE_KEY_API_MODE, mode);
  }

  public static getMongoUri(): string {
    return localStorage.getItem(STORAGE_KEY_MONGO_URI) || '';
  }

  public static setMongoUri(uri: string): void {
    localStorage.setItem(STORAGE_KEY_MONGO_URI, uri);
  }

  public static async checkHealth(customUrl?: string): Promise<{ online: boolean; dbStatus: string; error?: string }> {
    const baseUrl = customUrl || this.getBackendUrl();
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3500),
      });

      if (!response.ok) {
        return { online: false, dbStatus: 'UNAVAILABLE', error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return {
        online: true,
        dbStatus: data.database || 'CONNECTED',
      };
    } catch (err) {
      return {
        online: false,
        dbStatus: 'DISCONNECTED',
        error: (err as Error).message || 'Connection refused (Ensure Spring Boot is running)',
      };
    }
  }

  // --- CRUD Operations ---
  public static async getProjects(): Promise<Project[]> {
    if (this.getApiMode() === 'LIVE_SPRING_BOOT') {
      try {
        const res = await fetch(`${this.getBackendUrl()}/api/projects`, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Falling back to local data due to network error:', err);
      }
    }
    return this.getStoredProjects();
  }

  public static async getProjectById(id: string): Promise<Project | undefined> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id);
  }

  public static async createProject(newProject: Partial<Project>, clientId?: string): Promise<Project> {
    const client = INITIAL_CLIENTS.find((c) => c.id === clientId) || INITIAL_CLIENTS[0];
    const project: Project = {
      id: `p_${Date.now()}`,
      clientId: client.id,
      title: newProject.title || 'Untitled Client Contract',
      description: newProject.description || '',
      totalBudget: Number(newProject.totalBudget) || 3000,
      currency: newProject.currency || 'USD',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      targetCompletionDate: newProject.targetCompletionDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      client,
      milestones: newProject.milestones || [],
    };

    const projects = this.getStoredProjects();
    const updated = [project, ...projects];
    this.saveProjects(updated);
    this.logActivity(project.id, 'PROJECT_CREATED', 'Alex (Developer)', `Created project "${project.title}" for ${client.name}`);

    return project;
  }

  public static async addMilestone(projectId: string, milestone: Partial<Milestone>): Promise<Milestone> {
    const projects = this.getStoredProjects();
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    const newMilestone: Milestone = {
      id: `m_${Date.now()}`,
      projectId,
      title: milestone.title || 'New Milestone',
      description: milestone.description || '',
      amount: Number(milestone.amount) || 1000,
      dueDate: milestone.dueDate || new Date().toISOString().split('T')[0],
      status: milestone.status || 'DRAFT',
      orderIndex: (projects[projectIndex].milestones?.length || 0) + 1,
      deliverables: milestone.deliverables || [],
    };

    projects[projectIndex].milestones.push(newMilestone);
    this.saveProjects(projects);
    this.logActivity(projectId, 'MILESTONE_ADDED', 'Alex (Developer)', `Added milestone "${newMilestone.title}" ($${newMilestone.amount})`);
    return newMilestone;
  }

  public static async addDeliverable(projectId: string, milestoneId: string, deliverable: Partial<Deliverable>): Promise<Deliverable> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    const newDeliverable: Deliverable = {
      id: `d_${Date.now()}`,
      milestoneId,
      title: deliverable.title || 'Deliverable Asset',
      type: deliverable.type || 'STAGING_URL',
      url: deliverable.url || 'https://staging.example.com',
      description: deliverable.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (!milestone.deliverables) {
      milestone.deliverables = [];
    }
    milestone.deliverables.push(newDeliverable);
    
    // Automatically submit for review if in draft
    if (milestone.status === 'DRAFT') {
      milestone.status = 'SUBMITTED';
    }

    this.saveProjects(projects);
    this.logActivity(projectId, 'DELIVERABLE_SUBMITTED', 'Alex (Developer)', `Submitted "${newDeliverable.title}" for review`);
    return newDeliverable;
  }

  public static async approveMilestone(projectId: string, milestoneId: string, notes?: string): Promise<void> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    milestone.status = 'APPROVED';
    milestone.approvedAt = new Date().toISOString();
    if (notes) {
      milestone.reviewNotes = notes;
    }

    this.saveProjects(projects);
    const clientName = project.client?.name || 'Client';
    this.logActivity(projectId, 'MILESTONE_APPROVED', `${clientName} (Client)`, `Approved milestone "${milestone.title}" ($${milestone.amount.toLocaleString()})`);
  }

  public static async requestRevision(projectId: string, milestoneId: string, changes: string): Promise<void> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    milestone.status = 'REVISION_REQUESTED';
    milestone.reviewNotes = changes;

    this.saveProjects(projects);
    const clientName = project.client?.name || 'Client';
    this.logActivity(projectId, 'REVISION_REQUESTED', `${clientName} (Client)`, `Requested changes on "${milestone.title}": "${changes}"`);
  }

  public static async updateMilestoneStatus(projectId: string, milestoneId: string, status: MilestoneStatus): Promise<void> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    milestone.status = status;
    if (status === 'APPROVED' && !milestone.approvedAt) {
      milestone.approvedAt = new Date().toISOString();
    }

    this.saveProjects(projects);
    this.logActivity(projectId, 'STATUS_UPDATED', 'Alex (Developer)', `Updated "${milestone.title}" to ${status}`);
  }

  public static resetDefaults(): void {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
}
