import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useDataContext } from '../components/DataContext';

const BlogList: React.FC = () => {
  const { blogPosts } = useDataContext();

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-brand-dark font-semibold tracking-wider uppercase text-sm">Blog</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">最新のAI自動化トレンド</h1>
              <p className="text-gray-500 mt-3 max-w-2xl">
                業務効率化に役立つ実践的なノウハウや、最新のAIツール活用術をお届けします。
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full transform hover:-translate-y-1"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <img
                    src={post.eyeCatchUrl || post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </div>
                    {post.readTime && (
                       <div className="flex items-center gap-1">
                        <span className="text-gray-300">|</span>
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-light transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-brand-light/10 text-brand-dark flex items-center justify-center text-xs font-bold">
                         {post.author.avatar.charAt(0)}
                       </div>
                       <span className="text-xs text-gray-500 font-medium">{post.author.name}</span>
                    </div>
                    <span className="inline-flex items-center text-sm text-brand-dark font-bold group-hover:text-brand-light transition-colors">
                      記事を読む <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
