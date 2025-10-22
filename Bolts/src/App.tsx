import { useState } from 'react';
import HomePage from './components/HomePage';
import LogPage from './components/LogPage';
import TimelinePage from './components/TimelinePage';

type Page = 'home' | 'log' | 'timeline';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          onNavigateToLog={() => setCurrentPage('log')}
          onNavigateToTimeline={() => setCurrentPage('timeline')}
        />
      )}
      {currentPage === 'log' && (
        <LogPage onNavigateHome={() => setCurrentPage('home')} />
      )}
      {currentPage === 'timeline' && (
        <TimelinePage onNavigateHome={() => setCurrentPage('home')} />
      )}
    </>
  );
}

export default App;
