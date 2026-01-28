// Legacy local-only type kept for reference; server storage uses DishRow in lib/db.ts
export type Dish = {
  id: string;
  title: string;
  note?: string;
  imageDataUrl: string;
  createdAt: string;
  tags?: string[];
};
