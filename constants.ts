import { BlogPost, Challenge, SolutionStep, Testimonial } from "./types";

export const CATEGORIES = ["すべて", "基礎知識", "実践テクニック", "ツール活用"];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "9450c6a0-d0a9-4c0e-9a5f-7b5f23f83750",
    title: "AI自動化の基礎：初心者が知っておくべき5つのポイント",
    excerpt: "AI自動化を始める前に理解しておくべき基本的な概念と、実践に役立つ5つの重要なポイントを解説します。プログラミング経験がなくても大丈夫です。",
    content: "AI技術の急速な発展により、業務自動化の可能性は日々広がっています。しかし、多くの企業や個人が「どこから始めればいいのか分からない」という課題に直面しています。...",
    category: "基礎知識",
    tags: ["#AI基礎", "#初心者向け", "#自動化入門"],
    author: { name: "山田 太郎", avatar: "YT" },
    date: "2025-01-15",
    readTime: "5分",
    imageUrl: "https://picsum.photos/id/48/800/450",
  },
  {
    id: "e7fe9113-8ed1-4bc3-8e66-7f156170e732",
    title: "ChatGPTを使った業務効率化の実践例10選",
    excerpt: "実際の業務でChatGPTをどのように活用できるのか、具体的な事例を10個紹介します。明日からすぐに使える実践的なテクニックが満載です。",
    content: "ChatGPTは単なるチャットボットではありません。メールの作成、要約、翻訳、アイデア出しなど、多岐にわたる業務をサポートする強力なアシスタントです...",
    category: "実践テクニック",
    tags: ["#ChatGPT", "#業務効率化", "#実践例"],
    author: { name: "佐藤 美咲", avatar: "SM" },
    date: "2025-01-12",
    readTime: "8分",
    imageUrl: "https://picsum.photos/id/3/800/450",
  },
  {
    id: "a39ea2f5-0552-4da1-b9cd-88f9d193d2e2",
    title: "プロンプトエンジニアリング完全ガイド",
    excerpt: "AIから最高の結果を引き出すためのプロンプト作成術を徹底解説。効果的なプロンプトの書き方から、よくある失敗例まで網羅的に紹介します。",
    content: "プロンプトエンジニアリングは、AI時代における必須スキルの一つです。意図した通りの回答を得るためには、指示の出し方にコツがあります...",
    category: "実践テクニック",
    tags: ["#プロンプト", "#AI活用", "#上級テクニック"],
    author: { name: "鈴木 大輔", avatar: "SD" },
    date: "2025-01-10",
    readTime: "10分",
    imageUrl: "https://picsum.photos/id/60/800/450",
  },
  {
    id: "a912542c-8308-4488-8bf9-c134521d8760",
    title: "Excel作業を自動化する5つの方法",
    excerpt: "データ入力、集計、レポート作成など、Excelの定型作業をAIで自動化する具体的な方法を紹介します。毎日の作業時間を大幅に削減できます。",
    content: "Excelはビジネスの現場で欠かせないツールですが、手作業での入力や集計は多くの時間を消費します。AIツールと連携させることで...",
    category: "ツール活用",
    tags: ["#Excel", "#自動化", "#データ処理"],
    author: { name: "高橋 誠", avatar: "TM" },
    date: "2025-01-08",
    readTime: "7分",
    imageUrl: "https://picsum.photos/id/180/800/450",
  },
  {
    id: "81780d47-75b4-495c-b4d3-2a790b8853db",
    title: "メール対応を効率化するAI活用術",
    excerpt: "毎日のメール対応に時間を取られていませんか？AIを使ってメールの下書き作成、返信、整理を自動化する方法を詳しく解説します。",
    content: "メール対応は業務の中でも特に時間を取られがちなタスクです。AIを活用することで、定型的な返信を自動化したり、重要なメールを優先的に表示させたり...",
    category: "ツール活用",
    tags: ["#メール", "#業務効率化", "#コミュニケーション"],
    author: { name: "伊藤 麻衣", avatar: "IM" },
    date: "2025-01-05",
    readTime: "6分",
    imageUrl: "https://picsum.photos/id/119/800/450",
  },
  {
    id: "55d5448b-4726-454f-a60e-5033b64f6757",
    title: "AI自動化で失敗しないための3つの注意点",
    excerpt: "AI自動化を導入する際によくある失敗パターンと、それを避けるための具体的な対策を紹介します。成功率を高めるための必読記事です。",
    content: "AI自動化は万能ではありません。導入の目的が曖昧だったり、現場の理解が得られていなかったりすると、期待した効果が得られないことがあります...",
    category: "基礎知識",
    tags: ["#失敗回避", "#ベストプラクティス", "#導入ガイド"],
    author: { name: "田中 健太", avatar: "TK" },
    date: "2025-01-03",
    readTime: "5分",
    imageUrl: "https://picsum.photos/id/20/800/450",
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    number: "01",
    title: "毎日の定型業務に時間を取られる",
    description: "データ入力、レポート作成、メール対応など、繰り返しの作業に多くの時間を費やしていませんか？本来の創造的な業務に集中できない状況が続いています。"
  },
  {
    id: "c2",
    number: "02",
    title: "AI活用したいが何から始めればいいか分からない",
    description: "ChatGPTなどのAIツールは知っているけれど、実際の業務にどう活用すればいいのか分からない。プログラミングの知識がないため、導入のハードルが高いと感じています。"
  },
  {
    id: "c3",
    number: "03",
    title: "業務効率化のノウハウが社内に蓄積されない",
    description: "個人レベルでの工夫はあっても、組織全体で業務効率化のノウハウが共有されず、同じような非効率な作業が繰り返されています。"
  }
];

