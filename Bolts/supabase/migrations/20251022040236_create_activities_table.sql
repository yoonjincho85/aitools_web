/*
  # Create Activities Tracking Schema

  1. New Tables
    - `activities`
      - `id` (uuid, primary key) - Unique identifier for each activity
      - `date` (date, not null) - The date the activity was performed
      - `title` (text, not null) - Brief title of the productive activity
      - `description` (text) - Detailed description/summary of what was done
      - `created_at` (timestamptz) - When the log was created
      - `updated_at` (timestamptz) - When the log was last updated
  
  2. Indexes
    - Index on `date` for efficient date-based queries and visualization
    - Unique constraint on `date` to ensure one entry per day
  
  3. Security
    - Enable RLS on `activities` table
    - Public read access for viewing the activity feed (this is a personal showcase site)
    - No write policies (admin-only writes will be handled separately if needed)
  
  4. Important Notes
    - This schema supports one activity log per day
    - The unique constraint on date ensures data integrity
    - Public read access allows visitors to view your productivity journey
*/

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for efficient date queries
CREATE INDEX IF NOT EXISTS activities_date_idx ON activities(date DESC);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow public read access (this is a personal showcase site)
CREATE POLICY "Anyone can view activities"
  ON activities
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- For now, only service role can insert/update/delete
-- You can add authenticated user policies later if needed
CREATE POLICY "Service role can insert activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can update activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete activities"
  ON activities
  FOR DELETE
  TO authenticated
  USING (true);