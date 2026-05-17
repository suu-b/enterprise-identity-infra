# RBAC Implementation Plan

## Overview

Implement a modular Role-Based Access Control (RBAC) system leveraging the existing CSV-based data structure with no collection fields (normalized design). Roles are assigned to employees through `employee_role` join table, permissions are assigned to roles through `role_permission` join table.

### Key Design Principle: Least Privilege for Managers

- **`manager` role** is minimal and structural: only team management and approval of time-off/benefits for directs
- **`{dept}_manager` roles** contain domain-specific permissions (e.g., `finance_manager` gets finance permissions, `engineering_manager` gets DevWolke access)
- This **prevents permission bleeding** across domains (e.g., Tech Manager cannot see Finance reports)
- Department heads get BOTH `manager` + `{dept}_manager` + `{dept}_admin` roles for full domain authority within their scope

---

## 1. Role Hierarchy & Categories

### 1.1 Organizational Roles (Company-Level)

These are top-level, cross-organizational roles:

| Role ID         | Role Name     | Description                                                                         | Auto-Assignment                               |
| --------------- | ------------- | ----------------------------------------------------------------------------------- | --------------------------------------------- |
| `company_admin` | Company Admin | Full system access, user management                                                 | Executive Office head/cohead                  |
| `executive`     | Executive     | Strategic access across all portals, analytics                                      | Executive Office members                      |
| `manager`       | Manager       | Base manager role: team management, direct reports, approvals (minimal permissions) | All department heads/coheads, people managers |
| `employee`      | Employee      | Basic portal access                                                                 | All employees                                 |
| `contractor`    | Contractor    | Limited portal access                                                               | Contractors (based on persona)                |

### 1.1a Domain-Specific Manager Roles

One manager role variant per department for domain-scoped management:

| Role ID               | Role Name                | Description                              |
| --------------------- | ------------------------ | ---------------------------------------- |
| `exec_manager`        | Executive Manager        | Executive Office management              |
| `finance_manager`     | Finance Manager          | Finance department management            |
| `hr_manager`          | HR Manager               | Human Resources management               |
| `engineering_manager` | Engineering Manager      | Engineering department management        |
| `product_manager`     | Product Manager          | Product Management department management |
| `sales_manager`       | Sales Manager            | Sales department management              |
| `marketing_manager`   | Marketing Manager        | Marketing department management          |
| `cs_manager`          | Customer Success Manager | Customer Success management              |
| `legal_manager`       | Legal Manager            | Legal and Compliance management          |
| `security_manager`    | Security Manager         | Information Security management          |
| `it_ops_manager`      | IT Operations Manager    | IT Operations management                 |
| `analytics_manager`   | Analytics Manager        | Data and Analytics management            |
| `infra_manager`       | Infrastructure Manager   | Cloud Infrastructure management          |
| `procurement_manager` | Procurement Manager      | Procurement management                   |
| `strategy_manager`    | Strategy Manager         | Corporate Strategy management            |
| `facilities_manager`  | Facilities Manager       | Facilities and Workplace management      |
| `research_manager`    | Research Manager         | Research and Innovation management       |
| `ops_manager`         | Operations Manager       | Global Operations management             |

**Key Difference from `manager` role:**

- `manager` = structural team management only (no domain-specific permissions)
- `{dept}_manager` = contains domain-specific permissions (e.g., `finance_manager` gets `finance:*` permissions)
- Auto-assigned together to department heads/coheads

### 1.3 Department-Level Roles

One pair per department (18 departments):

