# 📘 PRD – Academic Cohort & Program Management WebApp
_(React + Vite + Nx + MUI + Firebase + Firestore + Storage)_

## 1. Overview
This WebApp manages academic cohorts, programs, modules, subjects, instructors, and students within a structured academic ecosystem.

The system supports:
- Cohorts (groups of students)
- Programs (10-month structured curriculum)
- Modules (1 module per month per program)
- Subjects
- Instructors (with CVs & skillset)
- Students

It provides administrative tools, academic organization, and real-time data updates using Firebase + Firestore.

## 2. Core Academic Structure

### 2.1 Programs
A Program is a 10-month structured learning path containing 10 Modules (one module per month).  
A program includes:
- Start Date
- End Date
- DurationMonths
- 10 Modules (Month 1 → Month 10)

### 2.2 Modules
A Module is a single month of content within a program.
- Each module belongs to one Program
- Each module contains one Subject & one Instructor
- Includes start/end dates, hours, and month order

### 2.3 Cohorts
A Cohort is a group of students that runs through the entire Program together.
A cohort includes:
- Name
- Program reference
- Start/End Dates
- Student list
- Status

### 2.4 Students
Students enroll into Cohorts and include:
- Full name
- Contact info
- Birth date
- Status

### 2.5 Instructors
Instructors include:
- Full name
- Email (required)
- Phone
- Bio
- Technology stack (multi-tag)
- CV stored in Firebase Storage
- Assigned modules

### 2.6 Subjects
Subjects define content taught in modules and include:
- Name
- Description
- Type
- Unique code
- Default hours
- Status

## 3. Technology Stack
| Layer | Technology |
|------|------------|
| Frontend | React 19 + Vite + MUI |
| Architecture | Nx Monorepo |
| Database | Firestore |
| Authentication | Firebase Auth |
| Storage | Firebase Storage |
| Testing | Vitest |
| Deployment | Firebase Hosting |

## 4. Firestore Data Model

### 4.1 Collection: programs
```json
{
  "id": "programId",
  "name": "Full-Stack Developer Program",
  "description": "10-month program",
  "startDate": "2025-01-01",
  "endDate": "2025-11-01",
  "durationMonths": 10,
  "status": "active"
}
```

### 4.2 Collection: modules
```json
{
  "id": "moduleId",
  "programId": "programId",
  "subjectId": "subjectId",
  "instructorId": "instructorId",
  "subjectSnapshot": "Programming Foundations",
  "instructorSnapshot": "John Doe",
  "startDate": "2025-01-01",
  "endDate": "2025-01-28",
  "hours": 24,
  "monthNumber": 1
}
```

### 4.3 Collection: cohorts
```json
{
  "id": "cohortId",
  "name": "Cohort 1 - January 2025",
  "programId": "programId",
  "startDate": "2025-01-01",
  "endDate": "2025-11-01",
  "status": "active"
}
```

### 4.4 Collection: students
```json
{
  "id": "studentId",
  "cohortId": "cohortId",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 809 555 5555",
  "birthDate": "2002-04-10",
  "status": "active"
}
```

### 4.5 Collection: subjects
```json
{
  "id": "subjectId",
  "name": "Programming Foundations",
  "description": "Introductory course",
  "type": "Tech",
  "code": "PF-101",
  "defaultHours": 24,
  "status": "active"
}
```

### 4.6 Collection: instructors
```json
{
  "id": "instructorId",
  "fullName": "Luis Adolfo Pimentel",
  "email": "lapc@example.com",
  "phone": "+1 809 555 5555",
  "shortBio": "",
  "status": "active",
  "technologies": ["React", "Node.js"],
  "cvStoragePath": "instructors/instructorId/cv.pdf",
  "cvUrl": "https://..."
}
```

## 5. Features

### F1 – Programs
- CRUD
- Generate 10 modules automatically
- Manage timeline

### F2 – Modules
- Assign subject & instructor
- Edit schedule, hours, month number

### F3 – Cohorts
- CRUD
- Add/remove students
- Progress tracking
- Graduation flow

### F4 – Students
- CRUD
- Enroll into cohorts
- Status updates

### F5 – Subjects
- CRUD
- Default hours applied to modules

### F6 – Instructors
- CRUD
- Tech stack tags
- CV upload via Firebase Storage
- Module assignment overview

### F7 – Dashboards
- Cohort progress
- Instructor load distribution
- Program timeline view

## 6. Authentication & Roles
| Role | Permissions |
|------|-------------|
| admin | Full CRUD |
| coordinator | Cohorts + students |
| viewer | Read-only |

## 7. Firestore Security Rules
```js
allow read: if request.auth != null;
allow write: if request.auth.token.admin == true;
```

## 8. Storage Rules
```js
match /instructors/{id}/{file} {
  allow read: if request.auth != null;
  allow write: if request.auth.token.admin == true;
}
```

## 9. UI Requirements

### Program UI
- Timeline
- Month-by-month module editor
- Subject/instructor selectors

### Cohort UI
- Details view
- Student roster
- Enrollment management

### Instructor UI
- Tech tags
- CV upload
- Module assignment table

### Student UI
- CRUD form
- Enrollment under cohort context

## 10. Testing (Vitest)
- Program creation flow
- Module auto-generation
- Cohort creation + enrollment
- Instructor CV upload tests
- Snapshot tests

## 11. Deployment
- Firebase Hosting
- GitHub Actions CI/CD
- Nx Cloud
- Environment configs

## 12. Future Enhancements
- Attendance tracking
- Academic analytics dashboard
- Instructor availability calendar
- Export to PDF/Excel
