import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHALLENGES, SOLUTIONS, TESTIMONIALS } from '../constants';

const Home: React.FC = () => {

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
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
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
      <section className="py-24 bg-gray-50" id="courses">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="inline-block border border-gray-400 rounded-full px-4 py-1 text-xs font-semibold tracking-wider text-gray-600 uppercase mb-4">
              Your Challenges
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              こんな課題、<br />抱えていませんか？
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CHALLENGES.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={challenge.imageUrl} 
                      alt={challenge.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl font-bold text-gray-200">{challenge.number}</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{challenge.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm flex-grow">{challenge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-white" id="service">
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
      <section className="py-24 bg-gray-50" id="cases">
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
                  <img src={t.avatarUrl} alt={t.name} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100" />
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

      {/* Contact Section */}
      <section className="py-24 bg-white" id="contact">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <span className="text-sm font-bold text-brand-dark uppercase tracking-widest">Contact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">お問い合わせ</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              学習コースや法人導入についてのご相談など、お気軽にご連絡ください。以下のフォームより受け付けております。
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-light" size={18} /> 24時間以内に担当者よりご連絡します。</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-light" size={18} /> 体験版のご案内やデモのご予約も可能です。</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-light" size={18} /> オンラインで完結、最短3分で送信。</li>
            </ul>
          </div>
          <div className="lg:col-span-3 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col items-center justify-center">
             <iframe 
               src="https://docs.google.com/forms/d/e/1FAIpQLSe9bgQ3zYfhjEnNkPPiBnSfsDKs8GfbfVYo-ba9R5Zp1i-EYw/viewform?embedded=true" 
               width="100%" 
               height="800" 
               frameBorder="0" 
               marginHeight={0} 
               marginWidth={0}
               title="Contact Form"
               className="bg-white"
             >
               読み込んでいます…
             </iframe>
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
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl transition-transform transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
             無料体験を始める <ArrowRight />
          </button>

          <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl relative">
              <img src="images/cta-dashboard.png" alt="AI Automation Platform Dashboard" className="w-full h-auto opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;