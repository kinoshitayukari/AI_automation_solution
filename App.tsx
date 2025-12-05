import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

// ScrollToTop component to handle scroll position on route change
// Adjusted to not scroll if there is a scrollToContact state
const ScrollToTop = () => {
  const { pathname, state } = useLocation() as any;

  React.useEffect(() => {
    if (!state || !state.scrollToContact) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
