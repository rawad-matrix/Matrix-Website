/**
 * migrate-level-constraint.ts
 * Drops the old courses_level_check constraint (Beginner/Intermediate/Advanced)
 * and replaces it with the new one (Basic/Pro/Advanced/All).
 *
 * Usage:
 *   npx tsx src/lib/migrate-level-constraint.ts
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY!

const SQL = `
  ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_level_check;
  ALTER TABLE courses ADD CONSTRAINT courses_level_check
    CHECK (level IN ('Basic', 'Pro', 'Advanced', 'All'));
`

async function migrate() {
  // Supabase exposes a /pg/sql endpoint for admin SQL execution (service role required)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ command: SQL }),
  })

  if (res.ok) {
    console.log('✅ Constraint updated via RPC.')
    return
  }

  // Fallback: try the Supabase SQL REST endpoint
  const res2 = await fetch(`${SUPABASE_URL}/pg/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/sql',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: SQL,
  })

  if (res2.ok) {
    console.log('✅ Constraint updated via /pg/sql.')
    return
  }

  // Neither endpoint worked — print manual instructions
  console.log(`
❌ Could not run DDL automatically.

Please run the following SQL in your Supabase dashboard:
  Dashboard → SQL Editor → New query → paste → Run

─────────────────────────────────────────────────────────
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_level_check;
ALTER TABLE courses ADD CONSTRAINT courses_level_check
  CHECK (level IN ('Basic', 'Pro', 'Advanced', 'All'));
─────────────────────────────────────────────────────────

After running the SQL, re-run the seed:
  npx tsx src/lib/seed-courses.ts
`)
}

migrate().catch(console.error)
