import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CHALLENGES, SOLUTIONS, TESTIMONIALS } from '../constants';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to ContactSection if navigated with state
  useEffect(() => {
    if (location.state && location.state.scrollToContact) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        setTimeout(() => {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  // Handler for scrolling to contact form from within the page
  const scrollToContact = (type: 'trial' | 'development' = 'trial') => {
    // If we are already on Home, we can scroll. But if we need to set state (like inquiry type),
    // it's cleaner to replace state so ContactSection picks it up, or just use context.
    // For simplicity, we navigate to self with state to trigger the useEffect in ContactSection/Home
    navigate('/', { state: { scrollToContact: true, type } });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-dark">
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://picsum.photos/id/180/1920/1080" 
            alt="Background" 
            className="w-full h-full object-cover"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-dark/60 z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 tracking-tight">
              AI自動化で、<br />
              あなたの業務時間を<br />
              <span className="text-brand-accent">50%削減</span>しませんか？
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-200 font-bold mb-6">
              実践的な学習で、明日から使えるスキルを
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl">
              プログラミング不要。実務で使えるAI自動化を3ヶ月でマスター
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToContact('trial')}
                className="bg-brand-accent hover:bg-teal-400 text-brand-dark font-bold py-4 px-8 rounded-full text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                無料体験を始める <ArrowRight size={20} />
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-brand-dark text-white font-bold py-4 px-8 rounded-full text-lg transition-all">
                資料をダウンロード
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="inline-block border border-gray-400 rounded-full px-4 py-1 text-xs font-semibold tracking-wider text-gray-600 uppercase mb-4">
              Your Challenges
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              こんな課題、<br />抱えていませんか？
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {CHALLENGES.map((challenge) => (
              <div key={challenge.id} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border-l-4 border-red-400 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative z-10">
                    <div className="text-sm font-bold text-gray-400 mb-2">{challenge.number}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{challenge.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{challenge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gray-500 font-semibold tracking-widest text-sm uppercase">Our Solution</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
              3ステップで実現する<br />AI業務自動化
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              プログラミング経験不要。実務に即したカリキュラムで、確実にスキルを習得できます
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SOLUTIONS.map((item, index) => (
              <div key={index} className={`rounded-3xl overflow-hidden border border-gray-100 shadow-xl ${index === 0 ? 'bg-brand-dark text-white' : 'bg-white text-gray-900'}`}>
                {index === 0 ? (
                  // Dark Card (First one)
                  <div className="h-full flex flex-col p-8">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl">
                      {item.step}
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-auto">
                      {item.description}
                    </p>
                  </div>
                ) : (
                  // Image Cards (2nd and 3rd)
                  <div className="h-full flex flex-col">
                    <div className="relative h-48">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-gray-900/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {item.title}
                        </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                             {item.description}
                        </p>
                        <div className="mt-auto">
                            {/* Visual placeholder for charts/stats in the card */}
                             {index === 2 && (
                                <div className="flex gap-2">
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">75%</div>
                                    <div className="h-12 flex-1 bg-gray-50 rounded-lg"></div>
                                </div>
                             )}
                        </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="inline-block border border-gray-300 rounded-full px-4 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
              Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              受講生の声から見る<br />学習効果
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      t.id === 't1' ? 'bg-teal-600' : 
                      t.id === 't2' ? 'bg-emerald-600' :
                      t.id === 't3' ? 'bg-cyan-600' :
                      t.id === 't4' ? 'bg-teal-500' :
                      t.id === 't5' ? 'bg-emerald-500' : 'bg-cyan-500'
                  }`}>
                    {t.avatarInitials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  {t.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Service Section */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-top translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="inline-block text-brand-accent font-bold tracking-wider uppercase mb-4 text-sm">
                Development Service
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                自社での導入が難しい場合は、<br />
                <span className="text-brand-accent">プロに開発をお任せ</span>ください
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                「学習する時間がない」「すぐに自動化を実現したい」という企業様向けに、AI自動化システムの受託開発も行っています。
                ヒアリングから設計、実装、運用まで、専任のエンジニアがフルサポートします。
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center mt-1">
                    <CheckCircle2 size={16} className="text-brand-dark" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold">完全オーダーメイド開発</h4>
                    <p className="text-gray-400 mt-1">御社の業務フローに合わせた最適な自動化システムを構築します。</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center mt-1">
                    <CheckCircle2 size={16} className="text-brand-dark" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold">既存システムとの連携</h4>
                    <p className="text-gray-400 mt-1">現在お使いのチャットツールやデータベースとのシームレスな連携が可能です。</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => scrollToContact('development')}
                className="bg-white text-brand-dark hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 inline-flex items-center gap-2"
              >
                開発の無料相談はこちら <ArrowRight size={20} />
              </button>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img 
                    src="https://picsum.photos/id/60/800/600" 
                    alt="Development Team" 
                    className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Overlay card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                      <div className="flex justify-between items-end">
                          <div>
                              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Success Case</div>
                              <div className="text-white font-bold text-lg">大手物流企業様</div>
                              <div className="text-brand-accent text-sm">受注処理自動化システム</div>
                          </div>
                          <div className="text-right">
                              <div className="text-3xl font-bold text-white">80%</div>
                              <div className="text-gray-400 text-xs">工数削減</div>
                          </div>
                      </div>
                  </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-10 -right-10 w-24 h-24 bg-brand-accent/20 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            今すぐ無料体験で<br />
            AI自動化の第一歩を
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            7日間の無料トライアルで、すべての学習コンテンツにアクセス可能
          </p>
          <button 
            onClick={() => scrollToContact('trial')}
            className="bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl transition-transform transform hover:scale-105 inline-flex items-center gap-3 mx-auto"
          >
             無料体験を始める <ArrowRight />
          </button>

          <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl relative">
              <img src="https://picsum.photos/id/4/1200/600" alt="Platform Dashboard" className="w-full h-auto opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Embedded Contact Section */}
      <ContactSection id="contact" />
    </div>
  );
};

export default Home;