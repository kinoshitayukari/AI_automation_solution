import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { useDataContext } from '../components/DataContext';

const BlogList: React.FC = () => {
  const { blogPosts } = useDataContext();
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [searchQuery, setSearchQuery] = useState("");
  const htmlPosts = [
    {
      title: "App Google AI Studio Build",
      file: "App_Google_AI_Studio_Build.html",
    },
    {
      title: "Difference GPT1.5 Image Nano Banana",
      file: "Defference_GPT1.5Image_NanoBanana.html",
    },
    {
      title: "Difference Google AI Studio Gemini Opal",
      file: "Defference_GoogleAIStudio_GeminiOpal.html",
    },
    {
      title: "Elon Macrohard",
      file: "Elon_Macrohard.html",
    },
    {
      title: "Elon Space Newest",
      file: "Elon_space_newest.html",
    },
    {
      title: "Elon Sunpower Newest",
      file: "Elon_sunpower_newest.html",
    },
    {
      title: "Difference Gemini 3 vs ChatGPT 5",
      file: "defference_gemini3_chatgpt5.html",
    },
    {
      title: "Mini App Function on Gems",
      file: "miniapp_function_on_gems.html",
    },
    {
      title: "What Gemini 3 Flash",
      file: "what_gemini_3_flash.html",
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "すべて" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Blog Header */}
      <div className="bg-brand-dark text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            LEARNING BLOG
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI自動化を学ぶ<br />無料ブログ記事
          </h1>
          <p className="text-gray-300 max-w-2xl text-lg">
            実践的なテクニックから基礎知識まで、AI業務自動化に関する情報を無料で公開しています
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-b border-gray-200 bg-white sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="記事を検索..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-brand-dark text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.eyeCatchUrl || post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-gray-400 text-xs mb-3 space-x-3">
                    <span>📅 {post.date}</span>
                    <span className="flex items-center"><Clock size={12} className="mr-1"/> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-light transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center pt-4 border-t border-gray-100">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 ${
                        post.category === '基礎知識' ? 'bg-teal-600' : 'bg-brand-light'
                    }`}>
                        {post.author.avatar}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{post.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">検索条件に一致する記事が見つかりませんでした。</p>
            <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('すべて');}}
                className="mt-4 text-brand-dark underline hover:text-brand-light"
            >
                検索条件をリセット
            </button>
          </div>
        )}
      </div>

      {/* HTML Blog Links */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">HTMLブログ記事</h2>
              <p className="text-gray-500 mt-2">
                公開済みのHTML記事はこちらからご覧いただけます。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {htmlPosts.map((post) => (
              <a
                key={post.file}
                href={`${import.meta.env.BASE_URL}blog/posts/${post.file}`}
                className="group border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
                target="_blank"
                rel="noreferrer"
              >
                <div className="text-sm text-gray-400 mb-2">HTML</div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-light transition-colors">
                  {post.title}
                </h3>
                <div className="mt-4 inline-flex items-center text-sm text-brand-dark font-semibold">
                  記事を開く <ArrowRight className="ml-2" size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="bg-gray-50 py-24">
         <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">もっと深く学びたい方へ</h2>
            <p className="text-gray-600 mb-8">実践的なカリキュラムで、AI自動化のスキルを体系的に習得できます</p>
            <button className="bg-brand-dark hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto">
                無料体験を始める <ArrowRight size={18} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default BlogList;
