import { listDishes } from "@/lib/db";
import HomeClient from "./ui/home-client";

export default async function Page() {
  let dishes = [] as Awaited<ReturnType<typeof listDishes>>;
  let error: string | null = null;

  try {
    dishes = await listDishes();
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Failed to load dishes";
  }

  return (
    <main className="min-h-dvh bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <HomeClient initialDishes={dishes} serverError={error} />
      </div>
    </main>
  );
}
