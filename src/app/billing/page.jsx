"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BillingPage() {
  const [planStatus, setPlanStatus] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch from the backend using the user's token.
    // For now, we mock the fetch with a delay to show the skeleton loader.
    const fetchBillingData = async () => {
      setLoading(true);
      try {
        // Example structure that matches the backend PlanStatusResponse
        // const response = await fetch('/billing/current-plan', { headers: { Authorization: `Bearer ${token}` }});
        // const data = await response.json();
        
        // Mock data to demonstrate the UI
        setTimeout(() => {
          setPlanStatus({
            tier: 'Warlord',
            monthly_cost: 99.0,
            message_allowance: 50,
            billing_status: 'active',
            subscription_start_date: new Date().toISOString()
          });

          setInvoices([
            { id: '1', invoice_number: 'LP-2026-05-0001', invoice_month: '2026-05-01', amount: 99.0, status: 'paid' },
            { id: '2', invoice_number: 'LP-2026-04-0001', invoice_month: '2026-04-01', amount: 99.0, status: 'paid' }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch billing data", error);
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const handleDownloadInvoice = async (invoiceId) => {
    // Logic to call the backend and get the signed URL, then open it
    alert(`Triggering download for invoice ${invoiceId}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-extrabold text-white">Billing & Subscription</h1>
          <p className="mt-2 text-muted">Manage your plan, invoices, and billing history.</p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-panel border border-muted/20 rounded-2xl"></div>
            <div className="h-64 bg-panel border border-muted/20 rounded-2xl"></div>
          </div>
        ) : (
          <>
            {/* Current Plan Card */}
            <div className="bg-panel border border-muted/20 rounded-2xl shadow-lg p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-accent">{planStatus?.tier}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    planStatus?.billing_status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {planStatus?.billing_status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted">Monthly Cost</p>
                    <p className="text-lg font-medium text-white">₹{planStatus?.monthly_cost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Message Allowance</p>
                    <p className="text-lg font-medium text-white">{planStatus?.message_allowance} / week</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex flex-col space-y-3 w-full md:w-auto">
                <Link href="/plans" className="px-6 py-2 bg-transparent border border-accent text-accent hover:bg-accent hover:text-white rounded-md font-medium transition-colors text-center">
                  Change Plan
                </Link>
                {planStatus?.billing_status === 'active' && (
                  <button className="px-6 py-2 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-md font-medium transition-colors text-center">
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-panel border border-muted/20 rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-muted/20">
                <h3 className="text-lg font-semibold text-white">Invoice History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-muted/20">
                  <thead className="bg-black/20">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Invoice Number</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">Download</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/20">
                    {invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{invoice.invoice_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(invoice.invoice_month).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{invoice.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="text-accent hover:text-accent-2 transition-colors"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-muted">
                          No invoices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
