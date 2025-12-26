import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { invoiceService } from './services/invoiceService';
import { exportInvoiceToPDF } from './utils/pdfExport';
import type { InvoiceWithFees, CreateInvoiceData, CreateFeeData } from './types/invoice';

function App() {
  const [invoices, setInvoices] = useState<InvoiceWithFees[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithFees | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData: CreateInvoiceData, fees: CreateFeeData[]) => {
    try {
      await invoiceService.createInvoice(invoiceData, fees);
      await loadInvoices();
      setShowForm(false);
      alert('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    }
  };

  const handleUpdateInvoice = async (invoiceData: CreateInvoiceData, fees: CreateFeeData[]) => {
    if (!editingInvoice) return;

    try {
      await invoiceService.updateInvoice(editingInvoice.id, invoiceData, fees);
      await loadInvoices();
      setEditingInvoice(null);
      setShowForm(false);
      alert('Invoice updated successfully!');
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Failed to update invoice');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await invoiceService.deleteInvoice(id);
      await loadInvoices();
      alert('Invoice deleted successfully!');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  const handleEditInvoice = (invoice: InvoiceWithFees) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleExportPDF = (invoice: InvoiceWithFees) => {
    exportInvoiceToPDF(invoice);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingInvoice(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Patent Invoice Management
              </h1>
              <p className="text-gray-600">
                Create and manage professional patent invoices with multiple currency support
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                New Invoice
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
              <div className="text-sm text-gray-600">Total Invoices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {invoices.filter((inv) => inv.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-600">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {invoices.filter((inv) => inv.status === 'sent').length}
              </div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {invoices.filter((inv) => inv.status === 'overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>

        {showForm ? (
          <InvoiceForm
            onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
            onCancel={handleCancelForm}
            initialData={
              editingInvoice
                ? {
                    invoice: {
                      invoice_number: editingInvoice.invoice_number,
                      client_name: editingInvoice.client_name,
                      client_email: editingInvoice.client_email,
                      client_address: editingInvoice.client_address,
                      patent_number: editingInvoice.patent_number,
                      patent_title: editingInvoice.patent_title,
                      currency: editingInvoice.currency,
                      issue_date: editingInvoice.issue_date,
                      due_date: editingInvoice.due_date,
                      status: editingInvoice.status,
                      notes: editingInvoice.notes,
                    },
                    fees: editingInvoice.fees.map((fee) => ({
                      fee_description: fee.fee_description,
                      fee_type: fee.fee_type,
                      quantity: fee.quantity,
                      unit_price: fee.unit_price,
                    })),
                  }
                : undefined
            }
          />
        ) : loading ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-600">Loading invoices...</p>
          </div>
        ) : (
          <InvoiceList
            invoices={invoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onExport={handleExportPDF}
          />
        )}
      </div>
    </div>
  );
}

export default App;
