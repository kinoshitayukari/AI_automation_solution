import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogIn, LogOut, Newspaper, Inbox } from 'lucide-react';
import { useDataContext } from '../components/DataContext';
import { BlogPost } from '../types';

const Admin: React.FC = () => {
  const {
    blogPosts,
    addBlogPost,
    removeBlogPost,
    contactSubmissions,
    updateContactStatus,
  } = useDataContext();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('aaa-admin-authed') === 'true';
  });

  const [newPost, setNewPost] = useState({
    title: '',
    category: '基礎知識',
    excerpt: '',
    content: '',
    tags: '',
    imageUrl: 'https://picsum.photos/id/180/800/450',
    readTime: '5分',
  });

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (loginId === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('aaa-admin-authed', 'true');
      setLoginError('');
    } else {
      setLoginError('ログインIDまたはパスワードが正しくありません。');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aaa-admin-authed');
  };

  const handleCreatePost = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newPost.title || !newPost.excerpt || !newPost.content) {
      setLoginError('記事の必須項目を入力してください。');
      return;
    }

    const post: BlogPost = {
      id: crypto.randomUUID(),
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: { name: '管理者', avatar: 'AD' },
      date: new Date().toISOString().slice(0, 10),
      readTime: newPost.readTime || '5分',
      imageUrl: newPost.imageUrl || 'https://picsum.photos/id/180/800/450',
    };

    addBlogPost(post);
    setNewPost({
      title: '',
      category: '基礎知識',
      excerpt: '',
      content: '',
      tags: '',
      imageUrl: 'https://picsum.photos/id/180/800/450',
      readTime: '5分',
    });
    setLoginError('');
  };

  const contactStats = useMemo(() => {
    const total = contactSubmissions.length;
    const resolved = contactSubmissions.filter((c) => c.status === '対応済み').length;
    return { total, resolved };
  }, [contactSubmissions]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-brand-dark" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理画面ログイン</h1>
              <p className="text-sm text-gray-500">ログインID admin / パスワード admin</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ログインID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                placeholder="admin"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
            >
              <LogIn size={18} /> ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-brand-dark" /> 管理ダッシュボード
            </h1>
            <p className="text-gray-500">ブログ記事と問い合わせを一元管理できます。</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-brand-dark underline">
              サイトに戻る
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white shadow-sm"
            >
              <LogOut size={18} /> ログアウト
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">記事数</p>
            <p className="text-3xl font-bold text-gray-900">{blogPosts.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">問い合わせ数</p>
            <p className="text-3xl font-bold text-gray-900">{contactStats.total}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">対応済み</p>
            <p className="text-3xl font-bold text-gray-900">{contactStats.resolved}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="text-brand-dark" />
              <h2 className="text-xl font-bold text-gray-900">ブログ管理</h2>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    <option value="基礎知識">基礎知識</option>
                    <option value="実践テクニック">実践テクニック</option>
                    <option value="ツール活用">ツール活用</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タグ (カンマ区切り)</label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="#AI, #自動化"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">読了時間</label>
                  <input
                    type="text"
                    value={newPost.readTime}
                    onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="5分"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">リード文</label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メイン画像URL</label>
                <input
                  type="text"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
              >
                記事を追加する
              </button>
            </form>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-100 rounded-lg p-3 flex items-start justify-between gap-3 bg-gray-50"
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{post.category} ・ {post.date}</p>
                    <p className="font-semibold text-gray-900 leading-tight">{post.title}</p>
                  </div>
                  <button
                    onClick={() => removeBlogPost(post.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </div>
              ))}
              {blogPosts.length === 0 && (
                <p className="text-sm text-gray-500">まだ記事がありません。</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Inbox className="text-brand-dark" />
              <h2 className="text-xl font-bold text-gray-900">問い合わせ管理</h2>
            </div>
            {contactSubmissions.length === 0 ? (
              <p className="text-sm text-gray-500">まだ問い合わせは届いていません。</p>
            ) : (
              <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
                {contactSubmissions.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-100 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{entry.name}</p>
                        <p className="text-xs text-gray-500">{entry.email}</p>
                      </div>
                      <select
                        value={entry.status}
                        onChange={(e) => updateContactStatus(entry.id, e.target.value as any)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border ${
                          entry.status === '対応済み'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="未対応">未対応</option>
                        <option value="対応済み">対応済み</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">件名: {entry.topic}</p>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{entry.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      受信日時: {new Date(entry.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
