import { FC } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { talendigTheme, ServicesProvider } from '@talendig/shared';
import { db } from '../firebase/config';
import { Navbar } from '../components/Navbar';
import { ActiveClassesList } from '../features/ActiveClassesList';

export const App: FC = () => {
  return (
    <ThemeProvider theme={talendigTheme}>
      <CssBaseline />
      <ServicesProvider db={db}>
        <Navbar />
        <ActiveClassesList />
      </ServicesProvider>
    </ThemeProvider>
  );
};

export default App;
