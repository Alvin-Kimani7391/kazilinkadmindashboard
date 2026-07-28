import { useState, useEffect } from 'react';
import { Save, Bell, Globe, Shield, User, Mail, Phone, Lock, Palette, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { getUserById, updateUser } from '../services/userService';

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', role: '' });
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailNotifications: true,
    twoFactor: false,
    language: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const authUser = getCurrentUser();
        if (!authUser) {
          setError('No signed-in user found.');
          return;
        }

        // The User doc is expected to be keyed by the Firebase Auth UID
        // (see authService.login, which does the same lookup at sign-in).
        const doc = await getUserById(authUser.uid);
        if (doc) {
          setUserId(doc.id);
          setProfile({
            name: doc.name || '',
            email: doc.email || authUser.email || '',
            phoneNumber: doc.phoneNumber || '',
            role: doc.role || '',
          });
          setSettings((prev) => ({
            ...prev,
            notifications: doc.notifications ?? prev.notifications,
            darkMode: doc.darkMode ?? prev.darkMode,
            emailNotifications: doc.emailNotifications ?? prev.emailNotifications,
            twoFactor: doc.twoFactor ?? prev.twoFactor,
            language: doc.language ?? prev.language,
          }));
        } else {
          // Auth account exists but no matching User doc yet — still let the
          // admin see/edit something sensible instead of a blank screen.
          setUserId(authUser.uid);
          setProfile((prev) => ({ ...prev, email: authUser.email || '' }));
          setError('No Firestore profile found for this account yet — saving will create one.');
        }
      } catch (err) {
        console.error('Settings load error:', err);
        setError('Could not load your profile from Firestore.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await updateUser(userId, {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        // Settings toggles aren't part of the original User schema spec, but
        // Firestore is schemaless — they're stored as extra fields on the
        // same doc so they persist without needing a new collection.
        notifications: settings.notifications,
        emailNotifications: settings.emailNotifications,
        twoFactor: settings.twoFactor,
        darkMode: settings.darkMode,
        language: settings.language,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save settings error:', err);
      setError('Could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
        <Loader2 size={20} className="animate-spin" />
        Loading your profile…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
        <p className="text-gray-500">Manage system settings and preferences</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-6 flex items-center gap-2 bg-green-50 text-green-600 border border-green-100 rounded-xl px-4 py-3 text-sm">
          <CheckCircle2 size={16} />
          Changes saved.
        </div>
      )}

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
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
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
                  value={profile.email}
                  disabled
                  title="Email is managed by Firebase Authentication and can't be edited here"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+254 7xx xxx xxx"
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
                  value={profile.role || 'admin'}
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
                className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive email updates</p>
              </div>
              <button
                onClick={() => toggleSetting('emailNotifications')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
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
                className={`w-12 h-6 rounded-full transition-colors ${settings.twoFactor ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.twoFactor ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Password changes go through Firebase Authentication directly — not covered by this service layer.
            </p>
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
              className={`w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            Language
          </h3>
          <select
            value={settings.language}
            onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="p-6 bg-gray-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-navy px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;