export const SOLUTIONS: SolutionStep[] = [
  {
    step: "01",
    title: "基礎学習",
    description: "AIツールの基本的な使い方から、プロンプトエンジニアリングの基礎まで、初心者でも安心して学べるカリキュラムです。",
    imageUrl: "https://picsum.photos/id/1/400/300"
  },
  {
    step: "02",
    title: "実務シミュレーション",
    description: "実際の業務シーンを想定した演習問題に取り組みます。メール自動生成やデータ分析など、即戦力となるスキルを養います。",
    imageUrl: "https://picsum.photos/id/6/400/300"
  },
  {
    step: "03",
    title: "自動化実装",
    description: "学んだスキルを実際の業務に適用。専門家のサポートを受けながら、あなたの業務を自動化します。",
    imageUrl: "https://picsum.photos/id/42/400/300"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "田中 健太",
    role: "営業マネージャー",
    content: "「毎日2時間かかっていた営業レポート作成が、AIで15分に短縮されました。空いた時間で顧客対応に集中できるようになり、売上も20%向上しました。」",
    avatarInitials: "田"
  },
  {
    id: "t2",
    name: "佐藤 美咲",
    role: "人事担当",
    content: "「プログラミング経験ゼロでしたが、3ヶ月で採用業務の大部分を自動化できました。応募者データの整理や面接日程調整が自動化され、戦略的な採用活動に時間を使えるようになりました。」",
    avatarInitials: "佐"
  },
  {
    id: "t3",
    name: "鈴木 大輔",
    role: "マーケティング",
    content: "「SNS投稿の作成、データ分析、レポート作成をAIで自動化。週に10時間以上の時間を創出でき、新しい施策の企画に集中できています。」",
    avatarInitials: "鈴"
  },
  {
    id: "t4",
    name: "山田 愛子",
    role: "経理担当",
    content: "「請求書処理や経費精算の自動化により、月末の残業がほぼゼロになりました。ミスも減り、業務の質も向上しています。」",
    avatarInitials: "山"
  },
  {
    id: "t5",
    name: "高橋 誠",
    role: "カスタマーサポート",
    content: "「よくある質問への回答をAIで自動化したことで、より複雑な問い合わせに時間を割けるようになりました。顧客満足度も15%向上しました。」",
    avatarInitials: "高"
  },
  {
    id: "t6",
    name: "伊藤 麻衣",
    role: "プロジェクトマネージャー",
    content: "「会議の議事録作成、タスク管理、進捗レポートの作成を自動化。チームの生産性が大幅に向上し、プロジェクトの成功率も上がりました。」",
    avatarInitials: "伊"
  }
];