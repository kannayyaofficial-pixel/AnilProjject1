/*
# Create tasks table for TaskFlow board

1. New Tables
- `tasks`: stores task cards for the collaborative kanban board
  - `id` (uuid, primary key)
  - `title` (text, not null) — task title
  - `description` (text, default '') — optional task details
  - `status` (text, not null, default 'todo') — one of: todo, in-progress, done
  - `priority` (text, not null, default 'medium') — one of: low, medium, high
  - `assignee` (text, default 'Unassigned') — person assigned to the task
  - `sort_order` (bigint, default epoch ms) — sort order within column
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `tasks`.
- Single-tenant app with no sign-in; all CRUD allowed for anon + authenticated.
- Four separate policies: SELECT, INSERT, UPDATE, DELETE.

3. Notes
- No user_id column — no auth flow in this app.
- `sort_order` uses epoch milliseconds at creation time for default sort.
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assignee text NOT NULL DEFAULT 'Unassigned',
  sort_order bigint NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tasks" ON tasks;
CREATE POLICY "anon_select_tasks" ON tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tasks" ON tasks;
CREATE POLICY "anon_insert_tasks" ON tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tasks" ON tasks;
CREATE POLICY "anon_update_tasks" ON tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tasks" ON tasks;
CREATE POLICY "anon_delete_tasks" ON tasks FOR DELETE
  TO anon, authenticated USING (true);
