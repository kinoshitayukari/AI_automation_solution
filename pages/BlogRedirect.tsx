import React from 'react';

const BlogRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.href = `${import.meta.env.BASE_URL}blog/posts/`;
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900">ブログ一覧へ移動しています...</p>
        <p className="text-sm text-gray-500 mt-2">
          自動で移動しない場合は
          <a
            className="text-brand-dark underline ml-1"
            href={`${import.meta.env.BASE_URL}blog/posts/`}
          >
            こちらをクリック
          </a>
          してください。
        </p>
      </div>
    </div>
  );
};

export default BlogRedirect;
