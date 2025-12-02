import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LogIn, LogOut } from 'lucide-react';

type AdminGateProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const ADMIN_KEY = 'aaa-admin-authed';

const AdminGate: React.FC<AdminGateProps> = ({ title, description, children }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(ADMIN_KEY) === 'true'
  );

  const location = useLocation();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (loginId === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_KEY, 'true');
      setLoginError('');
    } else {
      setLoginError('ログインIDまたはパスワードが正しくありません。');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_KEY);
  };

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
              <ShieldCheck className="text-brand-dark" /> {title}
            </h1>
            {description && <p className="text-gray-500">{description}</p>}
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

        <div className="flex items-center gap-3 mb-6 text-sm font-medium">
          <Link
            to="/admin/blog"
            className={`px-4 py-2 rounded-full border transition-colors ${
              location.pathname.includes('/admin/blog')
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'border-gray-200 text-gray-700 hover:bg-white'
            }`}
          >
            ブログ管理
          </Link>
          <Link
            to="/admin/inquiries"
            className={`px-4 py-2 rounded-full border transition-colors ${
              location.pathname.includes('/admin/inquiries')
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'border-gray-200 text-gray-700 hover:bg-white'
            }`}
          >
            お問い合わせ管理
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminGate;
