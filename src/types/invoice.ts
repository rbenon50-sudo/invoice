export type Currency = 'CAD' | 'USD' | 'BDT' | 'CNY';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type FeeType = 'filing' | 'search' | 'examination' | 'maintenance' | 'professional';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address: string;
  patent_number: string;
  patent_title: string;
  currency: Currency;
  total_amount: number;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceFee {
  id: string;
  invoice_id: string;
  fee_description: string;
  fee_type: FeeType;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
}

export interface InvoiceWithFees extends Invoice {
  fees: InvoiceFee[];
}

export interface CreateInvoiceData {
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address: string;
  patent_number: string;
  patent_title: string;
  currency: Currency;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  notes?: string;
}

export interface CreateFeeData {
  fee_description: string;
  fee_type: FeeType;
  quantity: number;
  unit_price: number;
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CAD: 'CA$',
  USD: '$',
  BDT: '৳',
  CNY: '¥',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  CAD: 'Canadian Dollar',
  USD: 'US Dollar',
  BDT: 'Bangladeshi Taka',
  CNY: 'Chinese Yuan',
};
