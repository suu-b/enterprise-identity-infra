import React from "react";
import ReactDOM from "react-dom/client";
import {
  BadgeCheck,
  BarChart3,
  BellRing,
  Building2,
  CheckCircle2,
  ChevronDown,
  Code2,
  FileCode2,
  GitMerge,
  GitPullRequest,
  HeartHandshake,
  Landmark,
  Mail,
  ReceiptText,
  ShieldCheck,
  SquarePen,
  Users,
  WalletCards,
} from "lucide-react";
import "./styles.css";

type Portal = {
  id: string;
  name: string;
  summary: string;
  department: string;
  accent: string;
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
  stage: string;
  identity_note: string;
};

type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  office: string;
  manager: string;
  salary: string;
};

type MoneyRow = {
  department: string;
  owner: string;
  allocated: string;
  used: string;
  percent: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const portalIcons = {
  hr: HeartHandshake,
  finance: Landmark,
  git: Code2,
  admin: ShieldCheck,
  analytics: BarChart3,
};

const employees: Employee[] = [
  {
    id: "E001",
    name: "Arjun Mehta",
    department: "Executive Office",
    role: "CEO",
    office: "New York HQ",
    manager: "",
    salary: "$28,400",
  },
  {
    id: "E003",
    name: "Daniel Cho",
    department: "Finance",
    role: "Finance Head",
    office: "Chicago",
    manager: "Arjun Mehta",
    salary: "$16,900",
  },
  {
    id: "E005",
    name: "Sofia Martinez",
    department: "Human Resources",
    role: "HR Head",
    office: "San Francisco",
    manager: "Arjun Mehta",
    salary: "$15,800",
  },
  {
    id: "E007",
    name: "Liam OConnor",
    department: "Engineering",
    role: "VP Engineering",
    office: "Seattle",
    manager: "Arjun Mehta",
    salary: "$19,600",
  },
  {
    id: "E011",
    name: "Oliver Hughes",
    department: "Sales",
    role: "Sales Director",
    office: "London",
    manager: "Arjun Mehta",
    salary: "$17,300",
  },
  {
    id: "E019",
    name: "Emma Johnson",
    department: "Information Security",
    role: "Security Lead",
    office: "Washington DC",
    manager: "Arjun Mehta",
    salary: "$17,900",
  },
  {
    id: "E023",
    name: "Harper Wilson",
    department: "Data and Analytics",
    role: "Analytics Lead",
    office: "Boston",
    manager: "Arjun Mehta",
    salary: "$16,700",
  },
  {
    id: "E041",
    name: "Charlotte Young",
    department: "Engineering",
    role: "Application Engineer",
    office: "Seattle",
    manager: "Liam OConnor",
    salary: "$11,200",
  },
  {
    id: "E042",
    name: "Dev Malhotra",
    department: "Engineering",
    role: "Backend Engineer",
    office: "Bengaluru",
    manager: "Liam OConnor",
    salary: "$8,900",
  },
  {
    id: "E051",
    name: "Aria Shah",
    department: "Customer Success",
    role: "Technical Account Manager",
    office: "Mumbai",
    manager: "Mei Lin",
    salary: "$7,600",
  },
];

const funds: MoneyRow[] = [
  {
    department: "Engineering",
    owner: "Liam OConnor",
    allocated: "$3.8M",
    used: "$2.9M",
    percent: 76,
  },
  {
    department: "Finance",
    owner: "Daniel Cho",
    allocated: "$1.4M",
    used: "$940K",
    percent: 67,
  },
  {
    department: "Human Resources",
    owner: "Sofia Martinez",
    allocated: "$1.1M",
    used: "$760K",
    percent: 69,
  },
  {
    department: "Sales",
    owner: "Oliver Hughes",
    allocated: "$2.6M",
    used: "$2.1M",
    percent: 81,
  },
  {
    department: "Security",
    owner: "Emma Johnson",
    allocated: "$1.8M",
    used: "$1.0M",
    percent: 58,
  },
  {
    department: "Data and Analytics",
    owner: "Harper Wilson",
    allocated: "$1.6M",
    used: "$1.2M",
    percent: 73,
  },
];

const expenses: MoneyRow[] = [
  {
    department: "Engineering",
    owner: "Cloud, tooling, hardware",
    allocated: "$328K",
    used: "$287K",
    percent: 88,
  },
  {
    department: "Finance",
    owner: "Audit, tax, travel",
    allocated: "$84K",
    used: "$49K",
    percent: 58,
  },
  {
    department: "Human Resources",
    owner: "Hiring, benefits, events",
    allocated: "$122K",
    used: "$81K",
    percent: 66,
  },
  {
    department: "Sales",
    owner: "Travel, events, partners",
    allocated: "$410K",
    used: "$354K",
    percent: 86,
  },
  {
    department: "Security",
    owner: "Licenses, response, training",
    allocated: "$190K",
    used: "$112K",
    percent: 59,
  },
  {
    department: "Operations",
    owner: "Facilities and vendors",
    allocated: "$264K",
    used: "$201K",
    percent: 76,
  },
];

const analyticsRows = [
  {
    label: "Engineering",
    prs: 46,
    teams: 12,
    fund: 76,
    expenses: 88,
    tokens: "9.8M",
    attendance: 94,
  },
  {
    label: "Finance",
    prs: 8,
    teams: 4,
    fund: 67,
    expenses: 58,
    tokens: "1.6M",
    attendance: 97,
  },
  {
    label: "Human Resources",
    prs: 6,
    teams: 5,
    fund: 69,
    expenses: 66,
    tokens: "2.1M",
    attendance: 96,
  },
  {
    label: "Sales",
    prs: 11,
    teams: 7,
    fund: 81,
    expenses: 86,
    tokens: "3.4M",
    attendance: 92,
  },
  {
    label: "Security",
    prs: 19,
    teams: 6,
    fund: 58,
    expenses: 59,
    tokens: "5.2M",
    attendance: 95,
  },
  {
    label: "Data and Analytics",
    prs: 31,
    teams: 8,
    fund: 73,
    expenses: 72,
    tokens: "7.5M",
    attendance: 93,
  },
];

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

  const activePortal =
    portals.find((portal) => portal.id === activePortalId) ?? portals[0];

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
            const Icon =
              portalIcons[portal.id as keyof typeof portalIcons] ?? Building2;
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
                <span>{portal.id === "git" ? "DevWolke" : portal.name}</span>
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
          <PortalView
            portal={activePortal}
            departments={departments}
            users={users}
          />
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
  departments,
  users,
}: {
  portal: Portal;
  departments: Department[];
  users: User[];
}) {
  const Icon = portalIcons[portal.id as keyof typeof portalIcons] ?? Building2;
  const portalName = portal.id === "git" ? "DevWolke" : portal.name;

  return (
    <>
      <header
        className="portal-header"
        style={{ "--accent": portal.accent } as React.CSSProperties}
      >
        <div className="portal-title">
          <div className="portal-mark">
            <Icon aria-hidden="true" />
          </div>
          <div>
            <p>{portal.department}</p>
            <h1>{portalName}</h1>
          </div>
        </div>
        <p className="portal-summary">{portal.summary}</p>
      </header>

      <PortalWidgets
        portalId={portal.id}
        departments={departments}
        users={users}
      />
    </>
  );
}

