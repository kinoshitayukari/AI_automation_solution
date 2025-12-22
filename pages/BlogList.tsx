import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const BlogList: React.FC = () => {
  const htmlPostFiles = [
    { file: "upload_contents_App_Google_AI_Studio_Build.html" },
    { file: "upload_contents_Defference_GPT1.5Image_NanoBanana.html" },
    { file: "upload_contents_Defference_GoogleAIStudio_GeminiOpal.html" },
    { file: "upload_contents_Elon_Macrohard.html" },
    { file: "upload_contents_Elon_space_newest.html" },
    { file: "upload_contents_Elon_sunpower_newest.html" },
    { file: "upload_contents_defference_gemini3_chatgpt5.html" },
    { file: "upload_contents_miniapp_function_on_gems.html" },
    { file: "upload_contents_what_gemini_3_flash.html" },
  ];
  const [htmlPosts, setHtmlPosts] = useState<{ file: string; title: string }[]>(
    htmlPostFiles.map(({ file }) => ({ file, title: file }))
  );

  useEffect(() => {
    let isMounted = true;

    const extractTitle = (html: string, fallback: string) => {
      if (typeof DOMParser !== 'undefined') {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const parsedTitle = doc.querySelector('title')?.textContent?.trim();
        if (parsedTitle) {
          return parsedTitle;
        }
      }
      const match = html.match(/<title>([^<]*)<\/title>/i);
      return match?.[1]?.trim() || fallback;
    };

    const loadHtmlTitles = async () => {
      const results = await Promise.all(
        htmlPostFiles.map(async ({ file }) => {
          const url = `${import.meta.env.BASE_URL}blog/posts/${file}`;
          try {
            const response = await fetch(url);
            if (!response.ok) {
              return { file, title: file };
            }
            const html = await response.text();
            const title = extractTitle(html, file);
            return { file, title };
          } catch (error) {
            return { file, title: file };
          }
        })
      );

      if (isMounted) {
        setHtmlPosts(results);
      }
    };

    loadHtmlTitles();

    return () => {
      isMounted = false;
    };
  }, [htmlPostFiles]);

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
    </div>
  );
};

export default BlogList;
