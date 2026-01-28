import type { Dish } from "@/lib/types";

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dish.imageDataUrl}
          alt={dish.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
            {dish.title}
          </h3>
          <span className="shrink-0 text-xs text-neutral-400">
            {new Date(dish.createdAt).toLocaleDateString()}
          </span>
        </div>
        {dish.note ? (
          <p className="mt-2 line-clamp-2 text-xs text-neutral-600">{dish.note}</p>
        ) : null}
        {dish.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dish.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] text-neutral-700"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
