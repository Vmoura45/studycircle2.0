/*
  # Add version control for materials

  1. New Tables
    - `material_versions`
      - `id` (uuid, primary key)
      - `material_id` (uuid, references materials)
      - `version` (integer)
      - `content` (text)
      - `changes` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `material_versions` table
    - Add policies for creators and moderators
*/

-- Create material versions table
CREATE TABLE material_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES materials(id) NOT NULL,
  version integer NOT NULL,
  content text NOT NULL,
  changes text NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint for material_id and version
CREATE UNIQUE INDEX material_versions_material_id_version_idx 
ON material_versions (material_id, version);

-- Enable RLS
ALTER TABLE material_versions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Creators can view their material versions"
ON material_versions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM materials
    WHERE materials.id = material_versions.material_id
    AND materials.creator_id = auth.uid()
  )
);

CREATE POLICY "Creators can create versions"
ON material_versions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM materials
    WHERE materials.id = material_versions.material_id
    AND materials.creator_id = auth.uid()
  )
);

CREATE POLICY "Moderators can view all versions"
ON material_versions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type IN ('moderator', 'admin')
  )
);