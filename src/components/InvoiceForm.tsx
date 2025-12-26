import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { Currency, FeeType, CreateInvoiceData, CreateFeeData } from '../types/invoice';
import { CURRENCY_SYMBOLS, CURRENCY_NAMES } from '../types/invoice';

interface InvoiceFormProps {
  onSubmit: (invoice: CreateInvoiceData, fees: CreateFeeData[]) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    invoice: CreateInvoiceData;
    fees: CreateFeeData[];
  };
}

const currencies: Currency[] = ['CAD', 'USD', 'BDT', 'CNY'];
const feeTypes: { value: FeeType; label: string }[] = [
  { value: 'filing', label: 'Filing Fee' },
  { value: 'search', label: 'Search Fee' },
  { value: 'examination', label: 'Examination Fee' },
  { value: 'maintenance', label: 'Maintenance Fee' },
  { value: 'professional', label: 'Professional Service' },
];

export function InvoiceForm({ onSubmit, onCancel, initialData }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(initialData?.invoice.currency || 'USD');

  const [invoice, setInvoice] = useState<CreateInvoiceData>(
    initialData?.invoice || {
      invoice_number: `INV-${Date.now()}`,
      client_name: '',
      client_email: '',
      client_address: '',
      patent_number: '',
      patent_title: '',
      currency: 'USD',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      notes: '',
    }
  );

  const [fees, setFees] = useState<CreateFeeData[]>(
    initialData?.fees || [
      {
        fee_description: '',
        fee_type: 'professional',
        quantity: 1,
        unit_price: 0,
      },
    ]
  );

  const handleInvoiceChange = (field: keyof CreateInvoiceData, value: string) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    setInvoice((prev) => ({ ...prev, currency }));
  };

  const handleFeeChange = (index: number, field: keyof CreateFeeData, value: string | number) => {
    setFees((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addFee = () => {
    setFees((prev) => [
      ...prev,
      {
        fee_description: '',
        fee_type: 'professional',
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const removeFee = (index: number) => {
    if (fees.length > 1) {
      setFees((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return fees.reduce((sum, fee) => sum + fee.quantity * fee.unit_price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(invoice, fees);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            required
            value={invoice.invoice_number}
            onChange={(e) => handleInvoiceChange('invoice_number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {CURRENCY_SYMBOLS[curr]} - {CURRENCY_NAMES[curr]} ({curr})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            type="text"
            required
            value={invoice.client_name}
            onChange={(e) => handleInvoiceChange('client_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Email
          </label>
          <input
            type="email"
            required
            value={invoice.client_email}
            onChange={(e) => handleInvoiceChange('client_email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Address
          </label>
          <textarea
            required
            value={invoice.client_address}
            onChange={(e) => handleInvoiceChange('client_address', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patent Number
          </label>
          <input
            type="text"
            required
            value={invoice.patent_number}
            onChange={(e) => handleInvoiceChange('patent_number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patent Title
          </label>
          <input
            type="text"
            required
            value={invoice.patent_title}
            onChange={(e) => handleInvoiceChange('patent_title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            required
            value={invoice.issue_date}
            onChange={(e) => handleInvoiceChange('issue_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            required
            value={invoice.due_date}
            onChange={(e) => handleInvoiceChange('due_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={invoice.notes}
            onChange={(e) => handleInvoiceChange('notes', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Fee Items</h3>
          <button
            type="button"
            onClick={addFee}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Fee
          </button>
        </div>

        <div className="space-y-4">
          {fees.map((fee, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={fee.fee_description}
                    onChange={(e) => handleFeeChange(index, 'fee_description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={fee.fee_type}
                    onChange={(e) => handleFeeChange(index, 'fee_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {feeTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={fee.quantity}
                    onChange={(e) => handleFeeChange(index, 'quantity', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={fee.unit_price}
                    onChange={(e) => handleFeeChange(index, 'unit_price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeFee(index)}
                    disabled={fees.length === 1}
                    className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>

                <div className="md:col-span-1 flex items-end">
                  <div className="text-right font-semibold text-gray-900">
                    {CURRENCY_SYMBOLS[selectedCurrency]}
                    {(fee.quantity * fee.unit_price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Total Amount</div>
              <div className="text-3xl font-bold text-gray-900">
                {CURRENCY_SYMBOLS[selectedCurrency]}
                {calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Invoice'}
        </button>
      </div>
    </form>
  );
}
