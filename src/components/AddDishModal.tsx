"use client";

import { useMemo, useState } from "react";
import type { Dish } from "@/lib/types";
import { addDish, fileToDataUrl } from "@/lib/dishes";

function uid() {
  // good enough for local-only V1
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AddDishModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (dish: Dish) => void;
}) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tags = useMemo(() => {
    return tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [tagsText]);

  async function submit() {
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    if (!file) return setError("Photo is required.");

    setBusy(true);
    try {
      const imageDataUrl = await fileToDataUrl(file);
      const dish: Dish = {
        id: uid(),
        title: title.trim(),
        note: note.trim() || undefined,
        tags: tags.length ? tags : undefined,
        imageDataUrl,
        createdAt: new Date().toISOString(),
      };
      addDish(dish);
      onCreated(dish);

      // reset
      setTitle("");
      setNote("");
      setTagsText("");
      setFile(null);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/20"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">Add a dish</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block">
            <div className="mb-1 text-xs font-medium text-neutral-700">Title *</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
              placeholder="e.g., Spicy tomato pasta"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-medium text-neutral-700">Photo *</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Stored locally for now (we’ll move to cloud later).
            </p>
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-medium text-neutral-700">Tags (comma separated)</div>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
              placeholder="e.g., Italian, Spicy, Vegan"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-medium text-neutral-700">Notes</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[90px] w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
              placeholder="What you’d tell your friends about it…"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
              disabled={busy}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
              disabled={busy}
            >
              {busy ? "Adding…" : "Add dish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
