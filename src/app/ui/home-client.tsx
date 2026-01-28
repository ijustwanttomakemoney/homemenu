"use client";

import { useMemo, useState } from "react";
import type { DishRow } from "@/lib/db";
import { DishCard } from "@/components/DishCard";
import { AddDishModal } from "@/components/AddDishModal";
import { removeDishAction } from "@/app/actions";

export default function HomeClient({
  initialDishes,
  serverError,
}: {
  initialDishes: DishRow[];
  serverError: string | null;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialDishes;
    return initialDishes.filter((d) => {
      const hay = [d.title, d.note ?? "", ...(d.tags ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [initialDishes, query]);

  async function onDelete(id: string) {
    if (!confirm("Delete this dish?") ) return;
    await removeDishAction(id);
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
          </div>
        </div>
      </header>

      <section className="mt-6">
        {serverError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="font-medium">Storage not configured yet</div>
            <div className="mt-1 text-amber-800">{serverError}</div>
            <div className="mt-2 text-amber-800">
              In Vercel: add <span className="font-medium">Postgres</span> + <span className="font-medium">Blob</span> to this project, then redeploy.
            </div>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm text-neutral-700">
              No dishes yet. Click <span className="font-medium">Add dish</span> to
              create your first entry.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((dish) => (
              <div key={dish.id} className="group relative">
                <DishCard dish={dish} />
                <button
                  onClick={() => void onDelete(dish.id)}
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
        onCreated={() => {
          // Server action revalidates the page; user refresh or navigate triggers update.
          // For now, close modal and let the page refresh naturally.
        }}
      />
    </>
  );
}
