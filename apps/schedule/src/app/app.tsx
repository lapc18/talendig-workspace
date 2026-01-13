import { FC } from 'react';
import styles from './app.module.scss';

export const App: FC = () => {
  return (
    <div className={styles.container}>
      <h1>Schedule App</h1>
      <p>Welcome to the Schedule application.</p>
    </div>
  );
};

export default App;
