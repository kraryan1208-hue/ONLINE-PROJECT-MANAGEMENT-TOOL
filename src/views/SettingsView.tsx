import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Bell,
  Mail,
  Lock,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User as UserIcon,
  Shield,
  Briefcase,
  Palette,
  Check,
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: User;
  onLogout: () => void;
  onUpdatePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
  onSavePreferences?: (preferences: {
    theme: 'light' | 'dark';
    taskNotifications: boolean;
    projectNotifications: boolean;
    emailNotifications: boolean;
  }) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onLogout,
  onUpdatePassword,
  onSavePreferences,
}) => {
  // Theme from ThemeContext
  const { mode, activePresetId, setMode, selectPreset, presets } = useTheme();

  // 2. Notification Settings
  const [taskNotifications, setTaskNotifications] = useState<boolean>(() => {
    const saved = localStorage.getItem('notif_tasks');
    return saved !== null ? saved === 'true' : true;
  });

  const [projectNotifications, setProjectNotifications] = useState<boolean>(() => {
    const saved = localStorage.getItem('notif_projects');
    return saved !== null ? saved === 'true' : true;
  });

  const [emailNotifications, setEmailNotifications] = useState<boolean>(() => {
    const saved = localStorage.getItem('notif_email');
    return saved !== null ? saved === 'true' : false;
  });

  // 3. Account / Password Management
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status feedback
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Handle Save General Changes
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      localStorage.setItem('app_theme', mode);
      localStorage.setItem('notif_tasks', String(taskNotifications));
      localStorage.setItem('notif_projects', String(projectNotifications));
      localStorage.setItem('notif_email', String(emailNotifications));

      if (onSavePreferences) {
        onSavePreferences({
          theme: mode,
          taskNotifications,
          projectNotifications,
          emailNotifications,
        });
      }

      setSuccessMessage('Settings saved successfully.');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword.trim()) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    setPasswordUpdating(true);
    try {
      if (onUpdatePassword) {
        await onUpdatePassword(currentPassword, newPassword);
      } else {
        // Fallback profile endpoint call
        const token = localStorage.getItem('opmt_session_token');
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: currentUser.name,
            email: currentUser.email,
            password: newPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update password.');
      }

      setSuccessMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to change password.');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3 h-3" />
            Administrator
          </span>
        );
      case 'PROJECT_MANAGER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Briefcase className="w-3 h-3" />
            Project Manager
          </span>
        );
      case 'TEAM_MEMBER':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserIcon className="w-3 h-3" />
            Team Member
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Application Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your appearance, notification preferences, and account credentials.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* 1. APPEARANCE SETTINGS */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">1. Appearance &amp; Themes</h3>
              <p className="text-xs text-slate-500">Choose your workspace display mode and color theme palette.</p>
            </div>
          </div>

          {/* Mode Switch: Light vs Dark */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700">Display Mode:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Mode Option */}
              <label
                onClick={() => setMode('light')}
                className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  mode === 'light'
                    ? 'bg-blue-50/50 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value="light"
                  checked={mode === 'light'}
                  onChange={() => setMode('light')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Light Mode</div>
                  <div className="text-[11px] text-slate-500">Standard bright, high-contrast workspace</div>
                </div>
              </label>

              {/* Dark Mode Option */}
              <label
                onClick={() => setMode('dark')}
                className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  mode === 'dark'
                    ? 'bg-slate-900 text-white border-cyan-500 shadow-xs ring-1 ring-cyan-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value="dark"
                  checked={mode === 'dark'}
                  onChange={() => setMode('dark')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Dark Mode
                  </div>
                  <div className={`text-[11px] ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Sleek obsidian theme with low eye fatigue
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Theme Presets Palettes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                Theme Presets &amp; Color Accents:
              </span>
              <span className="text-[11px] text-slate-400">Click to apply instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {presets.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset.id)}
                    className={`p-3 text-left rounded-xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/30 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                      </div>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                            preset.mode === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {preset.mode}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. NOTIFICATIONS SETTINGS */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">2. Notifications</h3>
            <p className="text-xs text-slate-500">Control alerts and updates for tasks, projects, and email.</p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Task Notifications */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-150 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Task Notifications</div>
                  <div className="text-[11px] text-slate-500">Receive alerts when tasks are created, updated, or completed</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={taskNotifications}
                  onChange={(e) => setTaskNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2.5 text-xs font-semibold text-slate-700 w-8">
                  {taskNotifications ? 'ON' : 'OFF'}
                </span>
              </label>
            </div>

            {/* Project Notifications */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-150 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Project Notifications</div>
                  <div className="text-[11px] text-slate-500">Get updates on project progress milestones, deadline shifts, and reviews</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={projectNotifications}
                  onChange={(e) => setProjectNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2.5 text-xs font-semibold text-slate-700 w-8">
                  {projectNotifications ? 'ON' : 'OFF'}
                </span>
              </label>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-150 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Email Notifications</div>
                  <div className="text-[11px] text-slate-500">Deliver daily summary digests and urgent status pings to your email</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2.5 text-xs font-semibold text-slate-700 w-8">
                  {emailNotifications ? 'ON' : 'OFF'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. ACCOUNT SETTINGS */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">3. Account & Security</h3>
            <p className="text-xs text-slate-500">Manage your active profile credentials and authentication.</p>
          </div>

          {/* User Details Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
              </div>
            </div>
            <div>{getRoleBadge()}</div>
          </div>

          {/* Change Password Form */}
          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Change Password</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Current Password */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-3 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-3 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-3 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={passwordUpdating || !newPassword}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{passwordUpdating ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </div>

          {/* Account Logout Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">Session Logout</div>
              <div className="text-[11px] text-slate-500">Sign out and end your current authenticated session.</div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2 border border-rose-200 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 4. SAVE CHANGES BUTTON */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">
            Changes to Appearance and Notifications take effect immediately.
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
