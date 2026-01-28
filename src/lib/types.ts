export type Dish = {
  id: string;
  title: string;
  note?: string;
  imageDataUrl: string; // required for V1
  createdAt: string; // ISO
  tags?: string[];
};
