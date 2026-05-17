import React from "react";
import ReactDOM from "react-dom/client";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Code2,
  HeartHandshake,
  Landmark,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import "./styles.css";

type Metric = {
  label: string;
  value: string;
};

type RecordItem = {
  title: string;
  meta: string;
  status: string;
};

type Portal = {
  id: string;
  name: string;
  summary: string;
  department: string;
  accent: string;
  required_context: string[];
  primary_roles: string[];
  permissions: string[];
  metrics: Metric[];
  records: RecordItem[];
};

type Department = {
  id: string;
  name: string;
  teams: string[];
  headcount: number;
  lead: string;
};

type User = {
  id: string;
  name: string;
  role: string;
  department: string;
  type: string;
  status: string;
  location: string;
};

type Company = {
  name: string;
  tagline: string;
  stage: string;
  identity_note: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const portalIcons = {
  hr: HeartHandshake,
  finance: Landmark,
  git: Code2,
  admin: ShieldCheck,
  analytics: BarChart3,
};

function App() {
  const [company, setCompany] = React.useState<Company | null>(null);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [portals, setPortals] = React.useState<Portal[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [activePortalId, setActivePortalId] = React.useState("hr");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/company`).then((response) => response.json()),
      fetch(`${API_BASE}/api/departments`).then((response) => response.json()),
      fetch(`${API_BASE}/api/portals`).then((response) => response.json()),
      fetch(`${API_BASE}/api/users`).then((response) => response.json()),
    ])
      .then(([companyData, departmentData, portalData, userData]) => {
        setCompany(companyData);
        setDepartments(departmentData);
        setPortals(portalData);
        setUsers(userData);
      })
      .catch(() => setError("The FastAPI server is not reachable yet."));
  }, []);

  const activePortal = portals.find((portal) => portal.id === activePortalId) ?? portals[0];
  const department = departments.find((item) => item.name === activePortal?.department);
  const departmentUsers = users.filter((user) => user.department === activePortal?.department);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Wolke Systems portals">
        <div className="brand">
          <Building2 aria-hidden="true" />
          <div>
            <strong>{company?.name ?? "Wolke Systems"}</strong>
            <span>{company?.stage ?? "Internal portals"}</span>
          </div>
        </div>

        <nav className="portal-nav">
          {portals.map((portal) => {
            const Icon = portalIcons[portal.id as keyof typeof portalIcons] ?? LayoutDashboard;
            return (
              <button
                key={portal.id}
                className={portal.id === activePortalId ? "active" : ""}
                onClick={() => setActivePortalId(portal.id)}
                style={{ "--accent": portal.accent } as React.CSSProperties}
                type="button"
                title={portal.name}
              >
                <Icon aria-hidden="true" />
                <span>{portal.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="identity-note">
          <ShieldCheck aria-hidden="true" />
          <span>{company?.identity_note ?? "Auth intentionally omitted."}</span>
        </div>
      </aside>

      <section className="workspace">
        {error ? (
          <div className="empty-state">
            <h1>API unavailable</h1>
            <p>{error}</p>
          </div>
        ) : activePortal ? (
          <PortalView portal={activePortal} department={department} users={departmentUsers} allDepartments={departments} />
        ) : (
          <div className="empty-state">
            <h1>Loading portals</h1>
            <p>Waiting for Wolke Systems application data.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function PortalView({
  portal,
  department,
  users,
  allDepartments,
}: {
  portal: Portal;
  department?: Department;
  users: User[];
  allDepartments: Department[];
}) {
  const Icon = portalIcons[portal.id as keyof typeof portalIcons] ?? LayoutDashboard;

  return (
    <>
      <header className="portal-header" style={{ "--accent": portal.accent } as React.CSSProperties}>
        <div className="portal-title">
          <div className="portal-mark">
            <Icon aria-hidden="true" />
          </div>
          <div>
            <p>{portal.department}</p>
            <h1>{portal.name}</h1>
          </div>
        </div>
        <p className="portal-summary">{portal.summary}</p>
      </header>

      <section className="metric-grid" aria-label={`${portal.name} metrics`}>
        {portal.metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel primary-panel">
          <div className="panel-heading">
            <BriefcaseBusiness aria-hidden="true" />
            <h2>Operational Work</h2>
          </div>
          <div className="record-list">
            {portal.records.map((record) => (
              <div className="record" key={record.title}>
                <div>
                  <strong>{record.title}</strong>
                  <span>{record.meta}</span>
                </div>
                <p>{record.status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <ShieldCheck aria-hidden="true" />
            <h2>Access Shape</h2>
          </div>
          <TagGroup title="Primary roles" values={portal.primary_roles} />
          <TagGroup title="Permission examples" values={portal.permissions} />
          <TagGroup title="Context your auth layer can supply later" values={portal.required_context} />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <Users aria-hidden="true" />
            <h2>Organization Context</h2>
          </div>
          {department ? (
            <div className="department-profile">
              <strong>{department.name}</strong>
              <span>{department.headcount} people led by {department.lead}</span>
              <div className="team-row">
                {department.teams.map((team) => (
                  <span key={team}>{team}</span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="people-list">
            {users.map((user) => (
              <div key={user.id} className="person-row">
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>
                <small>{user.status}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <LayoutDashboard aria-hidden="true" />
            <h2>Enterprise Map</h2>
          </div>
          <div className="department-map">
            {allDepartments.map((item) => (
              <div key={item.id} className={item.name === portal.department ? "selected" : ""}>
                <strong>{item.name}</strong>
                <span>{item.headcount} people</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function TagGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="tag-group">
      <h3>{title}</h3>
      <div>
        {values.map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
