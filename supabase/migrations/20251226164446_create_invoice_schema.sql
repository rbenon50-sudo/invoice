/*
  # Patent Invoice Management System

  ## Overview
  Creates a complete schema for managing patent invoices with multiple currencies and fee structures.

  ## New Tables
  
  ### `invoices`
  Main invoice table storing invoice header information
  - `id` (uuid, primary key) - Unique identifier for each invoice
  - `invoice_number` (text, unique) - Human-readable invoice number
  - `client_name` (text) - Name of the client
  - `client_email` (text) - Client's email address
  - `client_address` (text) - Client's physical address
  - `patent_number` (text) - Patent reference number
  - `patent_title` (text) - Title of the patent
  - `currency` (text) - Payment currency (CAD, USD, BDT, CNY)
  - `total_amount` (decimal) - Total invoice amount
  - `issue_date` (date) - Date invoice was issued
  - `due_date` (date) - Payment due date
  - `status` (text) - Invoice status (draft, sent, paid, overdue)
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `invoice_fees`
  Stores individual fee line items for each invoice
  - `id` (uuid, primary key) - Unique identifier
  - `invoice_id` (uuid, foreign key) - References invoices table
  - `fee_description` (text) - Description of the fee
  - `fee_type` (text) - Type of fee (filing, search, examination, maintenance, professional)
  - `quantity` (decimal) - Quantity or hours
  - `unit_price` (decimal) - Price per unit
  - `amount` (decimal) - Total amount for this fee line
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public access for demonstration (in production, restrict to authenticated users)

  ## Notes
  1. Currency codes follow ISO 4217 standard
  2. All monetary amounts use decimal type for precision
  3. Fees are linked to invoices via foreign key with cascade delete
*/

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_address text NOT NULL,
  patent_number text NOT NULL,
  patent_title text NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  total_amount decimal(12, 2) NOT NULL DEFAULT 0,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice_fees table
CREATE TABLE IF NOT EXISTS invoice_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  fee_description text NOT NULL,
  fee_type text NOT NULL,
  quantity decimal(10, 2) NOT NULL DEFAULT 1,
  unit_price decimal(12, 2) NOT NULL,
  amount decimal(12, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoice_fees_invoice_id ON invoice_fees(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_currency ON invoices(currency);

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_fees ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demonstration)
-- In production, these should be restricted to authenticated users

CREATE POLICY "Allow public read access to invoices"
  ON invoices FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to invoices"
  ON invoices FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to invoices"
  ON invoices FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to invoices"
  ON invoices FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to invoice_fees"
  ON invoice_fees FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to invoice_fees"
  ON invoice_fees FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to invoice_fees"
  ON invoice_fees FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to invoice_fees"
  ON invoice_fees FOR DELETE
  TO public
  USING (true);