import React from "react";
import ReactDOM from "react-dom/client";
import {
  BadgeCheck,
  Banknote,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  IdCard,
  LockKeyhole,
  Search,
  Shield,
  Users,
} from "lucide-react";
import "./styles.css";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ "aria-hidden": true }>;
};

type Service = {
  name: string;
  tagline: string;
  boundary: string;
  session_source: string;
};

type Worker = {
  name: string;
  initials: string;
  role: string;
  company: string;
  worker_id: string;
  department: string;
  lifecycle_state: string;
};

type Task = {
  title: string;
  detail: string;
  due: string;
  priority: "Required" | "Optional" | "Approval";
};

type PayItem = {
  label: string;
  value: string;
  note: string;
};

type Integration = {
  label: string;
  value: string;
};

type Overview = {
  service: Service;
  navigation: string[];
  worker: Worker;
  tasks: Task[];
  pay_items: PayItem[];
  integrations: Integration[];
};

const API_BASE = import.meta.env.VITE_WORKYEAR_API_BASE_URL ?? "http://localhost:8100";

const navIcons: Record<string, NavItem["icon"]> = {
  Home,
  Profile: IdCard,
  "Time Off": CalendarDays,
  Pay: Banknote,
  Benefits: HeartPulse,
  Documents: FileText,
  Directory: Users,
};

function App() {
  const [overview, setOverview] = React.useState<Overview | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(`${API_BASE}/api/overview`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("WorkYear API returned an error.");
        }
        return response.json();
      })
      .then((data: Overview) => setOverview(data))
      .catch(() => setError("The WorkYear backend is not reachable yet."));
  }, []);

  if (error) {
    return (
      <main className="empty-state">
        <h1>WorkYear API unavailable</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!overview) {
    return (
      <main className="empty-state">
        <h1>Loading WorkYear</h1>
        <p>Waiting for external workforce service data.</p>
      </main>
    );
  }

  const navigation = overview.navigation.map((label) => ({
    label,
    icon: navIcons[label] ?? Home,
  }));

  return (
    <main className="workyear-shell">
      <aside className="sidebar" aria-label="WorkYear navigation">
        <div className="brand">
          <div className="brand-mark">WY</div>
          <div>
            <strong>{overview.service.name}</strong>
            <span>{overview.service.tagline}</span>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <button className={index === 0 ? "active" : ""} key={item.label} type="button" title={item.label}>
                <Icon aria-hidden={true} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="trust-card" aria-label="Integration status">
          <Shield aria-hidden={true} />
          <div>
            <strong>External IdP Boundary</strong>
            <span>{overview.service.boundary}</span>
          </div>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <label className="search">
            <Search aria-hidden={true} />
            <input aria-label="Search WorkYear" placeholder="Search workers, documents, or tasks" />
          </label>
          <button className="icon-button" type="button" title="Notifications">
            <Bell aria-hidden={true} />
          </button>
        </header>

        <section className="hero-band">
          <div>
            <p>Good afternoon, {overview.worker.name.split(" ")[0]}</p>
            <h1>Workforce data, pay, benefits, and approvals in one external system.</h1>
          </div>
          <div className="session-panel">
            <LockKeyhole aria-hidden={true} />
            <span>Session source</span>
            <strong>{overview.service.session_source}</strong>
            <small>Ready for future SAML or OIDC federation from Wolke Systems.</small>
          </div>
        </section>

        <section className="metric-grid" aria-label="WorkYear payroll metrics">
          {overview.pay_items.map((item) => (
            <article className="metric-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel task-panel">
            <div className="panel-heading">
              <ClipboardList aria-hidden={true} />
              <h2>Inbox Tasks</h2>
            </div>
            <div className="task-list">
              {overview.tasks.map((task) => (
                <div className="task-row" key={task.title}>
                  <div className="task-status">
                    <CheckCircle2 aria-hidden={true} />
                  </div>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.detail}</span>
                  </div>
                  <div className="task-meta">
                    <small>{task.priority}</small>
                    <span>{task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel profile-panel">
            <div className="panel-heading">
              <BadgeCheck aria-hidden={true} />
              <h2>Worker Profile</h2>
            </div>
            <div className="profile-card">
              <div className="avatar">{overview.worker.initials}</div>
              <div>
                <strong>{overview.worker.name}</strong>
                <span>{overview.worker.role}</span>
              </div>
            </div>
            <dl className="profile-list">
              <div>
                <dt>Company</dt>
                <dd>{overview.worker.company}</dd>
              </div>
              <div>
                <dt>Worker ID</dt>
                <dd>{overview.worker.worker_id}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{overview.worker.department}</dd>
              </div>
              <div>
                <dt>Lifecycle State</dt>
                <dd>{overview.worker.lifecycle_state}</dd>
              </div>
            </dl>
          </article>

          <article className="panel integration-panel">
            <div className="panel-heading">
              <BriefcaseBusiness aria-hidden={true} />
              <h2>Enterprise Integration</h2>
            </div>
            <div className="integration-grid">
              {overview.integrations.map((item) => (
                <IntegrationItem key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function IntegrationItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="integration-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
