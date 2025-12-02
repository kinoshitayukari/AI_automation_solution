import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useNavigateToContact = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return React.useCallback(() => {
    const scrollToSection = () => {
      const target = document.getElementById('contact');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (location.pathname === '/') {
      scrollToSection();
    } else {
      navigate('/', { state: { scrollTo: 'contact' } });
    }
  }, [location.pathname, navigate]);
};
