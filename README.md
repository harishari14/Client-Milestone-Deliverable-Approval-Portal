# ProofLane — Client Milestone & Deliverable Approval Portal

> A full-stack contract milestone and deliverable verification platform built for independent software engineers, freelancers, and technical agencies to eliminate payment delays and scope creep.

---

## 📌 Overview

**ProofLane** bridges the gap between completed software work and client payment authorizations. Rather than negotiating deliverables across disorganized chat threads or email chains, developers attach **verifiable deliverable proofs** (live staging URLs, GitHub Pull Requests, Figma specs, demo walkthroughs) directly to contract payment milestones.

Clients use a secure review portal to test artifacts and either authorize milestone payouts or submit specific, actionable revision requests. Every action is recorded in an immutable audit ledger to keep both parties aligned.

---

## 🚀 Key Features

- **Contract & Milestone Management**: Structure client agreements into phases with target due dates, milestone amounts, and completion tracking.
- **Verifiable Proof Artifacts**: Attach evidence to each milestone:
  - Live staging URLs & test credentials
  - GitHub Pull Requests & commit tags
  - Figma UI design specifications
  - Loom or screen walkthrough videos
- **Client Sign-Off Portal**: Dedicated review interface where clients can inspect submitted deliverables and choose:
  - **Authorize Milestone Payout**: Formally accepts the work and releases the payment.
  - **Request Changes**: Submits structured revision notes back to the engineer.
- **Audit Activity Trail**: Real-time log of every deliverable submission, client revision request, and milestone authorization.
- **Financial & Pipeline Analytics**: Instant visibility into total contract value, released revenue, and deliverables currently in review.

---

## 🏗️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS | Modular component architecture, zero-pill typography, and real-time review workflows |
| **Backend** | Java 17 / Spring Boot 3.3.4 | REST API with Spring Web, Spring Data, Jakarta Validation, and Actuator |
| **Build & Tooling** | Vite 8, Maven 3.9 | Fast frontend dev server and standard Maven backend packaging |

---

## 📁 Repository Structure

```text
prooflane/
├── backend/                              # Java Spring Boot Backend
│   ├── pom.xml                           # Maven project configuration
│   ├── Dockerfile                        # Multi-stage Docker build
│   ├── README.md                         # Backend-specific documentation
│   └── src/
│       └── main/
│           ├── java/com/prooflane/
│           │   ├── ProofLaneApplication.java # Spring Boot main entry
│           │   ├── config/
│           │   │   └── CorsConfig.java       # Cross-Origin resource sharing setup
│           │   ├── controller/
│           │   │   ├── ProjectController.java    # /api/projects CRUD endpoints
│           │   │   ├── MilestoneController.java  # /api/projects/{id}/milestones endpoints
│           │   │   └── HealthController.java     # /api/health probe
│           │   ├── model/
│           │   │   ├── Client.java           # Client document entity
│           │   │   ├── Project.java          # Contract entity
│           │   │   ├── Milestone.java        # Billable milestone model
│           │   │   ├── Deliverable.java      # Attached proof artifact model
│           │   │   ├── ActivityLog.java      # Audit trail model
│           │   │   ├── MilestoneStatus.java  # DRAFT, SUBMITTED, REVISION_REQUESTED, APPROVED, PAID
│           │   │   └── DeliverableType.java  # STAGING_URL, GITHUB_PR, FIGMA_DESIGN, etc.
│           │   ├── repository/
│           │   │   ├── ProjectRepository.java
│           │   │   ├── ClientRepository.java
│           │   │   └── ActivityLogRepository.java
│           │   └── service/
│           │       ├── ProjectService.java
│           │       └── MilestoneService.java
│           └── resources/
│               └── application.properties    # Backend configuration
│
├── src/                                  # TypeScript Frontend (React)
│   ├── components/
│   │   ├── Header.tsx                    # Top navigation
│   │   ├── DashboardView.tsx             # Revenue overview & project status
│   │   ├── ProjectDetailView.tsx         # Milestone & deliverable manager
│   │   ├── ActivityView.tsx              # Event audit trail with search & filters
│   │   ├── ClientPortalModal.tsx         # Client sign-off & revision portal
│   │   ├── NewProjectModal.tsx           # Contract creation modal
│   │   ├── NewMilestoneModal.tsx         # Milestone creation modal
│   │   └── AddDeliverableModal.tsx       # Deliverable attachment modal
│   ├── data/
│   │   └── sampleData.ts                 # Initial demo projects & activity history
│   ├── services/
│   │   └── api.ts                        # Frontend service & state persistence
│   ├── types/
│   │   └── index.ts                      # Shared TypeScript models
│   ├── App.tsx                           # Application root
│   ├── main.tsx                          # Vite React entry point
│   └── index.css                         # Tailwind CSS imports
│
├── index.html                            # HTML entry point
├── package.json                          # Frontend dependencies
├── tsconfig.json                         # TypeScript configuration
└── vite.config.ts                        # Vite configuration
```

---

## 📡 REST API Endpoints (Java Spring Boot)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | List all client contracts with nested milestones |
| `POST` | `/api/projects?clientId={id}` | Create a new client contract |
| `GET` | `/api/projects/{id}` | Retrieve details for a specific project |
| `POST` | `/api/projects/{id}/milestones/{milestoneId}/approve` | Client approves milestone and authorizes payout |
| `POST` | `/api/projects/{id}/milestones/{milestoneId}/request-revision` | Client requests deliverable changes |
| `GET` | `/api/health` | Health probe confirming service and database connectivity |

---

## 💻 Local Setup & Getting Started

### 1. Prerequisites
- **Node.js**: Version 18+
- **Java Development Kit (JDK)**: Version 17+
- **Apache Maven**: Version 3.8+

---

### 2. Running the Java Spring Boot Backend

Navigate to the `backend/` folder and start the service:

```bash
cd backend

# Compile dependencies and install
mvn clean install

# Launch Spring Boot server on port 8080
mvn spring-boot:run
```

Verify backend health in your terminal:
```bash
curl http://localhost:8080/api/health
```

---

### 3. Running the TypeScript Frontend

In a separate terminal window, start the frontend development server from the project root:

```bash
# Install frontend dependencies
npm install

# Start Vite development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔄 Workflow Walkthrough

1. **Create a Contract**: Click **+ New Contract** on the dashboard. Use one of the pre-built industry templates (*Fintech Ledger API*, *SaaS Billing Dispatcher*, or *Patient Booking Engine*) or define custom scope and budget.
2. **Submit Deliverables**: In the contract details view, click **Add Deliverable Link** to attach test links, preview environments, or PRs to a milestone.
3. **Simulate Client Sign-off**: Click **Client View** to experience what your client sees. Review the deliverables and either authorize the payment or submit revision comments.
4. **Inspect the Audit Log**: Switch to the **Audit Activity** tab to view the timestamped, immutable history of every review decision.

---

## 📄 License

This project is licensed under the Apache-2.0 License.
