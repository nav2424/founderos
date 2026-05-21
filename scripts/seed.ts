/**
 * Seed Natural Scents sample data for a Supabase user.
 *
 * Usage:
 *   1. Run supabase/schema.sql in Supabase SQL editor
 *   2. Create a user in Supabase Auth (or sign up via app)
 *   3. Set env vars in .env.local (including SUPABASE_SERVICE_ROLE_KEY)
 *   4. SEED_USER_EMAIL=you@email.com npm run seed
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { SEED_BRAND, getSeedData } from "../src/lib/seed-data";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedEmail = process.env.SEED_USER_EMAIL;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!seedEmail) {
  console.error("Set SEED_USER_EMAIL to the auth user email to seed");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: users, error: userError } =
    await supabase.auth.admin.listUsers();

  if (userError) throw userError;

  const user = users.users.find((u) => u.email === seedEmail);
  if (!user) {
    console.error(`No user found with email: ${seedEmail}`);
    process.exit(1);
  }

  const userId = user.id;
  console.log(`Seeding for user ${seedEmail} (${userId})`);

  const seed = getSeedData();
  const { id: _brandId, ...brandRest } = SEED_BRAND;
  const brand = { ...brandRest, user_id: userId };

  const { data: existingBrands } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", userId)
    .eq("name", "Natural Scents")
    .limit(1);

  let brandId = existingBrands?.[0]?.id;

  if (!brandId) {
    const { data: inserted, error } = await supabase
      .from("brands")
      .insert(brand)
      .select("id")
      .single();
    if (error) throw error;
    brandId = inserted.id;
    console.log("Created brand:", brand.name);
  } else {
    console.log("Brand already exists, using id:", brandId);
  }

  const mapBrandId = <T extends { brand_id: string | null; id?: string }>(
    rows: T[]
  ) =>
    rows.map(({ id: _id, ...r }) => ({
      ...r,
      user_id: userId,
      brand_id: r.brand_id ? brandId : null,
    }));

  const tables = [
    { name: "goals", rows: mapBrandId(seed.goals) },
    { name: "tasks", rows: mapBrandId(seed.tasks) },
    { name: "ideas", rows: mapBrandId(seed.ideas) },
    { name: "kpis", rows: mapBrandId(seed.kpis) },
    { name: "reminders", rows: mapBrandId(seed.reminders) },
  ] as const;

  for (const { name, rows } of tables) {
    const { count } = await supabase
      .from(name)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (count && count > 0) {
      console.log(`Skipping ${name} — already has ${count} rows`);
      continue;
    }

    const { error } = await supabase.from(name).insert(rows);
    if (error) throw error;
    console.log(`Inserted ${rows.length} ${name}`);
  }

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
