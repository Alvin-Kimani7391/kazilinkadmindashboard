import { useState } from 'react';
import { Save, Bell, Moon, Globe, Shield, User, Mail, Phone, Lock, Palette } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailNotifications: true,
    twoFactor: false,
    language: 'en',
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
        <p className="text-gray-500">Manage system settings and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" />
            Profile Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value="Admin User"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value="admin@kazilink.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value="+254 712 345 678"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value="Super Admin"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Notification Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive system notifications</p>
              </div>
              <button
                onClick={() => toggleSetting('notifications')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive email updates</p>
              </div>
              <button
                onClick={() => toggleSetting('emailNotifications')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Security Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Extra security for your account</p>
              </div>
              <button
                onClick={() => toggleSetting('twoFactor')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.twoFactor ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.twoFactor ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <button className="text-sm text-primary hover:underline">
              Change Password
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <Palette size={20} className="text-primary" />
            Appearance
          </h3>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-gray-500">Switch between light and dark theme</p>
            </div>
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.darkMode ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            Language
          </h3>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="p-6 bg-gray-50">
          <button className="flex items-center gap-2 bg-primary text-navy px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;