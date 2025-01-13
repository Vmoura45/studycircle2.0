/*
  # Create reviews table with attachments

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `material_id` (uuid, foreign key to materials)
      - `user_id` (uuid, foreign key to profiles)
      - `rating` (integer)
      - `comment` (text, optional)
      - `attachments` (text array, for storing file URLs)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to Materials Table
    - Add `avg_rating` column
    - Add `total_reviews` column

  3. Security
    - Enable RLS on reviews table
    - Add policies for authenticated users
*/

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES materials(id) NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  attachments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add review statistics to materials
ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS avg_rating numeric(3,2),
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all reviews"
ON reviews FOR SELECT
TO authenticated
USING (true);

-- Create function to update material statistics
CREATE OR REPLACE FUNCTION update_material_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE materials
    SET 
      avg_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE material_id = NEW.material_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE material_id = NEW.material_id
      )
    WHERE id = NEW.material_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating material statistics
CREATE TRIGGER update_material_review_stats_trigger
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_material_review_stats();