import type { Dish } from "@/lib/types";

const KEY = "homemenu.dishes.v1";

function safeParse(json: string | null): Dish[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return [];
    return data as Dish[];
  } catch {
    return [];
  }
}

export function loadDishes(): Dish[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(KEY));
}

export function saveDishes(dishes: Dish[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(dishes));
}

export function addDish(dish: Dish) {
  const dishes = loadDishes();
  saveDishes([dish, ...dishes]);
}

export function removeDish(id: string) {
  const dishes = loadDishes();
  saveDishes(dishes.filter((d) => d.id !== id));
}

export async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
