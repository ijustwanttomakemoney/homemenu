import type { Dish } from "@/lib/types";
import { seedDishes } from "@/lib/seed";

const KEY = "homemenu.dishes.v1";
const SEEDED_KEY = "homemenu.seeded.v1";

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

  const dishes = safeParse(window.localStorage.getItem(KEY));

  // Seed demo content once for first-time users.
  if (dishes.length === 0 && !window.localStorage.getItem(SEEDED_KEY)) {
    const seeded = seedDishes();
    window.localStorage.setItem(KEY, JSON.stringify(seeded));
    window.localStorage.setItem(SEEDED_KEY, "1");
    return seeded;
  }

  return dishes;
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
