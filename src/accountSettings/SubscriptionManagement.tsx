import React, { useState } from 'react';
import { CreditCard, Calendar, Download, AlertCircle, CheckCircle2, XCircle, X } from 'lucide-react';

interface PaymentHistory {
  id: string;
  date: string;
  amount: string;
  status: 'success' | 'failed' | 'pending';
  invoice: string;
}

const SubscriptionManagement: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const paymentHistory: PaymentHistory[] = [
    {
      id: '1',
      date: 'Mar 1, 2024',
      amount: '$29.00',
      status: 'success',
      invoice: 'INV-2024-001',
    },
    {
      id: '2',
      date: 'Feb 1, 2024',
      amount: '$29.00',
      status: 'success',
      invoice: 'INV-2024-002',
    },
    {
      id: '3',
      date: 'Jan 1, 2024',
      amount: '$29.00',
      status: 'failed',
      invoice: 'INV-2024-003',
    },
  ];

  const getStatusIcon = (status: PaymentHistory['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment update logic here
    setShowPaymentModal(false);
  };

  const handleCancelSubscription = () => {
    // Handle subscription cancellation logic here
    setShowCancelModal(false);
  };

  return (
    <div id="subscription-management-container" className="w-auto">
      {/* Current Plan Section */}
      <div id="current-plan-section" className="bg-white rounded-lg p-6 mb-6">
        <h2 id="current-plan-title" className="text-lg font-medium text-black mb-6">
          Current Plan
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-[#F8F9FA] rounded-lg">
          <div>
            <h3 className="text-base font-medium text-black mb-1">Pro Plan</h3>
            <p className="text-sm text-gray-600">$29.00/month • Renews on April 1, 2024</p>
          </div>
          <div className="px-[15px] py-[15px] rounded-[10px] bg-[rgba(229,0,0,0.04)]">
            <button 
              className="text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method Section */}
      <div id="payment-method-section" className="bg-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 id="payment-method-title" className="text-lg font-medium text-black">
            Payment Method
          </h2>
          <button 
            className="text-[#00A3FF] hover:text-[#0096FF] transition-colors text-sm font-medium"
            onClick={() => setShowPaymentModal(true)}
          >
            Change
          </button>
        </div>
        <div className="flex items-center gap-3 p-4 bg-[#F8F9FA] rounded-lg">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-black">•••• •••• •••• 4242</p>
            <p className="text-xs text-gray-600">Expires 12/25</p>
          </div>
        </div>
      </div>

      {/* Billing History Section */}
      <div id="billing-history-section" className="bg-white rounded-lg p-6">
        <h2 id="billing-history-title" className="text-lg font-medium text-black mb-6">
          Billing History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{payment.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{payment.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-sm capitalize">{payment.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="flex items-center gap-2 text-[#00A3FF] hover:text-[#0096FF] transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      {payment.invoice}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold mb-6">Update Payment Method</h3>
            <form onSubmit={handleUpdatePayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#00A3FF] text-white py-3 rounded-lg font-medium hover:bg-[#0096FF] transition-colors mt-4"
                >
                  Update Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 relative">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cancel Subscription?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to:
              </p>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-600">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Unlimited AI summaries
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <XCircle className="w-5 h-5 text-red-500" />
                  AI-Generated Mindmaps
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Premium features and updates
                </li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Cancel Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;