
export interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  benefits: string[];
  imageUrl: string;
}
