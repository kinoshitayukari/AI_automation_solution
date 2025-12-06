import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks: { name: string; path: string; external?: boolean }[] = [
    { name: 'サービス概要', path: '/' },
    { name: '学習コース', path: '/' },
    { name: 'ブログ', path: 'https://note.com/joyful_bobcat685', external: true },
    { name: '導入事例', path: '/' },
    { name: '管理画面', path: '/admin/blog' },
  ];

  // Helper to determine if we are on the home page for specific styling or logic
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isHome ? 'bg-brand-dark/90 backdrop-blur-md' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className={`text-2xl font-serif font-bold ${isHome ? 'text-white' : 'text-brand-dark'}`}>
                AI Automation Academy
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium hover:opacity-75 transition-colors ${
                      isHome ? 'text-white' : 'text-gray-700 hover:text-brand'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium hover:opacity-75 transition-colors ${
                      isHome ? 'text-white' : 'text-gray-700 hover:text-brand'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <Link
                to="/admin/blog"
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  isHome
                    ? 'border-white text-white hover:bg-white hover:text-brand-dark'
                    : 'border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white'
                }`}
              >
                ログイン
              </Link>
              <button className="bg-brand-accent hover:bg-teal-400 text-brand-dark px-5 py-2 rounded-full text-sm font-bold shadow-lg transition-transform transform hover:scale-105">
                無料体験
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${isHome ? 'text-white' : 'text-gray-800'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-dark absolute w-full left-0 top-20 shadow-xl border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="mt-4 flex flex-col space-y-3 px-3">
                <Link
                  to="/admin/blog"
                  className="w-full text-center py-2 border border-white text-white rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ログイン
                </Link>
                <button className="w-full text-center py-2 bg-brand-accent text-brand-dark font-bold rounded-md">
                  無料体験
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-serif font-bold mb-6">AI Automation Academy</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                AI業務自動化の実践的学習<br />
                プログラミング不要で始められる<br />
                3ヶ月で業務効率50%改善
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase mb-4 text-gray-300">Newsletter</h4>
              <div className="flex flex-col space-y-3">
                <input 
                  type="email" 
                  placeholder="メールアドレス" 
                  className="bg-brand-dark/50 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-accent text-white"
                />
                <button className="text-left text-xs text-gray-400 hover:text-white transition-colors">
                  最新情報をお届けします →
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase mb-4 text-gray-300">Courses</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">基礎コース</a></li>
                <li><a href="#" className="hover:text-white transition-colors">実践コース</a></li>
                <li><a href="#" className="hover:text-white transition-colors">エキスパートコース</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase mb-4 text-gray-300">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">会社概要</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
               <span>Designed by</span>
               <span className="bg-white text-black px-2 py-1 rounded font-bold flex items-center gap-1">
                 Readdy
               </span>
            </div>
            <p>© 2025 AI Automation Academy. All rights reserved.</p>
            <p>Powered by Readdy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;