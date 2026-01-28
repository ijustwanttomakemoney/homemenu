"use server";

import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { deleteDish, insertDish } from "@/lib/db";

function requireEnv(name: string) {
  if (!process.env[name]) {
    throw new Error(
      `${name} is not set. Add Vercel Postgres + Vercel Blob to this project and redeploy.`
    );
  }
}

export async function createDish(formData: FormData) {
  requireEnv("POSTGRES_URL");
  requireEnv("BLOB_READ_WRITE_TOKEN");

  const title = String(formData.get("title") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const tagsText = String(formData.get("tags") ?? "").trim();
  const file = formData.get("photo") as File | null;

  if (!title) throw new Error("Title is required.");
  if (!file || file.size === 0) throw new Error("Photo is required.");

  const tags = tagsText
    ? tagsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const ext = file.name.split(".").pop() || "jpg";
  const key = `dishes/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });

  await insertDish({
    title,
    note: note || undefined,
    photoUrl: blob.url,
    tags,
  });

  revalidatePath("/");
}

export async function removeDishAction(id: string) {
  requireEnv("POSTGRES_URL");
  await deleteDish(id);
  revalidatePath("/");
}
