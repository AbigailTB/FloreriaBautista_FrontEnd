import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './hooks/useToast';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </Router>
  );
}

export default App;
