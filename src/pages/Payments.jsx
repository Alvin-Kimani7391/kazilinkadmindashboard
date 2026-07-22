import { useState } from 'react';
import { Search, Eye, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { payments, withdrawals } from '../data/mockData';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => 
    p.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.worker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWithdrawals = withdrawals.filter(w =>
    w.worker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + parseInt(p.amount.replace(/,/g, '')), 0);
  const totalCommission = payments.reduce((sum, p) => sum + parseInt(p.commission.replace(/,/g, '')), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Payments</h1>
          <p className="text-gray-500">Manage payments, commissions, and withdrawals</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-navy px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-primary">{`KES ${totalRevenue.toLocaleString()}`}</p>
          <p className="text-xs text-success flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} />
            +12.5%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Commission</p>
          <p className="text-xl font-bold text-navy">{`KES ${totalCommission.toLocaleString()}`}</p>
          <p className="text-xs text-gray-400 mt-1">10% of revenue</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Pending Withdrawals</p>
          <p className="text-xl font-bold text-warning">KES 7,500</p>
          <p className="text-xs text-gray-400 mt-1">2 requests waiting</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-100 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'payments'
                ? 'bg-primary text-navy'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <CreditCard size={18} />
            Payments
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'withdrawals'
                ? 'bg-primary text-navy'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Wallet size={18} />
            Withdrawals
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {activeTab === 'payments' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-navy">{payment.jobId}</p>
                        <p className="text-xs text-gray-500 truncate">{payment.employer} → {payment.worker}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">{payment.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{payment.commission}</td>
                    <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
                    <td className="px-4 py-3 text-sm">{payment.method}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{payment.date}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy">{withdrawal.worker}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{withdrawal.amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={withdrawal.status} /></td>
                    <td className="px-4 py-3 text-sm">{withdrawal.method}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{withdrawal.date}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;  // <-- This is the important line!