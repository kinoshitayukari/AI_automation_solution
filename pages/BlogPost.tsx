import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Share2, Facebook, Linkedin, ArrowRight } from 'lucide-react';
import { useDataContext } from '../components/DataContext';

const BlogPost: React.FC = () => {
  const { blogPosts } = useDataContext();
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);
  const eyeCatch = post?.eyeCatchUrl || post?.imageUrl;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">記事が見つかりませんでした</h2>
          <Link to="/blog" className="text-brand-dark hover:underline">ブログ一覧に戻る</Link>
        </div>
      </div>
    );
  }

  // Find related posts (simple logic: same category, not current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-8 text-xs text-gray-500">
        <Link to="/" className="hover:text-brand-dark">ホーム</Link> &gt; 
        <Link to="/blog" className="hover:text-brand-dark ml-1">ブログ</Link> &gt; 
        <span className="ml-1 text-gray-800">{post.category}</span>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
            <span className="bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
                {post.title}
            </h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {post.author.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{post.author.name}</span>
                </div>
                <div className="text-gray-400 text-sm">
                    📅 {post.date} &nbsp; <span className="text-gray-300">|</span> &nbsp; 🕒 {post.readTime}
                </div>
            </div>
        </div>

        {/* Featured Image */}
        {eyeCatch && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <img src={eyeCatch} alt={post.title} className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Content Body - Simulating rich text with hardcoded styling for the demo */}
        <div className="prose prose-lg max-w-none text-gray-700">
            
            {/* Lead Block */}
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-accent mb-10">
                <p className="font-medium text-gray-800 m-0">
                    {post.excerpt}
                </p>
            </div>

            <p className="mb-8 leading-relaxed">
                {post.content}
                ここにさらに詳細な本文が続きます。AI技術の進化は、私たちの働き方を根本から変えようとしています。従来、専門的なスキルが必要だったタスクも、AIツールの支援を受けることで、誰でも効率的に実行できるようになりました。
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 pb-2 border-b border-gray-200">
                なぜAI自動化が必要なのか
            </h2>
            <p className="mb-6 leading-relaxed">
                現代のビジネス環境では、スピードと効率性が競争力の鍵となっています。定型的な作業に時間を取られることで、本来注力すべき創造的な業務や戦略的な意思決定に十分な時間を割けないという問題が生じています。
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 pb-2 border-b border-gray-200">
                具体的な活用シーン
            </h2>
            <p className="mb-6 leading-relaxed">
                AI自動化は、データ入力、レポート作成、メール対応、スケジュール管理など、様々な業務に適用できます。特に、繰り返し行われる作業や、一定のルールに基づいて処理できる業務において、大きな効果を発揮します。
            </p>

             <div className="bg-gray-50 p-8 rounded-xl my-8">
                <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                    <span className="text-brand-accent mr-2">💡</span> 実践のポイント
                </h3>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✔</span>
                        <span>小さな業務から始めて、徐々に範囲を広げていく</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✔</span>
                        <span>効果測定を行い、改善を繰り返す</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-500 mr-2">✔</span>
                        <span>チーム全体で知識を共有し、活用を促進する</span>
                    </li>
                </ul>
             </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 pb-2 border-b border-gray-200">
                まとめ
            </h2>
            <p className="leading-relaxed">
                AI自動化は、もはや大企業だけのものではありません。適切な知識とツールがあれば、誰でも業務効率化を実現できます。まずは小さな一歩から始めて、徐々にスキルを磨いていきましょう。
            </p>

            {post.inlineImages && post.inlineImages.length > 0 && (
              <div className="mt-10 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">記事内画像プレビュー</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.inlineImages.map((url) => (
                    <div key={url} className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                      <img src={url} alt={post.title} className="w-full h-auto object-cover" />
                      <p className="text-xs text-gray-600 px-3 py-2 break-all">{url}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 flex items-center space-x-4">
            <span className="text-sm font-bold text-gray-700">この記事をシェア :</span>
            <button className="bg-gray-800 text-white p-2 rounded-full hover:bg-black transition-colors">
                <span className="font-bold text-xs px-1">X</span>
            </button>
            <button className="bg-gray-800 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Facebook size={16} />
            </button>
            <button className="bg-gray-800 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Linkedin size={16} />
            </button>
        </div>

      </article>

      {/* Related Articles Area */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-20 pt-10 border-t border-gray-200 bg-gray-50/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">関連記事</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map(rp => (
                    <Link to={`/blog/${rp.id}`} key={rp.id} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                        <div className="h-40 overflow-hidden">
                             <img src={rp.eyeCatchUrl || rp.imageUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-5">
                            <span className="text-xs text-gray-400 mb-2 block">{rp.date}</span>
                            <h4 className="font-bold text-gray-900 mb-2 group-hover:text-brand-light">{rp.title}</h4>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Mobile Conversion? Maybe too intrusive, let's just do a footer block */}
      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
         <h3 className="text-3xl font-bold mb-4">実践的なスキルを身につける</h3>
         <p className="text-gray-600 mb-8">体系的なカリキュラムで、AI自動化を本格的に学びませんか？</p>
         <button className="bg-brand-dark hover:bg-teal-900 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 mx-auto">
             無料体験を始める <ArrowRight size={18} />
         </button>
      </div>

    </div>
  );
};

export default BlogPost;