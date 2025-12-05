import React, { useMemo, useRef, useState } from 'react';
import { Pencil, PlusCircle, Save, Trash2 } from 'lucide-react';
import AdminGate from '../components/AdminGate';
import { useDataContext } from '../components/DataContext';
import { BlogPost } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

type ResearchResult = {
  source: string;
  url: string;
  headings: string[];
};

type OutlineSection = {
  title: string;
  points: string[];
};

type StepOutput = {
  research?: ResearchResult[];
  outline?: OutlineSection[];
  draft?: {
    title: string;
    excerpt: string;
    markdown: string;
  };
  html?: string;
};

type BlogFormState = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string;
  imageUrl: string;
  eyeCatchUrl: string;
  inlineImages: string;
  readTime: string;
};

const defaultFormState: BlogFormState = {
  title: '',
  category: '基礎知識',
  excerpt: '',
  content: '',
  tags: '',
  imageUrl: 'https://picsum.photos/id/180/800/450',
  eyeCatchUrl: 'https://picsum.photos/id/180/1200/630',
  inlineImages: '',
  readTime: '5分',
};

const BlogAdmin: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, removeBlogPost } = useDataContext();
  const [form, setForm] = useState<BlogFormState>(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [keywords, setKeywords] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(GEMINI_API_KEY || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepOutput, setStepOutput] = useState<StepOutput>({});
  const [contentView, setContentView] = useState<'html' | 'preview'>('preview');
  const [activePanel, setActivePanel] = useState<'form' | 'list'>('form');
  const previewRef = useRef<HTMLDivElement | null>(null);

  const handleContentUpdate = (content: string) => {
    setForm((prev) => ({ ...prev, content }));
  };

  const handlePreviewInput = () => {
    const nextContent = previewRef.current?.innerHTML ?? '';
    handleContentUpdate(nextContent);
  };

  const extractJson = <T,>(text: string): T => {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as T;
  };

  const callGemini = async (model: string, prompt: string) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Gemini APIの呼び出しに失敗しました。');
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;

    if (!text) {
      throw new Error('Gemini APIから有効な応答が得られませんでした。');
    }

    return text;
  };

  const generateWithGemini = async () => {
    if (!keywords.trim()) {
      setError('キーワードを入力してください。');
      return;
    }

    if (!geminiApiKey) {
      setError('Gemini APIキーが設定されていません。画面の入力欄か .env.local の VITE_GEMINI_API_KEY に設定してください。');
      return;
    }

    setIsGenerating(true);
    setError('');
    setStepOutput({});

    try {
      const researchPrompt = `あなたはSEOとリサーチに長けた日本語編集者です。入力キーワードをもとに、日本語の関連トピックを扱う10サイトを想定し、各サイトの主要見出しを整理してください。必ずJSONのみを返し、次の形式を厳守してください。\n\nキーワード: ${keywords}\n\n返却形式:\n{\n  "sites": [\n    {"source": "サイト名", "url": "https://example.com", "headings": ["見出し1", "見出し2"]},\n    ...合計10サイト...\n  ]\n}\n\n箇条書きや前置きは不要で、10サイトすべて日本語でユニークにしてください。`;

      const researchText = await callGemini('gemini-2.0-flash', researchPrompt);
      const researchJson = extractJson<{ sites: ResearchResult[] }>(researchText);
      setStepOutput((prev) => ({ ...prev, research: researchJson.sites }));

      const outlinePrompt = `以下のリサーチ結果から、すべての見出し要素を含めた包括的なアウトラインを作成してください。最終的に記事化しやすいように章立てを整理し、JSONだけで返してください。\n\nリサーチ結果: ${JSON.stringify(
        researchJson.sites
      )}\n\n返却形式:\n{\n  "outline": [\n    {"title": "セクションタイトル", "points": ["含める要素", "詳細ポイント"]}\n  ]\n}\n\nモデルはGemini 2.5 Flashとして応答し、日本語で出力してください。`;

      const outlineText = await callGemini('gemini-2.5-flash', outlinePrompt);
      const outlineJson = extractJson<{ outline: OutlineSection[] }>(outlineText);
      setStepOutput((prev) => ({ ...prev, outline: outlineJson.outline }));

      const draftPrompt = `あなたは日本語ブログのプロ編集者です。以下のアウトラインをすべて網羅し、読者が理解しやすい流れで本文をMarkdownで作成してください。タイトルとリード文も含めてJSONのみを返してください。\n\nアウトライン: ${JSON.stringify(
        outlineJson.outline
      )}\nキーワード: ${keywords}\n\n返却形式:\n{\n  "title": "キャッチーなタイトル",\n  "excerpt": "120文字程度のリード文",\n  "articleMarkdown": "# 見出し...本文(約1200-1600文字)"\n}\n\n文章はGemini 2.5 Flashとして生成し、日本語で丁寧かつ具体的に書いてください。`;

      const draftText = await callGemini('gemini-2.5-flash', draftPrompt);
      const draftJson = extractJson<{ title: string; excerpt: string; articleMarkdown: string }>(draftText);
      setStepOutput((prev) => ({
        ...prev,
        draft: { title: draftJson.title, excerpt: draftJson.excerpt, markdown: draftJson.articleMarkdown },
      }));

      const htmlPrompt = `次のMarkdown本文を、ブログに貼り付けられるクリーンなHTMLに変換してください。見出しはh2/h3を使用し、リストや強調も適切にタグ化してください。JSONのみで返してください。\n\nタイトル: ${draftJson.title}\nリード文: ${draftJson.excerpt}\nMarkdown: ${draftJson.articleMarkdown}\n\n返却形式:\n{\n  "html": "<article>...生成されたHTML...</article>"\n}`;

      const htmlText = await callGemini('gemini-2.5-flash', htmlPrompt);
      const htmlJson = extractJson<{ html: string }>(htmlText);
      setStepOutput((prev) => ({ ...prev, html: htmlJson.html }));

      setForm((prev) => ({
        ...prev,
        title: draftJson.title || prev.title,
        excerpt: draftJson.excerpt || prev.excerpt,
        content: htmlJson.html || draftJson.articleMarkdown || prev.content,
        tags: prev.tags || '#AI, #自動化',
        category: prev.category || '基礎知識',
        readTime: prev.readTime || '7分',
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成中にエラーが発生しました。';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      setError('記事の必須項目を入力してください。');
      return;
    }

    const basePost: BlogPost = {
      id: editingId ?? crypto.randomUUID(),
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: { name: '管理者', avatar: 'AD' },
      date: editingId
        ? blogPosts.find((post) => post.id === editingId)?.date || new Date().toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      readTime: form.readTime || '5分',
      imageUrl: form.imageUrl || form.eyeCatchUrl || 'https://picsum.photos/id/180/800/450',
      eyeCatchUrl: form.eyeCatchUrl || form.imageUrl || 'https://picsum.photos/id/180/1200/630',
      inlineImages: form.inlineImages
        .split(/\n|,/)
        .map((line) => line.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await updateBlogPost(editingId, basePost);
    } else {
      await addBlogPost(basePost);
    }

    setForm(defaultFormState);
    setEditingId(null);
    setError('');
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      imageUrl: post.imageUrl,
      eyeCatchUrl: post.eyeCatchUrl || post.imageUrl,
      inlineImages: (post.inlineImages || []).join('\n'),
      readTime: post.readTime,
    });
    setEditingId(post.id);
    setError('');
  };

  const handleRemove = async (id: string) => {
    const target = blogPosts.find((post) => post.id === id);
    if (target && window.confirm(`「${target.title}」を本当に削除しますか？`)) {
      await removeBlogPost(id);
      if (editingId === id) {
        setForm(defaultFormState);
        setEditingId(null);
      }
    }
  };

  const stats = useMemo(() => {
    const categories = blogPosts.reduce<Record<string, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {});
    return categories;
  }, [blogPosts]);

  const inlineImageList = useMemo(
    () =>
      form.inlineImages
        .split(/\n|,/)
        .map((line) => line.trim())
        .filter(Boolean),
    [form.inlineImages]
  );

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsDataURL(file);
    });

  const handleEyeCatchUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, eyeCatchUrl: dataUrl, imageUrl: dataUrl }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '画像のアップロードに失敗しました。');
    }
  };

  const handleInlineImagesUpload = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => readFileAsDataUrl(file)));
      const merged = [...inlineImageList, ...uploads];
      setForm((prev) => ({ ...prev, inlineImages: merged.join('\n') }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '本文画像のアップロードに失敗しました。');
    }
  };

  const insertImageIntoContent = (url: string) => {
    const snippet = `<figure style="margin:1.5rem 0;text-align:center"><img src="${url}" alt="ブログ画像" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.08)"/><figcaption style="font-size:0.9rem;color:#4b5563;margin-top:0.5rem">画像の説明をここに記載</figcaption></figure>`;
    setForm((prev) => ({ ...prev, content: prev.content ? `${prev.content}\n${snippet}` : snippet }));
    setContentView('preview');
  };

  return (
    <AdminGate title="ブログ管理" description="記事の作成・編集・削除が行えます。">
      <style>
        {`
          .blog-preview h2 {
            font-size: 1.25rem;
            font-weight: 800;
            color: #0f292f;
            padding: 0.35rem 0.75rem;
            background: linear-gradient(90deg, rgba(92, 203, 186, 0.18), rgba(15, 41, 47, 0.06));
            border-left: 6px solid #0f292f;
            border-radius: 0.75rem;
            margin-top: 1rem;
          }

          .blog-preview h3 {
            font-size: 1.05rem;
            font-weight: 700;
            color: #1a4c54;
            margin-top: 0.75rem;
            padding-bottom: 0.25rem;
            border-bottom: 2px dashed rgba(26, 76, 84, 0.3);
          }

          .blog-preview p,
          .blog-preview li {
            line-height: 1.8;
            color: #1f2937;
          }

          .blog-preview ul {
            list-style: disc;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
            display: grid;
            gap: 0.35rem;
          }

          .blog-preview strong {
            color: #0f292f;
            font-weight: 800;
            background: linear-gradient(180deg, rgba(92, 203, 186, 0.35), rgba(92, 203, 186, 0));
            padding: 0 0.15rem;
          }

          .blog-preview blockquote {
            border-left: 4px solid #5ccbba;
            padding-left: 1rem;
            color: #0f292f;
            background: rgba(92, 203, 186, 0.08);
            border-radius: 0.75rem;
          }
        `}
      </style>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-dark font-bold">Blog Admin</p>
            <h2 className="text-2xl font-bold text-gray-900">記事作成と一覧をワンタップで切替</h2>
            <p className="text-sm text-gray-600">画像アップロード、本文プレビュー、生成支援を1画面で完結できます。</p>
          </div>
          <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 text-sm font-bold border border-gray-200">
            <button
              type="button"
              onClick={() => setActivePanel('form')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activePanel === 'form' ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-700 hover:text-brand-dark'
              }`}
            >
              ✏️ 記事作成 / 編集
            </button>
            <button
              type="button"
              onClick={() => setActivePanel('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activePanel === 'list' ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-700 hover:text-brand-dark'
              }`}
            >
              📚 記事一覧 / 進行状況
            </button>
          </div>
        </div>

        {activePanel === 'form' ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              {editingId ? <Pencil className="text-brand-dark" /> : <PlusCircle className="text-brand-dark" />}
              <h2 className="text-xl font-bold text-gray-900">{editingId ? '記事を編集' : '新規記事を追加'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:items-center md:gap-4">
                <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">キーワードからAI下書きを生成</label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="例: AI自動化 ブログ運用 スケーリング"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateWithGemini}
                    disabled={isGenerating}
                    className="whitespace-nowrap px-4 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-brand-dark to-brand-accent shadow-sm disabled:opacity-70"
                  >
                    {isGenerating ? '生成中...' : 'AIで下書きを作成'}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gemini APIキー</label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value.trim())}
                    placeholder="入力または .env.local の値を使用"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                キーワードを入力すると Gemini が4ステップでリサーチ・アウトライン・本文・HTMLを順番に生成し、結果が下に表示されます。APIキーはこの画面にのみ保持されます。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">ステップ1: 10サイトのリサーチ (Gemini 2.0 Flash)</h4>
                  {isGenerating && !stepOutput.research && <span className="text-xs text-brand-dark">実行中...</span>}
                </div>
                {stepOutput.research ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto text-sm text-gray-700">
                    {stepOutput.research.map((site, index) => (
                      <div key={`${site.url}-${index}`} className="border border-gray-100 rounded-lg p-2">
                        <p className="font-semibold text-gray-900">{site.source}</p>
                        <p className="text-xs text-gray-500 break-all">{site.url}</p>
                        <ul className="list-disc list-inside text-gray-700 mt-1">
                          {site.headings.map((heading, idx) => (
                            <li key={idx}>{heading}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">キーワード入力後に実行すると、10サイト分の見出しが表示されます。</p>
                )}
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">ステップ2: 包括アウトライン (Gemini 2.5 Flash)</h4>
                  {isGenerating && stepOutput.research && !stepOutput.outline && (
                    <span className="text-xs text-brand-dark">実行中...</span>
                  )}
                </div>
                {stepOutput.outline ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto text-sm text-gray-700">
                    {stepOutput.outline.map((section, index) => (
                      <div key={`${section.title}-${index}`} className="border border-gray-100 rounded-lg p-2">
                        <p className="font-semibold text-gray-900">{section.title}</p>
                        <ul className="list-disc list-inside text-gray-700 mt-1">
                          {section.points.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">ステップ1の見出しをまとめたアウトラインがここに表示されます。</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">ステップ3: 本文ドラフト (Gemini 2.5 Flash)</h4>
                  {isGenerating && stepOutput.outline && !stepOutput.draft && (
                    <span className="text-xs text-brand-dark">実行中...</span>
                  )}
                </div>
                {stepOutput.draft ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">{stepOutput.draft.title}</p>
                    <p className="text-gray-700">{stepOutput.draft.excerpt}</p>
                    <pre className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs whitespace-pre-wrap">
                      {stepOutput.draft.markdown}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">アウトラインを反映したMarkdown本文がここに表示されます。</p>
                )}
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">ステップ4: HTML化 (Gemini 2.5 Flash)</h4>
                  {isGenerating && stepOutput.draft && !stepOutput.html && (
                    <span className="text-xs text-brand-dark">実行中...</span>
                  )}
                </div>
                {stepOutput.html ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto text-sm text-gray-700">
                    <pre className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs whitespace-pre-wrap">
                      {stepOutput.html}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">最終的なHTMLがここに表示され、本文欄にも反映されます。</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <option value="基礎知識">基礎知識</option>
                  <option value="実践テクニック">実践テクニック</option>
                  <option value="ツール活用">ツール活用</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タグ (カンマ区切り)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="#AI, #自動化"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">読了時間</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="5分"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">リード文</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                rows={2}
              />
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">本文 / HTML</p>
                  <p className="text-xs text-gray-600">HTMLを直接編集するか、装飾プレビューを見ながら内容を整えられます。</p>
                </div>
                <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => setContentView('preview')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      contentView === 'preview'
                        ? 'bg-brand-dark text-white shadow-sm'
                        : 'text-gray-700 hover:text-brand-dark'
                    }`}
                  >
                    プレビュー
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentView('html')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      contentView === 'html'
                        ? 'bg-brand-dark text-white shadow-sm'
                        : 'text-gray-700 hover:text-brand-dark'
                    }`}
                  >
                    HTML
                  </button>
                </div>
              </div>

              {contentView === 'html' ? (
                <textarea
                  value={form.content}
                  onChange={(e) => handleContentUpdate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono text-sm"
                  rows={10}
                  placeholder="<h2>大見出し</h2>\n<p>本文...</p>"
                />
              ) : (
                <div
                  ref={previewRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handlePreviewInput}
                  className="blog-preview border border-brand-dark/10 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-inner min-h-[240px]"
                  dangerouslySetInnerHTML={{
                    __html:
                      form.content ||
                      '<h2>大見出しの例</h2><p>ここに本文が入ります。プレビュー上でもテキストを直接編集できます。</p><h3>小見出しの例</h3><p>箇条書きや強調なども編集可能です。</p>',
                  }}
                />
              )}
              <p className="text-xs text-gray-600 flex items-center gap-2">
                HTMLとプレビューは双方向に連動します。プレビュー上で見出しや本文を直接修正すると、HTMLにも即時反映されます。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">アイキャッチ画像</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.eyeCatchUrl}
                    onChange={(e) =>
                      setForm({ ...form, eyeCatchUrl: e.target.value, imageUrl: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="URL または下のアップロードを利用"
                  />
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-600 cursor-pointer hover:border-brand-accent hover:text-brand-dark transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleEyeCatchUpload(e.target.files?.[0])}
                    />
                    <span className="font-semibold">ローカル画像をアップロード</span>
                    <span className="text-xs text-gray-500">1200x630 程度を推奨</span>
                  </label>
                  {form.eyeCatchUrl && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={form.eyeCatchUrl} alt="アイキャッチ" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">URLかローカル画像を選択できます。アップロードした画像はそのまま記事一覧や本文のトップに使われます。</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">本文内画像</label>
                <div className="space-y-2">
                  <textarea
                    value={form.inlineImages}
                    onChange={(e) => setForm({ ...form, inlineImages: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    rows={3}
                    placeholder={`https://example.com/image1.jpg\nhttps://example.com/image2.jpg`}
                  />
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-600 cursor-pointer hover:border-brand-accent hover:text-brand-dark transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleInlineImagesUpload(e.target.files)}
                    />
                    <span className="font-semibold">ローカル画像を追加（複数可）</span>
                    <span className="text-xs text-gray-500">アップロードで本文候補にも追加されます</span>
                  </label>
                  {inlineImageList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {inlineImageList.map((url, idx) => (
                        <div key={`${url}-${idx}`} className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
                          <img src={url} alt="本文画像" className="w-full h-28 object-cover" />
                          <div className="px-3 py-2 space-y-1">
                            <p className="text-xs text-gray-600 break-all leading-tight">{url.slice(0, 80)}{url.length > 80 ? '...' : ''}</p>
                            <button
                              type="button"
                              onClick={() => insertImageIntoContent(url)}
                              className="w-full text-xs font-bold text-brand-dark border border-brand-dark/30 rounded-md py-1 hover:bg-brand-dark hover:text-white transition-colors"
                            >
                              本文へ挿入
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">URL入力でもアップロードでもOK。下の「本文へ挿入」でプレビューに直接配置できます。</p>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="bg-brand-dark text-white px-5 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-900 transition-colors"
              >
                {editingId ? (
                  <>
                    <Save size={18} /> 保存する
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} /> 記事を追加する
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(defaultFormState);
                    setError('');
                  }}
                  className="px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-white"
                >
                  新規作成モードに戻る
                </button>
              )}
            </div>
          </form>
        </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 h-fit">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">カテゴリ別記事数</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {Object.entries(stats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span>{category}</span>
                    <span className="font-bold">{count}件</span>
                  </div>
                ))}
                {blogPosts.length === 0 && <p className="text-gray-500">まだ記事がありません。</p>}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">記事一覧</h3>
                <p className="text-xs text-gray-500">クリックで即編集できます。</p>
              </div>
              <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-100 rounded-lg p-3 flex items-start justify-between gap-3 bg-gray-50"
                  >
                    <div className="flex gap-3">
                      <img
                        src={post.eyeCatchUrl || post.imageUrl}
                        alt={post.title}
                        className="w-20 h-16 object-cover rounded-md border border-gray-100"
                      />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{post.category} ・ {post.date}</p>
                        <p className="font-semibold text-gray-900 leading-tight">{post.title}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => {
                          handleEdit(post);
                          setActivePanel('form');
                        }}
                        className="text-brand-dark hover:underline flex items-center gap-1"
                      >
                        <Pencil size={16} /> 編集
                      </button>
                      <button
                        onClick={() => handleRemove(post.id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={16} /> 削除
                      </button>
                    </div>
                  </div>
                ))}
                {blogPosts.length === 0 && <p className="text-sm text-gray-500">まだ記事がありません。</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGate>
  );
};

export default BlogAdmin;
