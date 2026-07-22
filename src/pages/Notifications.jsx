import { useState } from 'react';
import { Bell, Check, X, AlertCircle, CreditCard, Users, Briefcase, Trash2 } from 'lucide-react';
import { notifications as initialNotifications } from '../data/mockData';

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const getIcon = (type) => {
    switch (type) {
      case 'job_posted': return <Briefcase size={18} className="text-info" />;
      case 'user_registered': return <Users size={18} className="text-primary" />;
      case 'user_verified': return <Check size={18} className="text-success" />;
      case 'payment_completed': return <CreditCard size={18} className="text-success" />;
      case 'withdrawal_request': return <CreditCard size={18} className="text-warning" />;
      default: return <AlertCircle size={18} className="text-gray-400" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
              onClick={markAllAsRead}
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors"
            >
              <Check size={18} />
              Mark All Read ({unreadCount})
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={deleteAll}
              className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-lg font-medium hover:bg-error/20 transition-colors"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-primary text-navy'
                  : 'text-gray-500 hover:bg-gray-100'
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

        <div className="divide-y divide-gray-100">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400">{notification.time}</span>
                        {!notification.read && (
                          <span className="text-xs text-primary font-medium">New</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} className="text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications to show</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;