/*
  # Update Materials RLS Policies

  1. Changes
    - Drop existing materials policies
    - Add new policies for public access to approved materials
    - Add policies for creators to manage their materials
    - Add policies for moderators to manage all materials

  2. Security
    - Enable public read access to approved materials
    - Maintain creator access to their own materials
    - Add moderator access for content moderation
*/

-- Drop existing materials policies
DROP POLICY IF EXISTS "Published materials are viewable by subscribers" ON materials;
DROP POLICY IF EXISTS "Creators can view their own materials" ON materials;
DROP POLICY IF EXISTS "Creators can insert their own materials" ON materials;

-- Create new policies
CREATE POLICY "Anyone can view approved materials"
ON materials FOR SELECT
USING (
  moderation_status = 'approved' OR
  (auth.uid() IS NOT NULL AND creator_id = auth.uid()) OR
  (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type IN ('moderator', 'admin')
    )
  )
);

CREATE POLICY "Creators can insert their own materials"
ON materials FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND user_type = 'creator'
  )
);

CREATE POLICY "Creators can update their own materials"
ON materials FOR UPDATE
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Moderators can update any material"
ON materials FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND user_type IN ('moderator', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND user_type IN ('moderator', 'admin')
  )
);