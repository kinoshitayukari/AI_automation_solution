import React, { useMemo } from 'react';
import { Inbox } from 'lucide-react';
import AdminGate from '../components/AdminGate';
import { useDataContext } from '../components/DataContext';

const InquiryAdmin: React.FC = () => {
  const { contactSubmissions, updateContactStatus } = useDataContext();

  const stats = useMemo(() => {
    const total = contactSubmissions.length;
    const resolved = contactSubmissions.filter((c) => c.status === '対応済み').length;
    return { total, resolved };
  }, [contactSubmissions]);

  return (
    <AdminGate title="お問い合わせ管理" description="フォームから届いた内容を確認・対応できます。">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">問い合わせ数</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">対応済み</p>
          <p className="text-3xl font-bold text-gray-900">{stats.resolved}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">未対応</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total - stats.resolved}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Inbox className="text-brand-dark" />
          <h2 className="text-xl font-bold text-gray-900">問い合わせ一覧</h2>
        </div>
        {contactSubmissions.length === 0 ? (
          <p className="text-sm text-gray-500">まだ問い合わせは届いていません。</p>
        ) : (
          <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
            {contactSubmissions.map((entry) => (
              <div key={entry.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.email}</p>
                  </div>
                  <select
                    value={entry.status}
                    onChange={async (e) => updateContactStatus(entry.id, e.target.value as any)}
                    className={`text-xs font-semibold rounded-full px-3 py-1 border ${
                      entry.status === '対応済み'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                  >
                    <option value="未対応">未対応</option>
                    <option value="対応済み">対応済み</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mb-2">件名: {entry.topic}</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{entry.message}</p>
                <p className="text-xs text-gray-400 mt-2">受信日時: {new Date(entry.createdAt).toLocaleString('ja-JP')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminGate>
  );
};

export default InquiryAdmin;
