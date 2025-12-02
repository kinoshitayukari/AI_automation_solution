import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';
import InquiryAdmin from './pages/InquiryAdmin';
import { DataProvider } from './components/DataContext';
import { Navigate } from 'react-router-dom';

// ScrollToTop component to handle scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <DataProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin" element={<Navigate to="/admin/blog" replace />} />
            <Route path="/admin/blog" element={<BlogAdmin />} />
            <Route path="/admin/inquiries" element={<InquiryAdmin />} />
          </Routes>
        </Layout>
      </DataProvider>
    </Router>
  );
};

export default App;
