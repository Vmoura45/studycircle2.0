/*
  # Fix Profiles RLS Policies

  1. Changes
    - Add policy to allow profile creation during sign up
    - Add policy to allow profile updates by the owner
    - Add policy to allow profile reads by authenticated users

  2. Security
    - Maintains RLS on profiles table
    - Ensures users can only modify their own profiles
    - Allows profile creation during authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users creating their profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for authenticated users" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);