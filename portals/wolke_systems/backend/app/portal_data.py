import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).resolve().parents[4] / "data" / "wolke_systems.sqlite3"


def get_db_connection() -> sqlite3.Connection:
    """Get a connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


COMPANY = {
    "name": "Wolke Systems",
    "tagline": "Internal enterprise identity playground",
    "stage": "Wolke Applications Ecosystem",
    "identity_note": "Protected",
}


def get_departments() -> list[dict[str, Any]]:
    """Fetch departments from SQLite database."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                d.id,
                d.name,
                COUNT(DISTINCT t.id) as team_count,
                COUNT(DISTINCT e.id) as employee_count,
                d.head as lead_id
            FROM departments d
            LEFT JOIN teams t ON t.department_id = d.id
            LEFT JOIN employees e ON e.department_id = d.id
            GROUP BY d.id, d.name, d.head
        """)
        
        departments = []
        for row in cursor.fetchall():
            dept_dict = dict(row)
            # Fetch the lead name
            lead_cursor = conn.cursor()
            lead_cursor.execute(
                "SELECT firstname, lastname FROM employees WHERE id = ?",
                (dept_dict['lead_id'],)
            )
            lead_row = lead_cursor.fetchone()
            lead_name = f"{lead_row[0]} {lead_row[1]}" if lead_row else "Unknown"
            
            # Fetch team names
            team_cursor = conn.cursor()
            team_cursor.execute(
                "SELECT name FROM teams WHERE department_id = ?",
                (dept_dict['id'],)
            )
            teams = [t[0] for t in team_cursor.fetchall()]
            
            departments.append({
                "id": dept_dict['id'],
                "name": dept_dict['name'],
                "teams": teams,
                "headcount": dept_dict['employee_count'],
                "lead": lead_name,
            })
        
        return departments
    finally:
        conn.close()


def get_users() -> list[dict[str, Any]]:
    """Fetch users (employees) from SQLite database."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                e.id,
                e.firstname,
                e.lastname,
                e.email,
                d.name as department_name,
                t.name as team_name,
                e.office
            FROM employees e
            LEFT JOIN departments d ON d.id = e.department_id
            LEFT JOIN teams t ON t.id = e.team_id
            ORDER BY e.firstname, e.lastname
        """)
        
        users = []
        for row in cursor.fetchall():
            row_dict = dict(row)
            users.append({
                "id": row_dict['id'],
                "name": f"{row_dict['firstname']} {row_dict['lastname']}",
                "role": row_dict['team_name'] or "Employee",
                "department": row_dict['department_name'] or "Unassigned",
                "type": "Employee",
                "status": "Active",
                "location": row_dict['office'] or "Remote",
            })
        
        return users
    finally:
        conn.close()


DEPARTMENTS = get_departments()
USERS = get_users()

PORTALS = [
    {
        "id": "hr",
        "name": "HR Portal",
        "summary": "Employee lifecycle, manager approvals, onboarding, and people operations.",
        "department": "Human Resources",
        "accent": "#c2410c",
        "required_context": ["employee_status", "manager_relationship", "department"],
        "primary_roles": ["HR Employee", "Manager"],
        "permissions": ["view_employee_profile", "start_onboarding", "approve_time_off", "manage_benefits"],
        "metrics": [
            {"label": "Open onboarding cases", "value": "12"},
            {"label": "Pending manager approvals", "value": "7"},
            {"label": "Contractors expiring", "value": "3"},
        ],
        "records": [
            {"title": "Nora Iyer", "meta": "Platform Engineer", "status": "Benefits update pending"},
            {"title": "Sam Gill", "meta": "Contractor", "status": "Renewal review needed"},
            {"title": "Campus intern batch", "meta": "8 people", "status": "Onboarding next Monday"},
        ],
    },
    {
        "id": "finance",
        "name": "Finance Dashboard",
        "summary": "Budget monitoring, payroll review, reimbursements, and finance approvals.",
        "department": "Finance",
        "accent": "#047857",
        "required_context": ["finance_role", "approval_limit", "department"],
        "primary_roles": ["Finance Analyst", "Finance Manager"],
        "permissions": ["view_reports", "export_csv", "approve_budget", "modify_payroll"],
        "metrics": [
            {"label": "Monthly spend", "value": "$842K"},
            {"label": "Budget approvals", "value": "5"},
            {"label": "Payroll exceptions", "value": "2"},
        ],
        "records": [
            {"title": "Engineering cloud budget", "meta": "$96K requested", "status": "Manager approval required"},
            {"title": "Q2 travel reimbursements", "meta": "31 claims", "status": "Ready for review"},
            {"title": "Payroll adjustment", "meta": "2 employees", "status": "Restricted action"},
        ],
    },
    {
        "id": "git",
        "name": "DevWolke",
        "summary": "Engineering repositories, pull requests, deployment keys, and code ownership.",
        "department": "Engineering",
        "accent": "#2563eb",
        "required_context": ["engineering_team", "repo_membership", "contractor_status"],
        "primary_roles": ["Engineer", "Engineering Manager", "Security Reviewer"],
        "permissions": ["read_repo", "push_branch", "merge_pr", "manage_deploy_keys"],
        "metrics": [
            {"label": "Active repositories", "value": "48"},
            {"label": "Open pull requests", "value": "26"},
            {"label": "Protected branches", "value": "19"},
        ],
        "records": [
            {"title": "identity-gateway", "meta": "Platform", "status": "3 PRs waiting"},
            {"title": "payroll-service", "meta": "Finance systems", "status": "Security review required"},
            {"title": "contractor-access", "meta": "IAM tooling", "status": "Deploy key rotates today"},
        ],
    },
    {
        "id": "admin",
        "name": "Admin Console",
        "summary": "Organization administration, application inventory, system settings, and access operations.",
        "department": "Security",
        "accent": "#7c3aed",
        "required_context": ["admin_role", "break_glass_state", "audit_reason"],
        "primary_roles": ["System Administrator", "Security Administrator"],
        "permissions": ["manage_users", "register_application", "invalidate_sessions", "assign_temporary_access"],
        "metrics": [
            {"label": "Managed apps", "value": "5"},
            {"label": "Temporary grants", "value": "4"},
            {"label": "Audit events today", "value": "183"},
        ],
        "records": [
            {"title": "Finance Dashboard client", "meta": "Internal app", "status": "OIDC prep pending"},
            {"title": "Contractor access policy", "meta": "Security", "status": "Expires automatically"},
            {"title": "Session invalidation drill", "meta": "IAM", "status": "Scheduled Friday"},
        ],
    },
    {
        "id": "analytics",
        "name": "Analytics Platform",
        "summary": "Cross-department reporting, operational visibility, and governance dashboards.",
        "department": "Operations",
        "accent": "#0891b2",
        "required_context": ["report_scope", "data_classification", "department_visibility"],
        "primary_roles": ["Manager", "Data Analyst", "Security Reviewer"],
        "permissions": ["view_department_metrics", "view_cross_department_metrics", "export_reports", "inspect_audit_trends"],
        "metrics": [
            {"label": "Dashboards", "value": "17"},
            {"label": "Restricted datasets", "value": "6"},
            {"label": "Exports this week", "value": "44"},
        ],
        "records": [
            {"title": "Department access matrix", "meta": "Governance", "status": "Updated hourly"},
            {"title": "Failed login trend", "meta": "Security", "status": "Waiting for auth data"},
            {"title": "Contractor system usage", "meta": "Operations", "status": "Needs identity feed"},
        ],
    },
]
