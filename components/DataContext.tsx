import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BLOG_POSTS as DEFAULT_BLOG_POSTS } from '../constants';
import { BlogPost, ContactSubmission } from '../types';
import { supabase } from '../supabaseClient';

type DataContextType = {
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  removeBlogPost: (id: string) => Promise<void>;
  contactSubmissions: ContactSubmission[];
  addContactSubmission: (
    submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>
  ) => Promise<void>;
  updateContactStatus: (id: string, status: ContactSubmission['status']) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: blogData, error: blogError } = await supabase.select<any>('blog_posts', {
        column: 'date',
        ascending: false,
      });

      if (!blogError && blogData?.length) {
        setBlogPosts(
          blogData.map((row) => ({
            id: row.id,
            title: row.title,
            excerpt: row.excerpt,
            content: row.content,
            category: row.category,
            tags: row.tags ?? [],
            author: { name: row.author_name, avatar: row.author_avatar },
            date: row.date,
            readTime: row.read_time,
            imageUrl: row.image_url,
          }))
        );
      } else {
        setBlogPosts(DEFAULT_BLOG_POSTS);
        await supabase.upsert('blog_posts',
          DEFAULT_BLOG_POSTS.map((post) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            tags: post.tags,
            author_name: post.author.name,
            author_avatar: post.author.avatar,
            date: post.date,
            read_time: post.readTime,
            image_url: post.imageUrl,
          }))
        );
      }

      const { data: contactData } = await supabase.select<any>('contact_submissions', {
        column: 'created_at',
        ascending: false,
      });

      if (contactData) {
        setContactSubmissions(
          contactData.map((entry) => ({
            id: entry.id,
            name: entry.name,
            email: entry.email,
            topic: entry.topic ?? '',
            message: entry.message,
            createdAt: entry.created_at,
            status: entry.status,
          }))
        );
      }
    };

    loadData();
  }, []);

  const addBlogPost = async (post: BlogPost) => {
    setBlogPosts((prev) => [post, ...prev]);
    await supabase.upsert('blog_posts', {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags,
      author_name: post.author.name,
      author_avatar: post.author.avatar,
      date: post.date,
      read_time: post.readTime,
      image_url: post.imageUrl,
    });
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...updates } : post)));
    const target = { ...blogPosts.find((post) => post.id === id), ...updates } as BlogPost;
    await supabase.upsert('blog_posts', {
      id: target.id,
      title: target.title,
      excerpt: target.excerpt,
      content: target.content,
      category: target.category,
      tags: target.tags,
      author_name: target.author.name,
      author_avatar: target.author.avatar,
      date: target.date,
      read_time: target.readTime,
      image_url: target.imageUrl,
    });
  };

  const removeBlogPost = async (id: string) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
    await supabase.delete('blog_posts', 'id', id);
  };

  const addContactSubmission = async (
    submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>
  ) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: '未対応',
    };
    setContactSubmissions((prev) => [newSubmission, ...prev]);
    await supabase.insert('contact_submissions', {
      id: newSubmission.id,
      name: newSubmission.name,
      email: newSubmission.email,
      topic: newSubmission.topic,
      message: newSubmission.message,
      created_at: newSubmission.createdAt,
      status: newSubmission.status,
    });
  };

  const updateContactStatus = async (id: string, status: ContactSubmission['status']) => {
    setContactSubmissions((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status } : entry))
    );
    await supabase.update('contact_submissions', 'id', id, { status });
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
