export type Plan = {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  latitude: number;
  longitude: number;
  visited: boolean;
  imageUrl?: string;
  difficulty?: string;
  distance?: string;
  stops?: string[];
  tips?: string[];
  calendlyUrl?: string;
};

export type Memory = {
  id: string;
  planId?: string;
  imageUrl: string;
  caption: string;
  date: string;
};