function PortalWidgets({
  portalId,
  departments,
  users,
}: {
  portalId: string;
  departments: Department[];
  users: User[];
}) {
  if (portalId === "hr") {
    return <HrWidgets departments={departments} />;
  }
  if (portalId === "finance") {
    return <FinanceWidgets departments={departments} />;
  }
  if (portalId === "git") {
    return <DevWolkeWidgets />;
  }
  if (portalId === "admin") {
    return <AdminWidgets />;
  }
  return <AnalyticsWidgets users={users} />;
}

function Widget({
  title,
  icon,
  children,
  wide = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <article className={wide ? "widget widget-wide" : "widget"}>
      <div className="widget-heading">
        {icon}
        <h2>{title}</h2>
      </div>
      {children}
    </article>
  );
}

function HrWidgets({ departments }: { departments: Department[] }) {
  const directReports = employees
    .filter((employee) => employee.manager === "Arjun Mehta")
    .slice(0, 8);

  return (
    <section className="widget-grid">
      <Widget
        title="User Info Update"
        icon={<SquarePen aria-hidden="true" />}
        wide
      >
        <div className="form-grid">
          <label>
            Legal name
            <input value="Maya Rao" readOnly />
          </label>
          <label>
            Office
            <input value="New York HQ" readOnly />
          </label>
          <label>
            Emergency contact
            <input value="+1-917-555-2102" readOnly />
          </label>
          <label>
            Work mode
            <select defaultValue="Required">
              <option>Required</option>
              <option>Flexible</option>
              <option>Remote</option>
            </select>
          </label>
        </div>
        <button className="primary-action" type="button">
          Save profile draft
        </button>
      </Widget>

      <Widget
        title="Send HR Session"
        icon={<BellRing aria-hidden="true" />}
        wide
      >
        <div className="session-list">
          {departments.map((department) => (
            <div className="session-row" key={department.id}>
              <div>
                <strong>{department.name}</strong>
                <span>{department.headcount} employees</span>
              </div>
              <button type="button">Send session</button>
            </div>
          ))}
        </div>
      </Widget>

      <Widget title="Directs Under Me" icon={<Users aria-hidden="true" />} wide>
        <div className="people-list">
          {directReports.map((employee) => (
            <div className="person-row" key={employee.id}>
              <div>
                <strong>{employee.name}</strong>
                <span>
                  {employee.role} · {employee.department}
                </span>
              </div>
              <small>{employee.office}</small>
            </div>
          ))}
        </div>
      </Widget>
    </section>
  );
}