| Department               | Member Role          | Admin Role          |
| ------------------------ | -------------------- | ------------------- |
| Executive Office         | `exec_member`        | `exec_admin`        |
| Finance                  | `finance_member`     | `finance_admin`     |
| Human Resources          | `hr_member`          | `hr_admin`          |
| Engineering              | `engineering_member` | `engineering_admin` |
| Product Management       | `product_member`     | `product_admin`     |
| Sales                    | `sales_member`       | `sales_admin`       |
| Marketing                | `marketing_member`   | `marketing_admin`   |
| Customer Success         | `cs_member`          | `cs_admin`          |
| Legal and Compliance     | `legal_member`       | `legal_admin`       |
| Information Security     | `security_member`    | `security_admin`    |
| IT Operations            | `it_ops_member`      | `it_ops_admin`      |
| Data and Analytics       | `analytics_member`   | `analytics_admin`   |
| Cloud Infrastructure     | `infra_member`       | `infra_admin`       |
| Procurement              | `procurement_member` | `procurement_admin` |
| Corporate Strategy       | `strategy_member`    | `strategy_admin`    |
| Facilities and Workplace | `facilities_member`  | `facilities_admin`  |
| Research and Innovation  | `research_member`    | `research_admin`    |
| Global Operations        | `ops_member`         | `ops_admin`         |

**Auto-Assignment Rule:**

- All employees in a department get `{dept}_member` role
- Department head & cohead get `{dept}_admin` role (in addition to member role if needed)

### 1.4 Portal/Widget-Specific Roles

One role per portal/widget + readonly variant:

**HR Portal:**

- `hr_user` - Can access HR portal features
- `hr_approver` - Can approve requests in HR portal

**Finance Portal:**

- `finance_user` - Can access finance portal, view reports
- `finance_reviewer` - Can review and approve budget/payroll

**DevWolke (Git) Portal:**

- `devwolke_user` - Can access repos, create PRs
- `devwolke_reviewer` - Can approve/merge PRs

**Admin Console:**

- `admin_user` - Can access admin console (limited)
- `admin_operator` - Can manage users, sessions

**Analytics Portal:**

- `analytics_user` - Can view analytics dashboards
- `analytics_editor` - Can modify dashboards, export data

---

## 2. Permission Structure

### 2.1 Portal-Level Permissions

Derived from existing `permissions` field in PORTALS config:

**HR Portal Permissions:**

- `hr:view_employee_profile`
- `hr:start_onboarding`
- `hr:approve_time_off`
- `hr:manage_benefits`
- `hr:view_sensitive_data` (payroll, personal info)
- `hr:modify_employee_record`

**Finance Portal Permissions:**

- `finance:view_reports`
- `finance:export_csv`
- `finance:approve_budget`
- `finance:modify_payroll`
- `finance:view_fund_allocation`
- `finance:modify_fund_allocation`

**DevWolke Portal Permissions:**

- `devwolke:read_repo`
- `devwolke:push_branch`
- `devwolke:merge_pr`
- `devwolke:manage_deploy_keys`
- `devwolke:manage_access`

**Admin Console Permissions:**

- `admin:manage_users`
- `admin:register_application`
- `admin:invalidate_sessions`
- `admin:assign_temporary_access`
- `admin:view_audit_logs`

**Analytics Portal Permissions:**

- `analytics:view_department_metrics`
- `analytics:view_cross_department_metrics`
- `analytics:export_reports`
- `analytics:inspect_audit_trends`
- `analytics:manage_dashboards`

### 2.2 Department-Level Permissions

Generic permissions for department context:

- `dept:view_department_data`
- `dept:manage_team_members`
- `dept:approve_requests`
- `dept:access_budget` (dept-scoped)
- `dept:manage_policies`

---

## 3. Role → Permission Mapping

### 3.1 Company-Level Role Mappings

**`company_admin` role:**

```
admin:manage_users
admin:register_application
admin:invalidate_sessions
admin:assign_temporary_access
admin:view_audit_logs
finance:view_reports
finance:export_csv
finance:approve_budget
finance:modify_payroll
finance:view_fund_allocation
finance:modify_fund_allocation
hr:view_employee_profile
hr:view_sensitive_data
devwolke:manage_access
analytics:view_cross_department_metrics
analytics:export_reports
analytics:manage_dashboards
dept:view_department_data
dept:access_budget
```

**`executive` role:**

```
finance:view_reports
finance:export_csv
finance:view_fund_allocation
analytics:view_cross_department_metrics
analytics:export_reports
hr:view_employee_profile
hr:start_onboarding
devwolke:read_repo
dept:view_department_data
admin:view_audit_logs
```

