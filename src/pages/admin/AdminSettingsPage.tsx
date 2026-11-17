import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Palette,
  Store,
  Shield,
  Save,
  Clock,
  DollarSign,
  Check,
  Volume2,
  Mail,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/admin/Button';
import { adminUserApi } from '../../services/adminApi';
import { STORE_SETTINGS_DATA } from '../../data/adminMockData';
import { useToast } from '../../context/ToastContext';
import useAuth from '../../hooks/useAuth';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const adminName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'Admin');
  const avatarInitial = (adminName.charAt(0) || 'A').toUpperCase();

  const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'notifications' | 'theme'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form
  const [profileName, setProfileName] = useState(adminName);
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileRole, setProfileRole] = useState(user?.roles?.includes('ADMIN') ? 'Super Admin' : 'Admin');

  useEffect(() => {
    if (user) {
      const name = user.name || user.username || (user.email ? user.email.split('@')[0] : 'Admin');
      setProfileName(name);
      if (user.email) setProfileEmail(user.email);
    }
  }, [user]);

  // Store Settings Form (load from localStorage or default)
  const savedStore = (() => {
    try {
      const s = localStorage.getItem('foodied_store_settings');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const [storeName, setStoreName] = useState(savedStore?.storeName || STORE_SETTINGS_DATA.storeName);
  const [storePhone, setStorePhone] = useState(savedStore?.storePhone || STORE_SETTINGS_DATA.contactPhone);
  const [openingHours, setOpeningHours] = useState(savedStore?.openingHours || STORE_SETTINGS_DATA.openingHours);
  const [closingHours, setClosingHours] = useState(savedStore?.closingHours || STORE_SETTINGS_DATA.closingHours);
  const [prepMinutes, setPrepMinutes] = useState(savedStore?.prepMinutes || STORE_SETTINGS_DATA.orderEstimatedPrepMinutes);
  const [deliveryFee, setDeliveryFee] = useState(savedStore?.deliveryFee || STORE_SETTINGS_DATA.defaultDeliveryFee);

  // Notification Toggles (load from localStorage or default)
  const savedNotifs = (() => {
    try {
      const s = localStorage.getItem('foodied_notification_settings');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const [soundAlerts, setSoundAlerts] = useState(savedNotifs?.soundAlerts ?? STORE_SETTINGS_DATA.soundAlertsEnabled);
  const [emailAlerts, setEmailAlerts] = useState(savedNotifs?.emailAlerts ?? STORE_SETTINGS_DATA.emailNotifications);
  const [smsAlerts, setSmsAlerts] = useState(savedNotifs?.smsAlerts ?? STORE_SETTINGS_DATA.smsNotifications);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminUserApi.updateProfile(profileName);
      // Update cached user in localStorage
      const cached = localStorage.getItem('user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          parsed.name = profileName;
          localStorage.setItem('user', JSON.stringify(parsed));
        } catch {}
      }
      showToast('Admin profile name updated successfully in MongoDB!', 'success', 'Profile Updated');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        storeName,
        storePhone,
        openingHours,
        closingHours,
        prepMinutes,
        deliveryFee,
      };
      localStorage.setItem('foodied_store_settings', JSON.stringify(payload));
      showToast('Kitchen and store operations settings updated!', 'success', 'Settings Saved');
    } catch (err) {
      showToast('Failed to save store settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const payload = { soundAlerts, emailAlerts, smsAlerts };
      localStorage.setItem('foodied_notification_settings', JSON.stringify(payload));
      showToast('Kitchen alerts and notification preferences saved!', 'success', 'Alerts Saved');
    } catch (err) {
      showToast('Failed to save notifications', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Admin & Kitchen Settings"
      subtitle="Manage profile credentials, operating hours, delivery thresholds, and sound alerts"
    >
      <div className="space-y-6 max-w-5xl">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-soft flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Admin Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'store'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store & Kitchen Hours</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Order Notifications & Sounds</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'theme'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Aesthetics</span>
          </button>
        </div>

        {/* Tab 1: Admin Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#F7931E] flex items-center justify-center text-white font-black text-2xl ring-4 ring-orange-100 shadow-soft">
                  {avatarInitial}
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Avatar upload available in connected storage mode', 'info')}
                  className="absolute -bottom-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 shadow-xs text-gray-700 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 font-display">
                  {profileName}
                </h4>
                <p className="text-xs text-gray-500">{profileRole}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white">
                    Super Admin
                  </span>
                  <span className="text-xs text-gray-400">Authenticated Session</span>
                </div>
              </div>
            </div>

            {/* Tab 1: Admin Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Kitchen Role
                  </label>
                  <input
                    type="text"
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Access Level
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Full Read / Write / Kitchen Dispatch"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button type="submit" variant="gradient" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Store & Kitchen Hours */}
        {activeTab === 'store' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft space-y-6">
            <div>
              <h4 className="text-base font-bold text-gray-900 font-display">
                Storefront & Operational Rules
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                These settings control business hours, order preparation estimates, and default delivery fees.
              </p>
            </div>

            {/* Tab 2: Store Form */}
            <form onSubmit={handleSaveStore} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Contact Hotline
                  </label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Opening Time
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={closingHours}
                    onChange={(e) => setClosingHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Default Prep Estimate (Minutes)
                  </label>
                  <input
                    type="number"
                    value={prepMinutes}
                    onChange={(e) => setPrepMinutes(parseInt(e.target.value) || 20)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Default Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button type="submit" variant="gradient" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                  Save Store Settings
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Order Notifications & Sounds */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft space-y-6">
            <div>
              <h4 className="text-base font-bold text-gray-900 font-display">
                Dispatch Alerts & Kitchen Sounds
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Keep the kitchen responsive with immediate audio and visual alerts on incoming orders.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary flex items-center justify-center shrink-0">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">
                      Kitchen Order Chime (Sound Alert)
                    </h5>
                    <p className="text-xs text-gray-500">
                      Plays an audible bell chime whenever a customer places a new customizable food order.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">
                      Email Daily Digest & Large Order Alerts
                    </h5>
                    <p className="text-xs text-gray-500">
                      Send morning shift summaries and instant notifications for orders exceeding $100.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">
                      SMS Driver Urgent Dispatch
                    </h5>
                    <p className="text-xs text-gray-500">
                      Automatically text assigned delivery drivers when food is packed.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button type="button" onClick={handleSaveNotifications} variant="gradient" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Alert Settings
              </Button>
            </div>
          </div>
        )}

        {/* Tab 4: Theme & Aesthetics */}
        {activeTab === 'theme' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft space-y-6">
            <div>
              <h4 className="text-base font-bold text-gray-900 font-display">
                Theme Palette & Visual Design
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                The Foodied design language is customized with warm appetizing food accents and modern SaaS glassmorphism.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 text-center space-y-2">
                <div className="w-full h-12 rounded-lg bg-[#FF6B35] shadow-xs" />
                <span className="text-xs font-bold text-gray-800 block">Primary Warm Orange</span>
                <span className="text-[11px] font-mono text-gray-400">#FF6B35</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 text-center space-y-2">
                <div className="w-full h-12 rounded-lg bg-[#F7931E] shadow-xs" />
                <span className="text-xs font-bold text-gray-800 block">Secondary Amber</span>
                <span className="text-[11px] font-mono text-gray-400">#F7931E</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 text-center space-y-2">
                <div className="w-full h-12 rounded-lg bg-[#2EC4B6] shadow-xs" />
                <span className="text-xs font-bold text-gray-800 block">Accent Mint Teal</span>
                <span className="text-[11px] font-mono text-gray-400">#2EC4B6</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 text-center space-y-2">
                <div className="w-full h-12 rounded-lg bg-[#1A1A2E] shadow-xs" />
                <span className="text-xs font-bold text-gray-800 block">Dark Sidebar Navy</span>
                <span className="text-[11px] font-mono text-gray-400">#1A1A2E</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 leading-relaxed">
                <strong className="text-gray-900 block mb-0.5">Customization-First UI Pattern:</strong>
                All buttons, badges, and statistics are calibrated to the requested "ahata huru" (harmonious & pleasing) food customization palette with 14-16px rounded curves and subtle soft shadows.
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

