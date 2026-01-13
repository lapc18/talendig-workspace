# Talendig Schedule

Schedule management application built with React, Vite, Nx, MUI, and Firebase.

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

2. Set up Firebase configuration (if needed):
   - Create a `.env` file in `apps/schedule/` directory
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
pnpm dev:schedule
# or
nx dev schedule
```

The app will be available at `http://localhost:4201`

## Development

### Building

```bash
pnpm build:schedule
# or
nx build schedule
```

Build output will be in `dist/apps/schedule/`

### Testing

```bash
pnpm test:schedule
# or
nx test schedule
```

### Linting

```bash
pnpm lint:schedule
# or
nx lint schedule
```

### Type Checking

```bash
pnpm typecheck:schedule
# or
nx typecheck schedule
```

## License

MIT