**`manager` role (minimal base permissions):**

```
hr:approve_time_off (for direct reports)
hr:manage_benefits (for direct reports)
dept:manage_team_members (within team)
dept:approve_requests (within team)
```

**`finance_manager` role:**

```
finance:view_reports
finance:export_csv
finance:approve_budget
finance:modify_payroll
finance:view_fund_allocation
finance:modify_fund_allocation
dept:access_budget
```

**`engineering_manager` role:**

```
devwolke:read_repo
devwolke:push_branch
devwolke:merge_pr
devwolke:manage_deploy_keys
dept:access_budget
```

**`hr_manager` role:**

```
hr:view_employee_profile
hr:start_onboarding
hr:approve_time_off
hr:manage_benefits
hr:view_sensitive_data
hr:modify_employee_record
dept:access_budget
```

**`product_manager` role:**

```
analytics:view_department_metrics (product-scoped)
devwolke:read_repo
dept:access_budget
```

**`sales_manager` role:**

```
finance:view_reports (sales-scoped)
analytics:view_department_metrics (sales-scoped)
dept:access_budget
```

**`marketing_manager` role:**

```
analytics:view_department_metrics (marketing-scoped)
dept:access_budget
```

**`cs_manager` role:**

```
hr:view_employee_profile (cs-scoped)
analytics:view_department_metrics (cs-scoped)
dept:access_budget
```

**`legal_manager` role:**

```
admin:view_audit_logs
dept:access_budget
```

**`security_manager` role:**

```
admin:manage_users
admin:view_audit_logs
admin:assign_temporary_access
devwolke:manage_access
dept:access_budget
```

**`it_ops_manager` role:**

```
admin:manage_users
admin:invalidate_sessions
admin:view_audit_logs
dept:access_budget
```

**`analytics_manager` role:**

```
analytics:view_department_metrics
analytics:view_cross_department_metrics (with restrictions)
analytics:export_reports
analytics:inspect_audit_trends
analytics:manage_dashboards (analytics-scoped)
dept:access_budget
```

**`infra_manager` role:**

```
devwolke:manage_access
devwolke:manage_deploy_keys
admin:register_application
dept:access_budget
```

**`procurement_manager` role:**

```
finance:view_reports (procurement-scoped)
finance:approve_budget
dept:access_budget
```

**`strategy_manager` role:**

```
finance:view_reports
analytics:view_cross_department_metrics
finance:view_fund_allocation
dept:access_budget
```

**`facilities_manager` role:**

```
admin:manage_users (facilities-scoped)
dept:access_budget
```

**`research_manager` role:**

```
devwolke:read_repo
analytics:view_department_metrics (research-scoped)
dept:access_budget
```

**`ops_manager` role:**

```
analytics:view_department_metrics (ops-scoped)
admin:manage_users (ops-scoped)
dept:access_budget
```

**`employee` role:**

```
hr:view_employee_profile (own profile only)
finance:view_reports (read-only)
analytics:view_department_metrics (dept-scoped)
devwolke:read_repo (scoped repos)
```

**`contractor` role:**

```
hr:view_employee_profile (own profile only)
analytics:view_department_metrics (dept-scoped, limited)
```

### 3.2 Department-Level Role Mappings

**`{dept}_member` role:**

```
dept:view_department_data
dept:manage_team_members (within team)
analytics:view_department_metrics (their dept)
```

**`{dept}_admin` role:**

```
dept:view_department_data
dept:manage_team_members
dept:approve_requests
dept:access_budget
dept:manage_policies
analytics:view_department_metrics (their dept)
+ All permissions from {dept}_member
+ Portal-specific admin permissions (if applicable)
```

### 3.3 Portal-Specific Role Mappings

**`hr_user` role:**

```
hr:view_employee_profile
hr:manage_benefits
hr:start_onboarding
hr:approve_time_off
```

**`hr_approver` role:**

```
hr:view_employee_profile
hr:view_sensitive_data
hr:approve_time_off
hr:modify_employee_record
+ All permissions from hr_user
```

**`finance_user` role:**

