import React from 'react';
import { FileText, Edit, Trash2, Download } from 'lucide-react';
import type { InvoiceWithFees } from '../types/invoice';
import { CURRENCY_SYMBOLS } from '../types/invoice';

interface InvoiceListProps {
  invoices: InvoiceWithFees[];
  onEdit: (invoice: InvoiceWithFees) => void;
  onDelete: (id: string) => void;
  onExport: (invoice: InvoiceWithFees) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

export function InvoiceList({ invoices, onEdit, onDelete, onExport }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices yet</h3>
        <p className="text-gray-600">Create your first invoice to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.invoice_number}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.client_name}
                  </div>
                  <div className="text-sm text-gray-500">{invoice.client_email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.patent_number}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {invoice.patent_title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {CURRENCY_SYMBOLS[invoice.currency]}
                    {invoice.total_amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">{invoice.currency}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[invoice.status]
                    }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onExport(invoice)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Export PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(invoice)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this invoice?')) {
                          onDelete(invoice.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