function FinanceWidgets({ departments }: { departments: Department[] }) {
  const [selectedDepartment, setSelectedDepartment] =
    React.useState("All departments");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const payrollEmployees = employees.filter((employee) => {
    return (
      selectedDepartment === "All departments" ||
      employee.department === selectedDepartment
    );
  });
  const allSelected = payrollEmployees.every((employee) =>
    selectedIds.includes(employee.id),
  );

  function toggleAll() {
    setSelectedIds(
      allSelected ? [] : payrollEmployees.map((employee) => employee.id),
    );
  }

  function toggleEmployee(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section className="widget-grid">
      <Widget title="My Payslip" icon={<ReceiptText aria-hidden="true" />}>
        <div className="payslip-card">
          <span>May 2026 net pay</span>
          <strong>$16,900</strong>
          <p>Daniel Cho · Finance Head · Chicago</p>
        </div>
        <button className="primary-action" type="button">
          Check payslip
        </button>
      </Widget>

      <Widget title="Send Payroll Mail" icon={<Mail aria-hidden="true" />} wide>
        <div className="toolbar">
          <label className="select-shell">
            <span>Department</span>
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
            >
              <option>All departments</option>
              {departments.map((department) => (
                <option key={department.id}>{department.name}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <button
            className="secondary-action"
            onClick={toggleAll}
            type="button"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="payroll-grid">
          {payrollEmployees.map((employee) => (
            <div className="payroll-row" key={employee.id}>
              <label>
                <input
                  checked={selectedIds.includes(employee.id)}
                  onChange={() => toggleEmployee(employee.id)}
                  type="checkbox"
                />
                <span>{employee.name}</span>
              </label>
              <small>{employee.department}</small>
              <button type="button">Send</button>
            </div>
          ))}
        </div>
      </Widget>

      <Widget
        title="Fund Allocation"
        icon={<WalletCards aria-hidden="true" />}
        wide
      >
        <MoneyTable rows={funds} />
      </Widget>

      <Widget title="Expenses" icon={<Landmark aria-hidden="true" />} wide>
        <MoneyTable rows={expenses} />
      </Widget>
    </section>
  );
}

function DevWolkeWidgets() {
  return (
    <section className="widget-grid">
      <Widget title="Merge PR" icon={<GitMerge aria-hidden="true" />}>
        <div className="code-card">
          <strong>identity-gateway #482</strong>
          <span>2 approvals · checks passed · low-risk migration</span>
        </div>
        <button className="primary-action" type="button">
          Merge pull request
        </button>
      </Widget>

      <Widget title="Raise PR" icon={<GitPullRequest aria-hidden="true" />}>
        <div className="form-grid single-column">
          <label>
            Branch
            <input value="feature/manager-directory" readOnly />
          </label>
          <label>
            Reviewer
            <select defaultValue="Liam OConnor">
              <option>Liam OConnor</option>
              <option>Emma Johnson</option>
              <option>Charlotte Young</option>
            </select>
          </label>
        </div>
        <button className="primary-action" type="button">
          Raise PR
        </button>
      </Widget>

      <Widget title="See Code" icon={<FileCode2 aria-hidden="true" />}>
        <div className="repo-tree">
          <span>apps/identity/main.py</span>
          <span>infra/keycloak/realm.json</span>
          <span>packages/access/policy.ts</span>
        </div>
        <button className="secondary-action" type="button">
          Open repository
        </button>
      </Widget>

      <Widget title="Approve PR" icon={<CheckCircle2 aria-hidden="true" />}>
        <div className="code-card">
          <strong>payroll-service #119</strong>
          <span>Security review requested · owner: Dev Malhotra</span>
        </div>
        <button className="primary-action" type="button">
          Approve PR
        </button>
      </Widget>
    </section>
  );
}

function AdminWidgets() {
  const badgeRequests = [
    { name: "Nina Patel", gate: "Bengaluru East", reason: "Replacement badge" },
    {
      name: "Pedro Silva",
      gate: "Sao Paulo North",
      reason: "Visitor escort access",
    },
    {
      name: "Uma Desai",
      gate: "Mumbai Tower",
      reason: "Procurement floor access",
    },
  ];
  const gateActivity = [
    { gate: "New York HQ - North", count: 384, status: "Normal" },
    { gate: "Bengaluru East", count: 612, status: "Busy" },
    { gate: "London West", count: 226, status: "Normal" },
    { gate: "Mumbai Tower", count: 301, status: "Elevated" },
  ];

  return (
    <section className="widget-grid">
      <Widget title="My Badge" icon={<BadgeCheck aria-hidden="true" />}>
        <div className="badge-card">
          <span>WOLKE SYSTEMS</span>
          <strong>ARJUN MEHTA</strong>
          <p>Executive Office · Level 5 access</p>
        </div>
        <button className="primary-action" type="button">
          View badge
        </button>
      </Widget>

      <Widget
        title="Approve Badge Request"
        icon={<ShieldCheck aria-hidden="true" />}
        wide
      >
        <div className="approval-list">
          {badgeRequests.map((request) => (
            <div className="approval-row" key={request.name}>
              <div>
                <strong>{request.name}</strong>
                <span>
                  {request.gate} · {request.reason}
                </span>
              </div>
              <button type="button">Approve</button>
            </div>
          ))}
        </div>
      </Widget>

      <Widget
        title="Gate-wise Activity"
        icon={<Building2 aria-hidden="true" />}
        wide
      >
        <div className="activity-grid">
          {gateActivity.map((gate) => (
            <div className="activity-card" key={gate.gate}>
              <span>{gate.gate}</span>
              <strong>{gate.count}</strong>
              <small>{gate.status}</small>
            </div>
          ))}
        </div>
      </Widget>
    </section>
  );
}

function AnalyticsWidgets({ users }: { users: User[] }) {
  const teamRows = [
    { label: "Core Platform", value: 18, meta: "Engineering" },
    { label: "Threat Detection", value: 11, meta: "Security" },
    { label: "Business Intelligence", value: 15, meta: "Analytics" },
    { label: "Product Operations", value: 7, meta: "Product" },
  ];

  return (
    <section className="widget-grid">
      <Widget
        title="Dept-wise PRs"
        icon={<GitPullRequest aria-hidden="true" />}
      >
        <BarRows
          rows={analyticsRows.map((row) => ({
            label: row.label,
            value: row.prs,
            meta: "open + merged",
          }))}
          max={50}
        />
      </Widget>

      <Widget title="Team-wise PRs" icon={<Code2 aria-hidden="true" />}>
        <BarRows rows={teamRows} max={20} />
      </Widget>

      <Widget title="Dept-wise Fund" icon={<WalletCards aria-hidden="true" />}>
        <BarRows
          rows={analyticsRows.map((row) => ({
            label: row.label,
            value: row.fund,
            meta: "used",
          }))}
          max={100}
          suffix="%"
        />
      </Widget>

      <Widget
        title="Dept-wise Expenses"
        icon={<ReceiptText aria-hidden="true" />}
      >
        <BarRows
          rows={analyticsRows.map((row) => ({
            label: row.label,
            value: row.expenses,
            meta: "burn",
          }))}
          max={100}
          suffix="%"
        />
      </Widget>

      <Widget
        title="Dept-wise Token Usage"
        icon={<BarChart3 aria-hidden="true" />}
      >
        <div className="token-grid">
          {analyticsRows.map((row) => (
            <div key={row.label}>
              <span>{row.label}</span>
              <strong>{row.tokens}</strong>
            </div>
          ))}
        </div>
      </Widget>

      <Widget title="Dept-wise Attendance" icon={<Users aria-hidden="true" />}>
        <BarRows
          rows={analyticsRows.map((row) => ({
            label: row.label,
            value: row.attendance,
            meta: `${users.length || 6} sampled users`,
          }))}
          max={100}
          suffix="%"
        />
      </Widget>
    </section>
  );
}

function MoneyTable({ rows }: { rows: MoneyRow[] }) {
  return (
    <div className="money-table">
      {rows.map((row) => (
        <div className="money-row" key={row.department}>
          <div>
            <strong>{row.department}</strong>
            <span>{row.owner}</span>
          </div>
          <div className="meter" aria-hidden="true">
            <span style={{ width: `${row.percent}%` }} />
          </div>
          <small>
            {row.used} / {row.allocated}
          </small>
        </div>
      ))}
    </div>
  );
}

function BarRows({
  rows,
  max,
  suffix = "",
}: {
  rows: { label: string; value: number; meta: string }[];
  max: number;
  suffix?: string;
}) {
  return (
    <div className="bar-list">
      {rows.map((row) => (
        <div className="bar-row" key={row.label}>
          <div>
            <strong>{row.label}</strong>
            <span>{row.meta}</span>
          </div>
          <div className="meter" aria-hidden="true">
            <span
              style={{ width: `${Math.min(100, (row.value / max) * 100)}%` }}
            />
          </div>
          <small>
            {row.value}
            {suffix}
          </small>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
