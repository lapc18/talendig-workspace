import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { talendigTheme, AuthProvider, AuthService, ServicesProvider } from '@talendig/shared';
import { auth, db } from '../firebase/config';
import { AppRoutes } from '../routes/AppRoutes';

const authService = new AuthService(auth);

export function App() {
  return (
    <ThemeProvider theme={talendigTheme}>
      <CssBaseline />
      <AuthProvider authService={authService}>
        <ServicesProvider db={db}>
          <AppRoutes />
        </ServicesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
