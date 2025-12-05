export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string; // Optional context
  content: string;
  avatarInitials: string;
}

export interface SolutionStep {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Challenge {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  requestType: '無料体験' | 'システム依頼';
  topic: string;
  message: string;
  createdAt: string;
  status: '未対応' | '対応済み';
}