```
finance:view_reports
finance:export_csv
finance:view_fund_allocation
```

**`finance_reviewer` role:**

```
finance:view_reports
finance:export_csv
finance:approve_budget
finance:modify_payroll
finance:view_fund_allocation
finance:modify_fund_allocation
+ All permissions from finance_user
```

**`devwolke_user` role:**

```
devwolke:read_repo
devwolke:push_branch
```

**`devwolke_reviewer` role:**

```
devwolke:read_repo
devwolke:push_branch
devwolke:merge_pr
devwolke:manage_deploy_keys
```

**`admin_user` role:**

```
admin:view_audit_logs
admin:invalidate_sessions
```

**`admin_operator` role:**

```
admin:manage_users
admin:register_application
admin:invalidate_sessions
admin:assign_temporary_access
admin:view_audit_logs
```

**`analytics_user` role:**

```
analytics:view_department_metrics
analytics:view_cross_department_metrics (if authorized)
analytics:export_reports
```

**`analytics_editor` role:**

```
analytics:view_department_metrics
analytics:view_cross_department_metrics
analytics:export_reports
analytics:inspect_audit_trends
analytics:manage_dashboards
```

---

## 4. CSV Schema & Data Structure

### 4.1 `role.csv` Structure

```
id,name,description,category,scope
company_admin,Company Admin,System administrator with full access,organizational,global
executive,Executive,Executive leadership access,organizational,global
manager,Manager,Base manager role for team management,organizational,global
employee,Employee,Standard employee access,organizational,global
contractor,Contractor,Contractor access,organizational,global
exec_manager,Executive Manager,Executive Office management,domain_manager,global
finance_manager,Finance Manager,Finance management,domain_manager,global
hr_manager,HR Manager,HR management,domain_manager,global
engineering_manager,Engineering Manager,Engineering management,domain_manager,global
product_manager,Product Manager,Product management,domain_manager,global
sales_manager,Sales Manager,Sales management,domain_manager,global
marketing_manager,Marketing Manager,Marketing management,domain_manager,global
cs_manager,CS Manager,Customer Success management,domain_manager,global
legal_manager,Legal Manager,Legal management,domain_manager,global
security_manager,Security Manager,Security management,domain_manager,global
it_ops_manager,IT Operations Manager,IT Ops management,domain_manager,global
analytics_manager,Analytics Manager,Analytics management,domain_manager,global
infra_manager,Infrastructure Manager,Infrastructure management,domain_manager,global
procurement_manager,Procurement Manager,Procurement management,domain_manager,global
strategy_manager,Strategy Manager,Strategy management,domain_manager,global
facilities_manager,Facilities Manager,Facilities management,domain_manager,global
research_manager,Research Manager,Research management,domain_manager,global
ops_manager,Operations Manager,Global Operations management,domain_manager,global
exec_member,Executive Office Member,Member of Executive Office,departmental,dept
exec_admin,Executive Office Admin,Admin of Executive Office,departmental,dept
finance_member,Finance Member,Member of Finance,departmental,dept
finance_admin,Finance Admin,Admin of Finance,departmental,dept
hr_member,HR Member,Member of HR,departmental,dept
hr_admin,HR Admin,Admin of HR,departmental,dept
[... 16 more department pairs ...]
hr_user,HR Portal User,Can access HR portal,portal,hr
hr_approver,HR Approver,Can approve in HR portal,portal,hr
finance_user,Finance Portal User,Can access Finance portal,portal,finance
finance_reviewer,Finance Reviewer,Can review/approve in Finance,portal,finance
devwolke_user,DevWolke User,Can use Git portal,portal,git
devwolke_reviewer,DevWolke Reviewer,Can review PRs,portal,git
admin_user,Admin User,Can access Admin console,portal,admin
admin_operator,Admin Operator,Can operate Admin console,portal,admin
analytics_user,Analytics User,Can view analytics,portal,analytics
analytics_editor,Analytics Editor,Can manage analytics,portal,analytics
```

### 4.2 `permission.csv` Structure

