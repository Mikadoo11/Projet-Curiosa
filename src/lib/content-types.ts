export type Domain = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
};

export type ArticleSource = {
  title: string;
  url: string;
  publisher?: string;
};

export type ArticleSection = {
  heading: string;
  body: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  domain: Pick<Domain, "title" | "slug" | "icon" | "color">;
  readingMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  sections: ArticleSection[];
  keyTakeaways: string[];
  funFact?: string;
  sources: ArticleSource[];
};
