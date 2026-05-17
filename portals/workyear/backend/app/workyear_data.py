SERVICE = {
    "name": "WorkYear",
    "tagline": "External workforce cloud",
    "boundary": "Separate external portal, ready for future SAML or OIDC federation.",
    "session_source": "Local WorkYear account",
}

NAVIGATION = [
    "Home",
    "Profile",
    "Time Off",
    "Pay",
    "Benefits",
    "Documents",
    "Directory",
]

WORKER = {
    "name": "Anika Rao",
    "initials": "AR",
    "role": "HR Business Partner",
    "company": "Wolke Systems",
    "worker_id": "WY-22491",
    "department": "Human Resources",
    "lifecycle_state": "Active employee",
}

TASKS = [
    {
        "title": "Confirm emergency contact",
        "detail": "People data sync waits for this field before the next export.",
        "due": "Due today",
        "priority": "Required",
    },
    {
        "title": "Approve laptop stipend",
        "detail": "Manager approval requested by Nora Iyer.",
        "due": "Due May 22",
        "priority": "Approval",
    },
    {
        "title": "Review tax declaration",
        "detail": "Payroll can use last year's declaration until the update is submitted.",
        "due": "Due June 1",
        "priority": "Optional",
    },
]

PAY_ITEMS = [
    {"label": "Next payroll", "value": "May 31", "note": "Scheduled"},
    {"label": "Current payslip", "value": "$7,420", "note": "Net estimate"},
    {"label": "Open reimbursements", "value": "3", "note": "Awaiting finance sync"},
]

INTEGRATIONS = [
    {"label": "HRIS source", "value": "WorkYear"},
    {"label": "Outbound feed", "value": "People directory export"},
    {"label": "Trust model", "value": "Future SAML SP or OIDC RP"},
    {"label": "Embedding policy", "value": "Separate external portal"},
]

TIME_OFF = {
    "balance_days": 18,
    "pending_requests": 1,
    "next_holiday": "June 17",
}

BENEFITS = {
    "plan": "Gold Health",
    "dependents": 2,
    "open_enrollment": "Closed",
}
