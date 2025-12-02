# Supabase テーブル作成手順

このプロジェクトは Supabase の REST API を使ってブログ記事と問い合わせを保存します。
テーブルが存在しない場合はアプリが `Could not find the table` と表示します。以下の手順を**Supabase ダッシュボード上で手動実行**すれば準備完了です。
SQL を流すだけなのでアプリ側のコード修正は不要です。

## 1. プロジェクトの SQL Editor を開く
- Supabase ダッシュボードにログイン
- 対象プロジェクトを開き、左メニューの **SQL Editor** を選択
- 「新しいクエリ」をクリックして空のクエリエディタを開く

## 2. テーブル作成 SQL を実行
1. 下記 SQL をそのまま貼り付けて **実行** をクリックします。
2. 成功メッセージが出ればテーブル作成完了です。

```sql
-- ブログ記事テーブル (環境変数 VITE_SUPABASE_BLOG_TABLE を変更した場合はそちらの名前を使用)
create table if not exists public.blog_posts (
  id uuid primary key,
  title text,
  excerpt text,
  content text,
  category text,
  tags text[],
  author_name text,
  author_avatar text,
  date timestamptz,
  read_time text,
  image_url text
);

-- 問い合わせテーブル (環境変数 VITE_SUPABASE_CONTACT_TABLE を変更した場合はそちらの名前を使用)
create table if not exists public.contact_submissions (
  id uuid primary key,
  name text,
  email text,
  topic text,
  message text,
  created_at timestamptz default now(),
  status text
);
```

> **補足:** スキーマを `public` 以外に変えている場合は、`public.` 部分を使いたいスキーマ名に置き換えてください。

## 3. RLS/ポリシーの設定
- **Table editor > 対象テーブル > Authentication** で RLS を無効化するか、`anon` ロールが読み書きできるポリシーを追加してください。
- 例: `Enable read access for anon`, `Enable insert/update access for anon` ポリシーを作成。

## 4. アプリの環境変数を確認
- スキーマを変更している場合は `VITE_SUPABASE_SCHEMA` を設定します (デフォルト `public`)
- テーブル名を変更している場合は `VITE_SUPABASE_BLOG_TABLE` と `VITE_SUPABASE_CONTACT_TABLE` を設定します
- プロジェクト URL (`VITE_SUPABASE_URL`) と anon キー (`VITE_SUPABASE_ANON_KEY`) が Supabase ダッシュボードの **Project Settings > API** と一致していることを確認します

以上を実行した後にアプリを再読み込みすると、Supabase 側でデータの読み書きが行われます。レコードが作成されたか確認したい場合は **Table editor** で対象テーブルを開き、データが増えているかを確認してください。
