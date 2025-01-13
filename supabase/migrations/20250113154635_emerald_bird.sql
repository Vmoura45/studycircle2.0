/*
  # Update Materials Visibility

  1. Changes
    - Drop existing materials policies
    - Add new policy to make materials visible by default
    - Keep creator and moderator policies

  2. Security
    - Allow public read access to all materials
    - Maintain creator access for their own materials
    - Maintain moderator access for content moderation
*/

-- Drop existing materials policies
DROP POLICY IF EXISTS "Anyone can view approved materials" ON materials;

-- Create new policies for public visibility
CREATE POLICY "Materials are viewable by everyone"
ON materials FOR SELECT
USING (true);