```
id,name,description,resource,action,scope
hr:view_employee_profile,View Employee Profile,View employee information,hr,view,profile
hr:start_onboarding,Start Onboarding,Initiate onboarding process,hr,create,onboarding
hr:approve_time_off,Approve Time Off,Approve time off requests,hr,approve,time_off
hr:manage_benefits,Manage Benefits,Manage employee benefits,hr,manage,benefits
hr:view_sensitive_data,View Sensitive Data,View sensitive employee data,hr,view,sensitive
hr:modify_employee_record,Modify Employee Record,Edit employee records,hr,modify,record
finance:view_reports,View Reports,View financial reports,finance,view,reports
finance:export_csv,Export CSV,Export financial data,finance,export,csv
finance:approve_budget,Approve Budget,Approve budget requests,finance,approve,budget
finance:modify_payroll,Modify Payroll,Modify payroll information,finance,modify,payroll
finance:view_fund_allocation,View Fund Allocation,View fund allocation data,finance,view,allocation
finance:modify_fund_allocation,Modify Fund Allocation,Modify fund allocation,finance,modify,allocation
devwolke:read_repo,Read Repository,Read code repositories,devwolke,read,repo
devwolke:push_branch,Push Branch,Push to branches,devwolke,push,branch
devwolke:merge_pr,Merge PR,Merge pull requests,devwolke,merge,pr
devwolke:manage_deploy_keys,Manage Deploy Keys,Manage deployment keys,devwolke,manage,deploy_keys
devwolke:manage_access,Manage Access,Manage repository access,devwolke,manage,access
admin:manage_users,Manage Users,Create/modify/delete users,admin,manage,users
admin:register_application,Register Application,Register new applications,admin,register,application
admin:invalidate_sessions,Invalidate Sessions,Terminate user sessions,admin,invalidate,sessions
admin:assign_temporary_access,Assign Temporary Access,Grant temporary access,admin,assign,temporary_access
admin:view_audit_logs,View Audit Logs,View system audit logs,admin,view,audit_logs
analytics:view_department_metrics,View Department Metrics,View department analytics,analytics,view,dept_metrics
analytics:view_cross_department_metrics,View Cross-Dept Metrics,View cross-org analytics,analytics,view,cross_dept_metrics
analytics:export_reports,Export Reports,Export analytics reports,analytics,export,reports
analytics:inspect_audit_trends,Inspect Audit Trends,Analyze audit trends,analytics,inspect,audit_trends
analytics:manage_dashboards,Manage Dashboards,Create/modify dashboards,analytics,manage,dashboards
dept:view_department_data,View Department Data,View dept data,department,view,data
dept:manage_team_members,Manage Team Members,Manage team members,department,manage,team_members
dept:approve_requests,Approve Requests,Approve dept requests,department,approve,requests
dept:access_budget,Access Budget,Access dept budget,department,access,budget
dept:manage_policies,Manage Policies,Manage dept policies,department,manage,policies
```

### 4.3 `role_permission.csv` Structure

```
role_id,permission_id
company_admin,admin:manage_users
company_admin,admin:register_application
company_admin,admin:invalidate_sessions
company_admin,admin:assign_temporary_access
company_admin,admin:view_audit_logs
company_admin,finance:view_reports
[... many more rows ...]
employee,hr:view_employee_profile
employee,finance:view_reports
employee,analytics:view_department_metrics
employee,devwolke:read_repo
[... more rows ...]
```

### 4.4 `employee_role.csv` Structure

```
employee_id,role_id
E001,employee
E001,company_admin
E001,executive
E001,exec_admin
E001,exec_member
E001,manager
E001,exec_manager
E002,employee
E002,executive
E002,exec_member
E002,manager
E002,exec_manager
E003,employee
E003,finance_admin
E003,finance_member
E003,manager
E003,finance_manager
E003,finance_reviewer
E004,employee
E004,finance_member
E005,employee
E005,hr_admin
E005,hr_member
E005,manager
E005,hr_manager
E005,hr_approver
E006,employee
E006,hr_member
E007,employee
E007,engineering_admin
E007,engineering_member
E007,manager
E007,engineering_manager
E007,devwolke_reviewer
[... all 72 employees with their roles ...]
```

