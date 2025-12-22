import React from 'react';
import { ArrowRight } from 'lucide-react';

const BlogList: React.FC = () => {
  const htmlPostFiles = [
    {
      file: "upload_contents_App_Google_AI_Studio_Build.html",
      title: "Google AI Studioの「Build」機能でアプリ作成！初心者でもノーコードで開発・公開する方法を徹底解説",
      image: "images/sec000_report_001.jpg",
    },
    {
      file: "upload_contents_Defference_GPT1.5Image_NanoBanana.html",
      title: "GPT-Image-1.5 vs Nano Banana 徹底比較！画像生成AIの選び方と使い分けガイド",
      image: "images/sec000_report_001.jpg",
    },
    {
      file: "upload_contents_Defference_GoogleAIStudio_GeminiOpal.html",
      title: "Google AI StudioとGemini Opalの違いを徹底比較！初心者に最適なツールの選び方",
      image: "images/sec000_photo_3.png",
    },
    {
      file: "upload_contents_Elon_Macrohard.html",
      title: "イーロン・マスクが仕掛ける「Macrohard（マクロハード）」とは？マイクロソフトへの挑戦とAI革命の全貌",
      image: "images/sec000_realistic_photo_5.png",
    },
    {
      file: "upload_contents_Elon_space_newest.html",
      title: "イーロン・マスクの宇宙事業最前線：SpaceXの最新動向と2026年IPOへの展望",
      image: "images/upload_contents_Elon_space_newest_realistic_photo_1.png",
    },
    {
      file: "upload_contents_Elon_sunpower_newest.html",
      title: "イーロン・マスクが「核融合は不要」と主張する真意とは？太陽光発電が最適解とされる理由を徹底解説",
      image: "images/upload_contents_Elon_sunpower_newest_sec001_realistic_photo_2.png",
    },
    {
      file: "upload_contents_defference_gemini3_chatgpt5.html",
      title: "Gemini 3.0 Pro vs ChatGPT 5.2 徹底比較！2025年最強AIはどっち？仕事で役立つ選び方を解説",
      image: "images/sec000_photo_2.png",
    },
    {
      file: "upload_contents_miniapp_function_on_gems.html",
      title: "GeminiのGemsで「ミニアプリ」が作成可能に！新機能Opalの使い方と活用術を徹底解説",
      image: "images/sec000_photo_3.png",
    },
    {
      file: "upload_contents_what_gemini_3_flash.html",
      title: "「Gemini 3.0 Flashで何ができる？」徹底解説！進化点・使い方・活用事例まとめ",
      image: "images/sec000_report_003.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HTML Blog Links */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">HTMLブログ記事一覧</h1>
              <p className="text-gray-500 mt-2">
                公開済みのHTML記事はこちらからご覧いただけます。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {htmlPostFiles.map((post) => (
              <a
                key={post.file}
                href={`${import.meta.env.BASE_URL}blog/posts/${post.file}`}
                className="group border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all overflow-hidden"
                target="_blank"
                rel="noreferrer"
              >
                <div className="h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}blog/posts/${post.image}`}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-2">HTML</div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-light transition-colors">
                    {post.title}
                  </h3>
                  <div className="mt-4 inline-flex items-center text-sm text-brand-dark font-semibold">
                    記事を開く <ArrowRight className="ml-2" size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
