import { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, CreditCard, Users, Briefcase, Trash2, Loader2 } from 'lucide-react';
import { getNotifications, markAsRead, deleteNotification } from '../services/notificationService';
import { timeAgo } from '../utils/formatters';

const getIcon = (notification) => {
  const text = `${notification.title || ''} ${notification.message || ''}`.toLowerCase();
  if (text.includes('job') || text.includes('booking')) return <Briefcase size={18} className="text-info" />;
  if (text.includes('user') || text.includes('registered')) return <Users size={18} className="text-primary" />;
  if (text.includes('verified')) return <Check size={18} className="text-success" />;
  if (text.includes('payment') || text.includes('withdrawal')) return <CreditCard size={18} className="text-success" />;
  return <AlertCircle size={18} className="text-gray-400" />;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [isBulkBusy, setIsBulkBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');

    const unsubscribe = getNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    setBusyId(id);
    // Optimistic Update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markAsRead(id);
    } catch (err) {
      console.error('Mark as read error:', err);
      alert('Could not update this notification.');
      // Revert Optimistic Update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    setIsBulkBusy(true);
    // Optimistic Update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await Promise.all(unread.map((n) => markAsRead(n.id)));
    } catch (err) {
      console.error('Mark all as read error:', err);
      alert('Some notifications could not be updated.');
    } finally {
      setIsBulkBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    const originalNotifications = [...notifications];
    // Optimistic Update
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await deleteNotification(id);
    } catch (err) {
      console.error('Delete notification error:', err);
      alert('Could not delete this notification.');
      // Revert Optimistic Update
      setNotifications(originalNotifications);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete all notifications? This cannot be undone.')) return;
    
    setIsBulkBusy(true);
    const originalNotifications = [...notifications];
    // Optimistic Update
    setNotifications([]);

    try {
      await Promise.all(originalNotifications.map((n) => deleteNotification(n.id)));
    } catch (err) {
      console.error('Delete all error:', err);
      alert('Some notifications could not be deleted.');
      // Revert Optimistic Update
      setNotifications(originalNotifications);
    } finally {
      setIsBulkBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Notifications</h1>
          <p className="text-gray-500">Manage system notifications and alerts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <button
              disabled={isBulkBusy}
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {isBulkBusy ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              Mark All Read ({unreadCount})
            </button>
          )}
          {notifications.length > 0 && (
            <button
              disabled={isBulkBusy}
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-lg font-medium hover:bg-error/20 transition-colors disabled:opacity-50"
            >
              {isBulkBusy ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              Clear All
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f ? 'bg-primary text-navy' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f} {f === 'unread' && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-navy" />
              <span className="font-medium text-navy">
                {filteredNotifications.length} {filteredNotifications.length === 1 ? 'Notification' : 'Notifications'}
                {unreadCount > 0 && ` (${unreadCount} unread)`}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
            <Loader2 size={20} className="animate-spin" />
            Loading notifications…
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {getIcon(notification)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</span>
                          {!notification.isRead && (
                            <span className="text-xs text-primary font-medium">New</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            disabled={busyId === notification.id}
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as read"
                          >
                            {busyId === notification.id ? (
                              <Loader2 size={16} className="animate-spin text-gray-400" />
                            ) : (
                              <Check size={16} className="text-gray-400" />
                            )}
                          </button>
                        )}
                        <button
                          disabled={busyId === notification.id}
                          onClick={() => handleDelete(notification.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {busyId === notification.id ? (
                            <Loader2 size={16} className="animate-spin text-gray-400" />
                          ) : (
                            <X size={16} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications to show</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;