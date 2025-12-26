import { supabase } from '../lib/supabase';
import type { Invoice, InvoiceFee, InvoiceWithFees, CreateInvoiceData, CreateFeeData } from '../types/invoice';

export const invoiceService = {
  async getAllInvoices(): Promise<InvoiceWithFees[]> {
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (invoicesError) throw invoicesError;
    if (!invoices) return [];

    const invoicesWithFees: InvoiceWithFees[] = await Promise.all(
      invoices.map(async (invoice) => {
        const { data: fees } = await supabase
          .from('invoice_fees')
          .select('*')
          .eq('invoice_id', invoice.id)
          .order('created_at', { ascending: true });

        return {
          ...invoice,
          fees: fees || [],
        };
      })
    );

    return invoicesWithFees;
  },

  async getInvoiceById(id: string): Promise<InvoiceWithFees | null> {
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (invoiceError) throw invoiceError;
    if (!invoice) return null;

    const { data: fees } = await supabase
      .from('invoice_fees')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('created_at', { ascending: true });

    return {
      ...invoice,
      fees: fees || [],
    };
  },

  async createInvoice(invoiceData: CreateInvoiceData, fees: CreateFeeData[]): Promise<Invoice> {
    const totalAmount = fees.reduce((sum, fee) => sum + (fee.quantity * fee.unit_price), 0);

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{ ...invoiceData, total_amount: totalAmount }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    if (fees.length > 0) {
      const feesWithInvoiceId = fees.map((fee) => ({
        invoice_id: invoice.id,
        ...fee,
        amount: fee.quantity * fee.unit_price,
      }));

      const { error: feesError } = await supabase
        .from('invoice_fees')
        .insert(feesWithInvoiceId);

      if (feesError) throw feesError;
    }

    return invoice;
  },

  async updateInvoice(id: string, invoiceData: Partial<CreateInvoiceData>, fees?: CreateFeeData[]): Promise<Invoice> {
    if (fees) {
      await supabase.from('invoice_fees').delete().eq('invoice_id', id);

      const totalAmount = fees.reduce((sum, fee) => sum + (fee.quantity * fee.unit_price), 0);

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .update({ ...invoiceData, total_amount: totalAmount, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      if (fees.length > 0) {
        const feesWithInvoiceId = fees.map((fee) => ({
          invoice_id: id,
          ...fee,
          amount: fee.quantity * fee.unit_price,
        }));

        const { error: feesError } = await supabase
          .from('invoice_fees')
          .insert(feesWithInvoiceId);

        if (feesError) throw feesError;
      }

      return invoice;
    } else {
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .update({ ...invoiceData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (invoiceError) throw invoiceError;
      return invoice;
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  },

  async updateInvoiceStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },
};
