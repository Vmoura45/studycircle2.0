/*
  # Add sample categories

  1. New Data
    - Adds initial categories for educational materials
    
  2. Changes
    - Creates unique constraint on category name
    - Inserts initial categories
*/

-- First add a unique constraint on the name column
ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);

-- Then insert the categories
INSERT INTO categories (name, description) VALUES
  ('Mathematics', 'Math resources including algebra, geometry, and calculus'),
  ('Science', 'Science materials covering physics, chemistry, and biology'),
  ('Language Arts', 'Resources for reading, writing, and literature'),
  ('Social Studies', 'History, geography, and social sciences materials'),
  ('Arts & Music', 'Creative arts, music theory, and artistic resources')
ON CONFLICT (name) DO NOTHING;