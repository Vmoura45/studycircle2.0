/*
  # Initial Schema Setup for Education Sharing Platform

  1. New Tables
    - `profiles`
      - Extends Supabase auth with user profile information
      - Stores user type and additional details
    
    - `categories`
      - Stores content categories
      - Hierarchical structure for better organization
    
    - `materials`
      - Stores educational materials
      - Links to creator and category
      - Includes moderation status
    
    - `subscriptions`
      - Tracks user subscriptions
      - Manages access control
    
    - `transactions`
      - Records payment history
      - Tracks creator earnings

  2. Security
    - RLS enabled on all tables
    - Specific policies for each user type
    - Content visibility based on subscription status

  3. Enums
    - User types
    - Material types
    - Moderation status
*/

-- Enums
CREATE TYPE user_type AS ENUM ('creator', 'consumer', 'moderator', 'admin');
CREATE TYPE material_type AS ENUM ('image', 'text', 'lesson_plan');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  user_type user_type NOT NULL DEFAULT 'consumer',
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Materials table
CREATE TABLE materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content text,
  material_type material_type NOT NULL,
  category_id uuid REFERENCES categories(id) NOT NULL,
  creator_id uuid REFERENCES profiles(id) NOT NULL,
  moderation_status moderation_status DEFAULT 'pending',
  moderated_by uuid REFERENCES profiles(id),
  moderation_note text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  material_id uuid REFERENCES materials(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  creator_earnings decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Materials policies
CREATE POLICY "Published materials are viewable by subscribers"
  ON materials FOR SELECT
  USING (
    moderation_status = 'approved' AND
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE user_id = auth.uid()
      AND current_period_end > now()
    )
  );

CREATE POLICY "Creators can view their own materials"
  ON materials FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can insert their own materials"
  ON materials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'creator'
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION calculate_creator_earnings(price decimal)
RETURNS decimal AS $$
BEGIN
  -- Creator gets 70% of the price
  RETURN price * 0.7;
END;
$$ LANGUAGE plpgsql;