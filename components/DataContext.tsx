import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BLOG_POSTS as DEFAULT_BLOG_POSTS } from '../constants';
import { BlogPost, ContactSubmission } from '../types';
import { supabase, supabaseSchema } from '../supabaseClient';

const BLOG_TABLE = import.meta.env.VITE_SUPABASE_BLOG_TABLE || 'blog_posts';
const CONTACT_TABLE =
  import.meta.env.VITE_SUPABASE_CONTACT_TABLE || 'contact_submissions';

const tableCreateSql: Record<string, string> = {
  [BLOG_TABLE]: `
    create table if not exists ${supabaseSchema}.${BLOG_TABLE} (
      id uuid primary key,
      title text,
      excerpt text,
      content text,
      category text,
      tags text[],
      author_name text,
      author_avatar text,
      date timestamptz,
      read_time text,
      image_url text
    );
  `,
  [CONTACT_TABLE]: `
    create table if not exists ${supabaseSchema}.${CONTACT_TABLE} (
      id uuid primary key,
      name text,
      email text,
      topic text,
      message text,
      created_at timestamptz default now(),
      status text
    );
  `,
};

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

const projectRefFromUrl = (url: string) => {
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/);
  return match?.[1];
};

const withTableHint = (error: string | null, table: string) => {
  if (error?.includes('Could not find the table')) {
    const createSql = tableCreateSql[table]?.trim();
    const sqlHint = createSql ? `\n作成例:\n${createSql}` : '';
    const envHint =
      table === BLOG_TABLE
        ? '環境変数 VITE_SUPABASE_BLOG_TABLE に実際のブログテーブル名を指定してください。'
        : '環境変数 VITE_SUPABASE_CONTACT_TABLE に実際の問い合わせテーブル名を指定してください。\n例: contact_submissions（推奨）, contact_submission など、Supabase で作成した正確な名前を設定してください。';

    const projectRef = projectRefFromUrl(import.meta.env.VITE_SUPABASE_URL || '');
    const sqlEditorUrl = projectRef
      ? `https://supabase.com/dashboard/project/${projectRef}/sql` 
      : 'Supabase ダッシュボード (SQL Editor)';

    const howToCreate =
      '\n\n---\nSupabase にテーブルを作成する手順:\n1. Supabase ダッシュボードにログイン\n2. プロジェクトの SQL Editor を開く\n3. 上記の CREATE TABLE 文を貼り付けて実行\n4. RLS を無効化するか、 anon ロールが読み書きできるポリシーを追加';

    return `${error}（スキーマ: ${supabaseSchema}, テーブル名: ${table}）\n${envHint}${sqlHint}\nSQL Editor: ${sqlEditorUrl}${howToCreate}`;
  }
  return error;
};

  const reportError = (context: string, error?: string | null) => {
    const message = error ? `${context}: ${error}` : context;
    console.error(message);
    if (typeof window !== 'undefined') {
      alert(message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const { data: blogData, error: blogError } = await supabase.select<any>(BLOG_TABLE, {
        column: 'date',
        ascending: false,
      });

      if (blogError) {
        reportError('ブログ記事の取得に失敗しました', withTableHint(blogError, BLOG_TABLE));
      }

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
        const { error: seedError } = await supabase.upsert(BLOG_TABLE,
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

        if (seedError) {
          reportError('デフォルト記事のSupabase投入に失敗しました', seedError);
        }
      }

      const { data: contactData, error: contactError } = await supabase.select<any>(
        CONTACT_TABLE,
        {
          column: 'created_at',
          ascending: false,
        }
      );

      if (contactError) {
        reportError('問い合わせの取得に失敗しました', withTableHint(contactError, CONTACT_TABLE));
      }

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
    const { error } = await supabase.upsert(BLOG_TABLE, {
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

    if (error) {
      setBlogPosts((prev) => prev.filter((p) => p.id !== post.id));
      reportError('ブログ記事の保存に失敗しました', withTableHint(error, BLOG_TABLE));
    }
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    const previous = blogPosts;
    setBlogPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...updates } : post)));
    const target = { ...blogPosts.find((post) => post.id === id), ...updates } as BlogPost;
    const { error } = await supabase.upsert(BLOG_TABLE, {
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

    if (error) {
      setBlogPosts(previous);
      reportError('ブログ記事の更新に失敗しました', withTableHint(error, BLOG_TABLE));
    }
  };

  const removeBlogPost = async (id: string) => {
    const previous = blogPosts;
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
    const { error } = await supabase.delete(BLOG_TABLE, 'id', id);

    if (error) {
      setBlogPosts(previous);
      reportError('ブログ記事の削除に失敗しました', withTableHint(error, BLOG_TABLE));
    }
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
    const { error } = await supabase.insert(CONTACT_TABLE, {
      id: newSubmission.id,
      name: newSubmission.name,
      email: newSubmission.email,
      topic: newSubmission.topic,
      message: newSubmission.message,
      created_at: newSubmission.createdAt,
      status: newSubmission.status,
    });

    if (error) {
      setContactSubmissions((prev) => prev.filter((entry) => entry.id !== newSubmission.id));
      reportError('問い合わせの保存に失敗しました', withTableHint(error, CONTACT_TABLE));
    }
  };

  const updateContactStatus = async (id: string, status: ContactSubmission['status']) => {
    const previous = contactSubmissions;
    setContactSubmissions((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status } : entry))
    );
    const { error } = await supabase.update(CONTACT_TABLE, 'id', id, { status });

    if (error) {
      setContactSubmissions(previous);
      reportError(
        '問い合わせステータスの更新に失敗しました',
        withTableHint(error, CONTACT_TABLE)
      );
    }
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
