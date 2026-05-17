
"""Seed the enterprise CSV dataset into a disk-backed SQLite database."""

from __future__ import annotations

import argparse
import csv
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_DIR = ROOT / "data"
DEFAULT_DB_PATH = ROOT / "data" / "wolke_systems.sqlite3"


SCHEMA = """
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS employee_codirects;
DROP TABLE IF EXISTS employee_directs;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS personas;

CREATE TABLE departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    head TEXT NOT NULL,
    cohead TEXT NOT NULL
);

CREATE TABLE personas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    wfh INTEGER NOT NULL CHECK (wfh IN (0, 1)),
    wfo INTEGER NOT NULL CHECK (wfo IN (0, 1)),
    hybrid INTEGER NOT NULL CHECK (hybrid IN (0, 1))
);

CREATE TABLE teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    head TEXT NOT NULL,
    cohead TEXT NOT NULL,
    department_id TEXT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    contact TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    department_id TEXT NOT NULL,
    persona_id TEXT NOT NULL,
    team_id TEXT NOT NULL,
    office TEXT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (persona_id) REFERENCES personas(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE employee_directs (
    manager_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    PRIMARY KEY (manager_id, employee_id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE employee_codirects (
    employee_id TEXT NOT NULL,
    codirect_id TEXT NOT NULL,
    PRIMARY KEY (employee_id, codirect_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (codirect_id) REFERENCES employees(id)
);

CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_persona_id ON employees(persona_id);
CREATE INDEX idx_employees_team_id ON employees(team_id);
CREATE INDEX idx_teams_department_id ON teams(department_id);
"""


def read_csv(data_dir: Path, filename: str) -> list[dict[str, str]]:
    csv_path = data_dir / filename
    with csv_path.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def parse_bool(value: str) -> int:
    normalized = value.strip().lower()
    if normalized == "true":
        return 1
    if normalized == "false":
        return 0
    raise ValueError(f"Expected boolean value, got {value!r}")


def split_ids(value: str) -> list[str]:
    return [item for item in value.split("|") if item]


def seed_database(data_dir: Path, db_path: Path) -> None:
    departments = read_csv(data_dir, "department.csv")
    personas = read_csv(data_dir, "persona.csv")
    teams = read_csv(data_dir, "team.csv")
    employees = read_csv(data_dir, "employee.csv")

    db_path.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(db_path) as connection:
        connection.executescript(SCHEMA)

        connection.executemany(
            """
            INSERT INTO departments (id, name, head, cohead)
            VALUES (:id, :name, :head, :cohead)
            """,
            departments,
        )

        connection.executemany(
            """
            INSERT INTO personas (id, name, wfh, wfo, hybrid)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                (
                    row["id"],
                    row["name"],
                    parse_bool(row["wfh"]),
                    parse_bool(row["wfo"]),
                    parse_bool(row["hybrid"]),
                )
                for row in personas
            ],
        )

        connection.executemany(
            """
            INSERT INTO teams (id, name, head, cohead, department_id)
            VALUES (:id, :name, :head, :cohead, :department)
            """,
            teams,
        )

        connection.executemany(
            """
            INSERT INTO employees (
                id,
                email,
                firstname,
                lastname,
                contact,
                emergency_contact,
                department_id,
                persona_id,
                team_id,
                office
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    row["id"],
                    row["email"],
                    row["firstname"],
                    row["lastname"],
                    row["contact"],
                    row["emergencycontact"],
                    row["department"],
                    row["persona"],
                    row["team"],
                    row["office"],
                )
                for row in employees
            ],
        )

        direct_rows = [
            (row["id"], employee_id)
            for row in employees
            for employee_id in split_ids(row["directs"])
        ]
        codirect_rows = [
            (row["id"], codirect_id)
            for row in employees
            for codirect_id in split_ids(row["codirects"])
        ]

        connection.executemany(
            """
            INSERT INTO employee_directs (manager_id, employee_id)
            VALUES (?, ?)
            """,
            direct_rows,
        )
        connection.executemany(
            """
            INSERT INTO employee_codirects (employee_id, codirect_id)
            VALUES (?, ?)
            """,
            codirect_rows,
        )

        add_employee_foreign_keys(connection)
        connection.commit()


def add_employee_foreign_keys(connection: sqlite3.Connection) -> None:
    """Validate employee-backed references after all employee rows exist."""
    checks = [
        (
            "departments.head",
            """
            SELECT departments.id, departments.head
            FROM departments
            LEFT JOIN employees ON employees.id = departments.head
            WHERE employees.id IS NULL
            """,
        ),
        (
            "departments.cohead",
            """
            SELECT departments.id, departments.cohead
            FROM departments
            LEFT JOIN employees ON employees.id = departments.cohead
            WHERE employees.id IS NULL
            """,
        ),
        (
            "teams.head",
            """
            SELECT teams.id, teams.head
            FROM teams
            LEFT JOIN employees ON employees.id = teams.head
            WHERE employees.id IS NULL
            """,
        ),
        (
            "teams.cohead",
            """
            SELECT teams.id, teams.cohead
            FROM teams
            LEFT JOIN employees ON employees.id = teams.cohead
            WHERE employees.id IS NULL
            """,
        ),
    ]

    for label, query in checks:
        missing = connection.execute(query).fetchall()
        if missing:
            raise ValueError(f"Invalid {label} employee references: {missing}")


def row_counts(db_path: Path) -> dict[str, int]:
    tables = [
        "departments",
        "personas",
        "teams",
        "employees",
        "employee_directs",
        "employee_codirects",
    ]
    with sqlite3.connect(db_path) as connection:
        return {
            table: connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            for table in tables
        }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Seed CSV data into a disk-backed SQLite database."
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=DEFAULT_DATA_DIR,
        help=f"Directory containing CSV files. Default: {DEFAULT_DATA_DIR}",
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=DEFAULT_DB_PATH,
        help=f"SQLite database path. Default: {DEFAULT_DB_PATH}",
    )
    args = parser.parse_args()

    seed_database(args.data_dir, args.db)

    print(f"Seeded SQLite database: {args.db}")
    for table, count in row_counts(args.db).items():
        print(f"{table}: {count}")


if __name__ == "__main__":
    main()
