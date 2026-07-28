import { useState, useEffect, useMemo } from 'react';
import { Search, Eye, CreditCard, Wallet, ArrowUpRight, Download, Loader2, AlertCircle, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { getBookings } from '../services/bookingService';
import { getUsers } from '../services/userService';
import { formatDate } from '../utils/formatters';

const COMMISSION_RATE = 0.1; // 10% platform commission — same assumption as the original mock data

const Payments = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [rateByProviderId, setRateByProviderId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [bookingData, users] = await Promise.all([getBookings(), getUsers()]);
        if (cancelled) return;

        const rates = {};
        users.forEach((u) => { if (u.id) rates[u.id] = u.hourlyRate || 0; });

        setBookings(bookingData);
        setRateByProviderId(rates);
      } catch (err) {
        console.error('Payments load error:', err);
        if (!cancelled) setError('Could not load payment data from Firestore.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // The schema has no Payment collection, so "payments" are derived from
  // completed Bookings: amount = hours worked x the provider's hourlyRate.
  const derivedPayments = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'completed')
      .map((b) => {
        const hours = (b.totalDurationSeconds || 0) / 3600;
        const rate = rateByProviderId[b.providerId] ?? 0;
        const amount = hours * rate;
        const commission = amount * COMMISSION_RATE;
        return {
          id: b.id,
          client: b.client || 'Unknown',
          provider: b.provider || 'Unknown',
          amount,
          commission,
          date: b.endTime || b.startTime,
        };
      });
  }, [bookings, rateByProviderId]);

  const filteredPayments = derivedPayments.filter(
    (p) =>
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = derivedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCommission = derivedPayments.reduce((sum, p) => sum + p.commission, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Payments</h1>
          <p className="text-gray-500">Payments derived from completed bookings</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-navy px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-primary">
            {loading ? '—' : `KES ${Math.round(totalRevenue).toLocaleString()}`}
          </p>
          <p className="text-xs text-success flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} />
            From completed bookings
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Commission</p>
          <p className="text-xl font-bold text-navy">
            {loading ? '—' : `KES ${Math.round(totalCommission).toLocaleString()}`}
          </p>
          <p className="text-xs text-gray-400 mt-1">{COMMISSION_RATE * 100}% of revenue</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Completed Bookings</p>
          <p className="text-xl font-bold text-navy">{loading ? '—' : derivedPayments.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-100 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'payments' ? 'bg-primary text-navy' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <CreditCard size={18} />
            Payments
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'withdrawals' ? 'bg-primary text-navy' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Wallet size={18} />
            Withdrawals
          </button>
        </div>
      </div>

      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      )}

      {activeTab === 'payments' ? (
        loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
            <Loader2 size={20} className="animate-spin" />
            Loading payments…
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-navy">{payment.id}</p>
                          <p className="text-xs text-gray-500 truncate">{payment.client} → {payment.provider}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        {`KES ${Math.round(payment.amount).toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {`KES ${Math.round(payment.commission).toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status="completed" /></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(payment.date)}</td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                          <Eye size={18} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">No completed bookings yet.</div>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Info size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Withdrawals aren't tracked in Firestore yet</p>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            There's no Withdrawal collection in the current schema, so this tab can't show
            real data. Add a Withdrawal collection (e.g. providerId, amount, status, method,
            requestedAt) and a matching withdrawalService if you need this for the demo.
          </p>
        </div>
      )}
    </div>
  );
};

export default Payments;