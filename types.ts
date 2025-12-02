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