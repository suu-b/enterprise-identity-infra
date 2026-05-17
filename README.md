# Wolke Systems

A simulated enterprise identity infrastructure project exploring how organizations centralize trust, identity, and access across interconnected internal systems.

The project models how modern enterprises evolve from isolated application logins into centralized identity ecosystems involving federation, organizational hierarchy, permission systems, and governance.

---

# Project Goal

The objective is not merely implementing authentication libraries.

The objective is understanding:

- how identity propagates through systems
- how organizations model trust
- how permissions emerge from structure
- how centralized authority evolves
- how distributed systems trust external assertions

This project treats authentication and authorization as architectural systems rather than isolated features.

---

# Fictional Organization

The system simulates a fictional mid-sized enterprise:

## Wolke Systems

Departments:

- Engineering
- Finance
- Human Resources
- Security
- Operations

Internal Applications:

- HR Portal
- Finance Dashboard
- Internal Git Service
- Admin Console
- Analytics Platform

Users:

- Employees
- Managers
- Interns
- Contractors
- System Administrators

The organization exists first.

Identity infrastructure emerges afterward.

---

# Architectural Progression

The project intentionally develops in stages.

Each stage introduces a new organizational pressure that naturally demands a new identity mechanism.

---

# Scope I · Foundational Authentication

Purpose:
Understand authentication before abstractions conceal it.

## Features

- User registration
- Password hashing
- Session-based authentication
- Cookies
- JWT access tokens
- Refresh tokens
- Password reset flow
- Email verification
- Session invalidation
- Login auditing

## Important Constraint

No authentication frameworks initially.

Authentication must first be implemented manually to understand:

- session lifecycle
- credential validation
- token issuance
- trust boundaries

---

# Scope II · Internal Applications Ecosystem

Purpose:
Create the environment identity systems are meant to regulate.

## Applications

### HR Portal

Used by HR employees and managers.

### Finance Dashboard

Restricted financial access.

### Internal Git Service

Engineering-focused development platform.

### Admin Console

Infrastructure and organizational administration.

### Analytics Platform

Cross-department reporting system.

## Organizational Conditions

Applications intentionally require:

- overlapping permissions
- conflicting access policies
- departmental separation
- temporary privilege escalation

Authentication now begins acquiring context.

---

# Scope III · Centralized Identity

Purpose:
Move identity away from individual applications.

## Technologies

- Keycloak
- OpenID Connect (OIDC)
- Centralized login
- Shared sessions
- Realm management

## Features

- Single Sign-On (SSO)
- Centralized logout
- Identity federation preparation
- Client registration
- Token validation

Applications no longer authenticate users independently.

Applications instead trust a centralized authority.

---

# Scope IV · MFA and Session Security

Purpose:
Model trust hardening mechanisms.

## Features

- TOTP-based MFA
- Recovery codes
- Trusted devices
- Session expiration
- Device/IP tracking
- Failed login detection
- Brute-force mitigation
- Password policy enforcement

## Audit Visibility

Track:

- suspicious logins
- failed authentication attempts
- concurrent sessions
- device history

Security becomes observable.

---

# Scope V · Organizational Identity

Purpose:
Introduce institutional hierarchy into identity systems.

## Technologies

- OpenLDAP
- Organizational Units (OUs)
- Group synchronization

## Features

- Department hierarchies
- Team structures
- Group-based membership
- Employee lifecycle management
- Manager relationships
- Contractor expiration policies

Example:

```text
Engineering
 ├── Backend
 ├── Frontend
 └── Platform

Finance
HR
Security
```

Identity now becomes administrative rather than merely technical.

---

# Scope VI · Authorization Systems

Purpose:
Model controlled access inside organizational structures.

## Authorization Models

### RBAC

Role-Based Access Control.

### ACLs

Fine-grained permission systems.

## Features

- Department-restricted access
- Resource ownership
- Feature-level permissions
- Temporary permissions
- Approval-based elevation
- Permission inheritance
- Administrative delegation

Example:

```text
Finance Analyst:
- view_reports
- export_csv

Finance Manager:
- approve_budget
- modify_payroll
```

Authorization becomes contextual rather than binary.

---

# Scope VII · Federation and Distributed Trust

Purpose:
Model trust relationships between independent systems.

## Technologies

- SAML
- External Identity Providers
- OIDC federation

## Features

- Google login
- GitHub login
- Enterprise IdP simulation
- Service Provider configuration
- Assertion validation
- XML signature handling

Applications begin trusting identities asserted externally.

This stage explores:

- delegated trust
- federation boundaries
- assertion-based authentication

---

# Scope VIII · Operational Failure Scenarios

Purpose:
Understand how identity systems fail.

## Simulations

- revoked accounts retaining access
- stale token usage
- privilege escalation mistakes
- expired contractor accounts
- replay attacks
- clock skew issues
- broken federation trust
- orphaned permissions

Enterprise systems become meaningful under failure conditions.

---

# Scope IX · Governance and Observability

Purpose:
Model long-term institutional control.

## Features

- Audit logging
- Permission history tracking
- Access analytics
- Session observability
- Compliance reporting
- Risk scoring
- Administrative event tracking

The system evolves into an observable organizational platform.

---

# Suggested Technology Stack

## Backend

- FastAPI

## Frontend

- React

## Identity Provider

- Keycloak

## Directory Services

- OpenLDAP

## Database

- PostgreSQL

## Infrastructure

- Docker Compose

---

# Core Insight

Every enterprise identity system is fundamentally solving four questions:

1. Who are you?
2. Who verified you?
3. What are you allowed to access?
4. Why should other systems trust that answer?

Everything else is infrastructure around these questions.

---

# Final Objective

The final system should resemble a functioning enterprise identity ecosystem rather than a collection of disconnected authentication demos.

The project is complete when:

- identity is centralized
- trust is distributed
- permissions are contextual
- hierarchy affects access
- systems federate correctly
- failures are observable
- governance becomes necessary
