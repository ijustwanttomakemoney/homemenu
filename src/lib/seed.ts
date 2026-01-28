import type { Dish } from "@/lib/types";

function svgDataUrl(label: string, bg = "#f5f5f5") {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <rect x="60" y="60" width="1080" height="555" rx="32" fill="#ffffff" stroke="#e5e7eb"/>
  <text x="120" y="220" font-family="Inter, ui-sans-serif, system-ui" font-size="56" fill="#111827" font-weight="600">${label}</text>
  <text x="120" y="300" font-family="Inter, ui-sans-serif, system-ui" font-size="28" fill="#6b7280">Demo dish (replace with your photo)</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function seedDishes(): Dish[] {
  const now = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };

  return [
    {
      id: "demo-1",
      title: "Spicy Tomato Pasta",
      note: "Quick weeknight dish. Add burrata if you want to impress.",
      tags: ["Italian", "Spicy"],
      imageDataUrl: svgDataUrl("Spicy Tomato Pasta", "#ffe4e6"),
      createdAt: daysAgo(2),
    },
    {
      id: "demo-2",
      title: "Chicken & Veggie Stir-fry",
      note: "Soy + ginger + garlic. Serve with rice.",
      tags: ["Asian", "High-protein"],
      imageDataUrl: svgDataUrl("Chicken Stir-fry", "#dcfce7"),
      createdAt: daysAgo(6),
    },
    {
      id: "demo-3",
      title: "Miso Salmon Bowl",
      note: "Miso glaze, cucumber, and sesame. Very easy.",
      tags: ["Fish", "Healthy"],
      imageDataUrl: svgDataUrl("Miso Salmon Bowl", "#dbeafe"),
      createdAt: daysAgo(10),
    },
  ];
}