---

## 5. Auto-Assignment Strategy

### 5.1 Automatic Role Assignment Rules

**Rule 1: Organization-wide base role**

- **All employees** → `employee` role
- **All contractors** → `contractor` role (via persona)

**Rule 2: Executive Office specific**

- All employees in `D001` (Executive Office) → `exec_member` + `executive`
- Department head & cohead of `D001` → `exec_admin` + `company_admin` + `manager` + `exec_manager`

**Rule 3: Department membership**

- All employees in any department → `{dept}_member` role
- Department head & cohead → `{dept}_admin` + `{dept}_manager` + `manager` roles (combined)

**Rule 4: Manager designation**

- Any department head/cohead → `manager` role (base)
- Department head/cohead → `{dept}_manager` role (domain-specific)
- Any employee with direct reports (has entries in `employee.manager` field) → `manager` role

**Rule 5: Portal-specific roles** (manual or business logic based)

- Finance employees/managers → `finance_user` or `finance_reviewer`
- Engineering employees/managers → `devwolke_user` or `devwolke_reviewer`
- HR employees/managers → `hr_user` or `hr_approver`
- Similar pattern for other portals

**Example Results:**

```
Finance Head (E003):
  Base: employee
  Department: finance_member, finance_admin
  Manager: manager, finance_manager
  Portal: finance_reviewer
  → Permissions: Finance domain + team mgmt + NO Engineering access

Engineering Manager (E007):
  Base: employee
  Department: engineering_member, engineering_admin
  Manager: manager, engineering_manager
  Portal: devwolke_reviewer
  → Permissions: Engineering/DevWolke domain + team mgmt + NO Finance access

Product Manager (E009):
  Base: employee
  Department: product_member, product_admin
  Manager: manager, product_manager
  → Permissions: Product domain + team mgmt + NO Finance access
```

---

## 6. SQL Schema Requirements

### 6.1 Tables to Create/Update

