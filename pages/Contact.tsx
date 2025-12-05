import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    type: 'trial', // Default to trial
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Set initial inquiry type based on navigation state (if passed from buttons)
  useEffect(() => {
    if (location.state && location.state.type) {
      setFormData(prev => ({ ...prev, type: location.state.type }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">お問い合わせありがとうございます</h2>
          <p className="text-gray-600 mb-8">
            内容を確認の上、担当者より24時間以内にご連絡させていただきます。<br />
            自動返信メールをお送りしましたのでご確認ください。
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors"
          >
            トップページへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">お問い合わせ・無料体験</h1>
          <p className="text-gray-600">
            無料体験のお申し込み、システム開発のご相談など、<br className="hidden md:block" />
            お気軽にお問い合わせください。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Inquiry Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-bold text-gray-700 mb-2">
                お問い合わせ種別 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-4 focus:border-brand-accent focus:ring-brand-accent appearance-none"
                  required
                >
                  <option value="trial">無料体験に申し込む</option>
                  <option value="development">システム開発の相談</option>
                  <option value="other">その他のお問い合わせ</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-4 focus:border-brand-accent focus:ring-brand-accent outline-none transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@company.com"
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-4 focus:border-brand-accent focus:ring-brand-accent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-bold text-gray-700 mb-2">
                会社名 <span className="text-gray-400 font-normal">(任意)</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="株式会社〇〇"
                className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-4 focus:border-brand-accent focus:ring-brand-accent outline-none transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                お問い合わせ内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="ご質問やご要望をご記入ください..."
                className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-4 focus:border-brand-accent focus:ring-brand-accent outline-none transition-all"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-[1.01] flex items-center justify-center gap-2 text-lg"
              >
                送信する <Send size={20} />
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            お客様の個人情報は、<a href="#" className="underline hover:text-brand-dark">プライバシーポリシー</a>に基づいて厳重に管理されます。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;