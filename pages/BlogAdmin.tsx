import React, { useMemo, useState } from 'react';
import { Pencil, PlusCircle, Save, Trash2 } from 'lucide-react';
import AdminGate from '../components/AdminGate';
import { useDataContext } from '../components/DataContext';
import { BlogPost } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

type BlogFormState = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string;
  imageUrl: string;
  readTime: string;
};

const defaultFormState: BlogFormState = {
  title: '',
  category: '基礎知識',
  excerpt: '',
  content: '',
  tags: '',
  imageUrl: 'https://picsum.photos/id/180/800/450',
  readTime: '5分',
};

const BlogAdmin: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, removeBlogPost } = useDataContext();
  const [form, setForm] = useState<BlogFormState>(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const parseGeneratedJson = (text: string) => {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as {
      title: string;
      excerpt: string;
      content: string;
      tags?: string[];
      readTime?: string;
      category?: string;
      imageUrl?: string;
    };
  };

  const generateWithGemini = async () => {
    if (!keywords.trim()) {
      setError('キーワードを入力してください。');
      return;
    }

    if (!GEMINI_API_KEY) {
      setError('Gemini APIキーが設定されていません。.env.local に VITE_GEMINI_API_KEY を設定してください。');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = `あなたはAI自動化に詳しい日本語ブログの編集者です。以下のキーワードを軸に、読者に価値ある記事の下書きをJSON形式で作成してください。\n\n- キーワード: ${keywords}\n- トンマナ: 明るく、具体例を入れながら専門性を保つ\n- カテゴリは「基礎知識」「実践テクニック」「ツール活用」から最適なものを選択\n- 結果は次のJSONで返してください。\n{\n  "title": "タイトル",\n  "excerpt": "リード文",\n  "content": "見出し付きの本文(約600-800文字)",\n  "tags": ["#タグ1", "#タグ2"],\n  "readTime": "5分",\n  "category": "カテゴリ",\n  "imageUrl": "https://..."\n}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

      const generated = parseGeneratedJson(text);
      setForm((prev) => ({
        ...prev,
        title: generated.title || prev.title,
        excerpt: generated.excerpt || prev.excerpt,
        content: generated.content || prev.content,
        tags: generated.tags?.join(', ') || prev.tags,
        readTime: generated.readTime || prev.readTime,
        category: generated.category || prev.category,
        imageUrl: generated.imageUrl || prev.imageUrl,
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
      imageUrl: form.imageUrl || 'https://picsum.photos/id/180/800/450',
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

  return (
    <AdminGate title="ブログ管理" description="記事の作成・編集・削除が行えます。">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            {editingId ? <Pencil className="text-brand-dark" /> : <PlusCircle className="text-brand-dark" />}
            <h2 className="text-xl font-bold text-gray-900">{editingId ? '記事を編集' : '新規記事を追加'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
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
              <p className="text-xs text-gray-600 mt-2">
                キーワードを入力すると Gemini がタイトル・リード文・本文・タグを提案し、フォームに自動で反映します。
              </p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メイン画像URL</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
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

        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
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

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">記事一覧</h3>
            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-100 rounded-lg p-3 flex items-start justify-between gap-3 bg-gray-50"
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{post.category} ・ {post.date}</p>
                    <p className="font-semibold text-gray-900 leading-tight">{post.title}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <button
                      onClick={() => handleEdit(post)}
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
      </div>
    </AdminGate>
  );
};

export default BlogAdmin;
