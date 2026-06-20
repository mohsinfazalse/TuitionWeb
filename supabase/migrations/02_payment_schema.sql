/* supabase/migrations/02_payment_schema.sql */
-- Migration: Add payment_methods table for future payment gateway integration
CREATE TYPE payment_method AS ENUM ('jazzcash', 'easypaisa');

CREATE TABLE payment_methods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  amount numeric NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security for payment_methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Policies: Users can manage their own payment records
CREATE POLICY "users can manage own payments" ON payment_methods
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admin can read all
CREATE POLICY "admin can read all payments" ON payment_methods
  FOR SELECT TO public USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
