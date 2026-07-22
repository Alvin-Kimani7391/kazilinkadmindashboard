import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  Star,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/ratings', icon: Star, label: 'Ratings' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-navy text-white min-h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-2xl">
            🔧
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">KaziLink</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/20 text-primary shadow-lg shadow-primary/5'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
            {item.path === '/notifications' && (
              <span className="ml-auto bg-error text-white text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;