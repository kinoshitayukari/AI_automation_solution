import React, { createContext, useContext, useMemo, useState } from 'react';
import { BLOG_POSTS as DEFAULT_BLOG_POSTS } from '../constants';
import { BlogPost, ContactSubmission } from '../types';

type DataContextType = {
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  removeBlogPost: (id: string) => void;
  contactSubmissions: ContactSubmission[];
  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) => void;
  updateContactStatus: (id: string, status: ContactSubmission['status']) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);

  const addBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => [post, ...prev]);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...updates } : post)));
  };

  const removeBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const addContactSubmission = (
    submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>
  ) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: '未対応',
    };
    setContactSubmissions((prev) => [newSubmission, ...prev]);
  };

  const updateContactStatus = (id: string, status: ContactSubmission['status']) => {
    setContactSubmissions((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status } : entry))
    );
  };

  const value = useMemo(
    () => ({
      blogPosts,
      addBlogPost,
      updateBlogPost,
      removeBlogPost,
      contactSubmissions,
      addContactSubmission,
      updateContactStatus,
    }),
    [blogPosts, contactSubmissions]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
