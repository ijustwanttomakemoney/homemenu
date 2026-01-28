import { sql } from "@vercel/postgres";

export type DishRow = {
  id: string;
  title: string;
  note: string | null;
  photo_url: string;
  created_at: string;
  tags: string[] | null;
};

export async function listDishes(): Promise<DishRow[]> {
  const { rows } = await sql<DishRow>`
    select id, title, note, photo_url, created_at,
      coalesce(tags, '[]'::jsonb) as tags
    from dishes
    order by created_at desc;
  `;
  return rows;
}

export async function insertDish(input: {
  title: string;
  note?: string;
  photoUrl: string;
  tags?: string[];
}) {
  const tagsJson = input.tags?.length ? JSON.stringify(input.tags) : null;
  const { rows } = await sql<DishRow>`
    insert into dishes (title, note, photo_url, tags)
    values (
      ${input.title},
      ${input.note ?? null},
      ${input.photoUrl},
      ${tagsJson}::jsonb
    )
    returning id, title, note, photo_url, created_at, tags;
  `;
  return rows[0];
}

export async function deleteDish(id: string) {
  await sql`delete from dishes where id = ${id};`;
}