```sql
-- roles table
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- organizational, departmental, portal
    scope TEXT, -- global, dept, specific_portal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    resource TEXT, -- hr, finance, devwolke, admin, analytics, department
    action TEXT, -- view, create, approve, modify, manage, etc.
    scope TEXT, -- profile, onboarding, sensitive, data, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- employee_roles junction table
CREATE TABLE IF NOT EXISTS employee_roles (
    employee_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, role_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- audit table (optional, for tracking changes)
CREATE TABLE IF NOT EXISTS role_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    action TEXT, -- assigned, revoked
    assigned_by TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

### 6.2 Indices for Performance

```sql
CREATE INDEX idx_employee_roles_employee ON employee_roles(employee_id);
CREATE INDEX idx_employee_roles_role ON employee_roles(role_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
```

---

## 7. Seeding Strategy

### 7.1 Order of Seeding

1. **Seed roles** from `role.csv` → `roles` table
2. **Seed permissions** from `permission.csv` → `permissions` table
3. **Seed role_permission mappings** from `role_permission.csv` → `role_permissions` table
4. **Seed employee_role assignments** from `employee_role.csv` → `employee_roles` table
5. Update `seed_sqlite.py` to include RBAC tables and seeding logic

### 7.2 CSV Generation

The CSV files should be generated by:

1. Manual definition of roles and permissions (provided in this plan)
2. Python script to generate role_permission mappings based on the mapping section
3. Python script to auto-generate employee_role assignments based on rules (section 5.1)

---

## 8. Backend API Endpoints for RBAC

### 8.1 Endpoints to Create

```
GET /api/employee/{id}/roles - Get roles for an employee
GET /api/employee/{id}/permissions - Get effective permissions for an employee
GET /api/roles - List all roles
GET /api/roles/{id} - Get specific role with permissions
GET /api/permissions - List all permissions
GET /api/permissions/{id} - Get specific permission details
POST /api/employee/{id}/roles - Assign role(s) to employee (admin only)
DELETE /api/employee/{id}/roles/{role_id} - Revoke role from employee (admin only)
GET /api/department/{dept_id}/members - Get all members + roles in department
```

### 8.2 Permission Checking Logic

```
Function: has_permission(employee_id, permission_id)
  1. Get all roles for employee_id from employee_roles
  2. For each role, get all permissions from role_permissions
  3. Return true if permission_id is in the set
```

---

## 9. Frontend Integration Points

### 9.1 UI Components to Gate

**HR Portal:**

- Show "Directs Under Me" widget: `has_permission(employee, "hr_mgmt")`
- Show "Send HR Session" button: `has_permission(employee, "hr:start_onboarding")`
- Show edit buttons: `has_permission(employee, "hr:modify_employee_record")`

**Finance Portal:**

- Show payslip section: `true` (all employees)
- Show payroll grid: `has_permission(employee, "finance:modify_payroll")`
- Show fund allocation: `has_permission(employee, "finance:view_fund_allocation")`
- Show edit buttons: `has_permission(employee, "finance:modify_fund_allocation")`

**DevWolke Portal:**

- Show merge button: `has_permission(employee, "devwolke:merge_pr")`
- Show raise PR form: `has_permission(employee, "devwolke:push_branch")`

**Admin Console:**

- Show user management: `has_permission(employee, "admin:manage_users")`
- Show badge request approval: `has_permission(employee, "admin:assign_temporary_access")`

**Analytics Portal:**

- Show cross-dept metrics: `has_permission(employee, "analytics:view_cross_department_metrics")`
- Show manage dashboards: `has_permission(employee, "analytics:manage_dashboards")`

### 9.2 Fetch Employee Permissions on Login

```typescript
// In frontend App.tsx useEffect
const userPermissions = await fetch(
  `/api/employee/{employeeId}/permissions`,
).then((r) => r.json());
// Store in context/state for component-level checks
```

---

## 10. Summary of Changes

| Component                    | Changes                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| **CSVs**                     | Populate: `role.csv`, `permission.csv`, `role_permission.csv`, `employee_role.csv`     |
| **SQLite Schema**            | Add: `roles`, `permissions`, `role_permissions`, `employee_roles`, `role_audit` tables |
| **seed_sqlite.py**           | Update to create RBAC tables, seed from CSVs                                           |
| **Backend (main.py)**        | Add RBAC API endpoints                                                                 |
| **Backend (portal_data.py)** | Add helper functions for permission checking                                           |
| **Frontend**                 | Add permission checks for component visibility, fetch user permissions on load         |

---

## 11. Implementation Phases

### Phase 1: Schema & Seed Data

- [ ] Define and populate CSVs for roles/permissions
- [ ] Update `seed_sqlite.py` with RBAC tables
- [ ] Validate SQLite schema

### Phase 2: Backend RBAC API

- [ ] Implement permission checking functions
- [ ] Add `/api/employee/{id}/permissions` endpoint
- [ ] Add `/api/employee/{id}/roles` endpoint
- [ ] Add role management endpoints

### Phase 3: Frontend Integration

- [ ] Fetch permissions on app load
- [ ] Gate UI components based on permissions
- [ ] Add permission check utility functions

### Phase 4: Testing & Refinement

- [ ] Test role assignments
- [ ] Verify permission propagation
- [ ] Test edge cases (no role, multiple roles, conflicting permissions)

---

## Questions for Review

1. **Permission Granularity**: Should we have finer-grained permissions (e.g., `view_own_profile` vs `view_any_profile`) or is department-scoping sufficient?

2. **Cross-functional Roles**: Should we support employees with roles in multiple departments (currently model supports it)?

3. **Time-bounded Roles**: Should some roles have expiration dates (e.g., temporary access during contractor period)?

4. **Delegation**: Should managers be able to delegate some permissions to team members?

5. **Cross-domain Manager Access**: Should cross-functional leaders (e.g., someone managing both Engineering and Security) get multiple `*_manager` roles?

6. **Contractor Visibility**: Should contractors see the main Wolke Systems portal or only specific portals?

7. **Domain Manager Scope**: For domain managers like `analytics_manager`, should they see cross-dept metrics automatically or require explicit `analytics_editor` role?
