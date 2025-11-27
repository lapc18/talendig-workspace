# Talendig Dashboard

Academic Cohort & Program Management WebApp built with React, Vite, Nx, MUI, and Firebase.

## Features

- **Programs Management**: Create and manage 10-month academic programs with automatic module generation
- **Modules Management**: Assign subjects and instructors to program modules
- **Cohorts Management**: Create and manage student cohorts
- **Students Management**: Enroll students into cohorts and track their progress
- **Instructors Management**: Manage instructor profiles with CV uploads and technology stack
- **Subjects Management**: Define and manage academic subjects
- **Dashboard**: Overview of key metrics and statistics

## Technology Stack

- **Frontend**: React 19 + Vite
- **UI Library**: Material-UI (MUI) 5.18
- **Architecture**: Nx Monorepo
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Forms**: Formik + Yup
- **Date Utilities**: date-fns

## Setup

### Prerequisites

- Node.js 18+
- pnpm 10+

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up Firebase configuration:
   - Create a `.env` file in `apps/dashboard/` directory
   - Add your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Start the development server:
```bash
pnpm dev
# or
nx dev dashboard
```

The app will be available at `http://localhost:4200`

## Project Structure

```
apps/dashboard/src/
├── app/              # Main app component
├── features/         # Feature modules
│   ├── auth/        # Authentication
│   ├── programs/    # Programs feature
│   ├── modules/     # Modules feature
│   ├── cohorts/     # Cohorts feature
│   ├── students/    # Students feature
│   ├── instructors/ # Instructors feature
│   ├── subjects/    # Subjects feature
│   └── dashboard/   # Dashboard feature
├── layouts/         # Layout components
├── routes/          # Route configuration
└── firebase/        # Firebase configuration

libs/shared/src/lib/
├── components/      # Shared UI components
├── hooks/          # Shared React hooks
├── services/       # Firestore services
├── types/          # TypeScript types
├── utils/          # Utility functions
└── configuration/  # Theme and configuration
```

## Shared Library

The shared library (`@talendig/shared`) provides:

- **Components**: Button, Card, LoadingSpinner, PageHeader
- **Hooks**: useAuth, useServices, useDebounce
- **Services**: Firestore services for all entities
- **Types**: TypeScript interfaces for all data models
- **Theme**: Talendig brand theme configuration

## Usage

### Authentication

The app uses Firebase Authentication. Users must sign in to access the dashboard.

### Creating a Program

1. Navigate to Programs
2. Click "Add Program"
3. Fill in program details (name, description, dates, duration)
4. Upon creation, 10 modules are automatically generated

### Managing Modules

1. Navigate to Modules
2. Filter by program if needed
3. Edit modules to assign subjects and instructors

### Managing Cohorts

1. Navigate to Cohorts
2. Create a new cohort linked to a program
3. View cohort details to see student roster

### Managing Students

1. Navigate to Students
2. Create students and assign them to cohorts
3. Students can be managed from the cohort detail page

## Development

### Building

```bash
nx build dashboard
```

### Testing

```bash
nx test dashboard
```

### Linting

```bash
nx lint dashboard
```

## Environment Variables

All Firebase configuration should be provided via environment variables. See the `.env.example` file for required variables.

## License

MIT

