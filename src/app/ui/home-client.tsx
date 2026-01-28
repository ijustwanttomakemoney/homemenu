"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dish } from "@/lib/types";
import { loadDishes, removeDish, saveDishes } from "@/lib/dishes";
import { DishCard } from "@/components/DishCard";
import { AddDishModal } from "@/components/AddDishModal";

export default function HomeClient() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDishes(loadDishes());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dishes;
    return dishes.filter((d) => {
      const hay = [d.title, d.note ?? "", ...(d.tags ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [dishes, query]);

  function onDelete(id: string) {
    removeDish(id);
    setDishes(loadDishes());
  }

  function clearAll() {
    if (!confirm("Clear all dishes? This only affects your local browser.")) return;
    saveDishes([]);
    setDishes([]);
  }

  return (
    <>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Home Menu
          </h1>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-[min(420px,90vw)] rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Add dish
            </button>
            {dishes.length ? (
              <button
                onClick={clearAll}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm text-neutral-700">
              No dishes yet. Click <span className="font-medium">Add dish</span> to
              create your first entry.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Note: this version stores everything locally in your browser.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((dish) => (
              <div key={dish.id} className="group relative">
                <DishCard dish={dish} />
                <button
                  onClick={() => onDelete(dish.id)}
                  className="absolute right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-xs text-neutral-700 shadow-sm backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100 sm:opacity-0"
                  aria-label={`Delete ${dish.title}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <AddDishModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(dish) => setDishes((prev) => [dish, ...prev])}
      />
    </>
  );
}
