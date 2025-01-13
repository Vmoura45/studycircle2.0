/*
  # Update Transaction Policies

  1. Changes
    - Drop existing transaction policies
    - Add new policies for transactions table
    
  2. Security
    - Allow authenticated users to insert their own transactions
    - Allow users to view their own transactions
    - Allow creators to view transactions for their materials
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;

-- Create new policies
CREATE POLICY "Users can insert own transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM materials
    WHERE materials.id = transactions.material_id
    AND materials.creator_id = auth.uid()
  )
);