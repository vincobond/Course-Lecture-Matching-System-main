import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  BookOpen,
  X,
  CheckCircle,
  AlertTriangle,
  Menu
} from 'lucide-react';

function SettingsModal({ isOpen, onClose }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    // System Settings
    autoMatchingEnabled: true,
    emailNotifications: true,
    systemMaintenance: false,
    
    // Matching Settings
    experienceWeight: 70,
    availabilityPriority: true,
    specializationStrict: true,
    
    // User Management
    allowSelfRegistration: false,
    requireEmailVerification: true,
    maxLoginAttempts: 5,
    
    // Course Settings
    maxStudentsPerCourse: 50,
    allowCourseOverlap: false,
    requirePrerequisites: true,
    
    // Notification Settings
    notifyOnMatch: true,
    notifyOnUnmatch: true,
    notifyOnRegistration: true,
    notifyOnDrop: true,
    
    // Security Settings
    sessionTimeout: 30,
    passwordExpiry: 90,
    twoFactorAuth: false,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically save to your backend
      console.log('Saving settings:', settings);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        autoMatchingEnabled: true,
        emailNotifications: true,
        systemMaintenance: false,
        experienceWeight: 70,
        availabilityPriority: true,
        specializationStrict: true,
        allowSelfRegistration: false,
        requireEmailVerification: true,
        maxLoginAttempts: 5,
        maxStudentsPerCourse: 50,
        allowCourseOverlap: false,
        requirePrerequisites: true,
        notifyOnMatch: true,
        notifyOnUnmatch: true,
        notifyOnRegistration: true,
        notifyOnDrop: true,
        sessionTimeout: 30,
        passwordExpiry: 90,
        twoFactorAuth: false,
        autoBackup: true,
        backupFrequency: 'daily',
        backupRetention: 30
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'matching', label: 'Matching', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">System Settings</h2>
              <p className="text-xs sm:text-sm text-neutral-600 hidden sm:block">Configure your course matching system</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-neutral-50 border-b border-neutral-200 px-4 py-3">
            <div className="space-y-3">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-3 py-2 bg-neutral-600 text-white rounded-lg text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Desktop Only */}
          <div className="hidden sm:block w-64 bg-neutral-50 border-r border-neutral-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile Tab Selector */}
            <div className="sm:hidden bg-neutral-50 border-b border-neutral-200">
              <nav className="flex overflow-x-auto p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">General Settings</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-neutral-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 text-sm sm:text-base">Auto-Matching</h4>
                      <p className="text-xs sm:text-sm text-neutral-600">Automatically match courses to lecturers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.autoMatchingEnabled}
                        onChange={(e) => handleSettingChange('autoMatchingEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-neutral-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 text-sm sm:text-base">Email Notifications</h4>
                      <p className="text-xs sm:text-sm text-neutral-600">Send email notifications for system events</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-neutral-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 text-sm sm:text-base">System Maintenance</h4>
                      <p className="text-xs sm:text-sm text-neutral-600">Enable maintenance mode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.systemMaintenance}
                        onChange={(e) => handleSettingChange('systemMaintenance', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Matching Settings */}
            {activeTab === 'matching' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-900">Matching Settings</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Experience Weight: {settings.experienceWeight}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.experienceWeight}
                      onChange={(e) => handleSettingChange('experienceWeight', parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500 mt-1">How much to prioritize lecturer experience in matching</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900">Availability Priority</h4>
                      <p className="text-sm text-neutral-600">Only match with available lecturers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.availabilityPriority}
                        onChange={(e) => handleSettingChange('availabilityPriority', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900">Strict Specialization</h4>
                      <p className="text-sm text-neutral-600">Require exact specialization match</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.specializationStrict}
                        onChange={(e) => handleSettingChange('specializationStrict', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* User Settings */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-900">User Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900">Allow Self Registration</h4>
                      <p className="text-sm text-neutral-600">Allow users to create their own accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowSelfRegistration}
                        onChange={(e) => handleSettingChange('allowSelfRegistration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Max Login Attempts: {settings.maxLoginAttempts}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500 mt-1">Number of failed login attempts before account lockout</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Notification Settings</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'notifyOnMatch', label: 'Notify on Match', desc: 'Send notification when course is matched' },
                    { key: 'notifyOnUnmatch', label: 'Notify on Unmatch', desc: 'Send notification when match is removed' },
                    { key: 'notifyOnRegistration', label: 'Notify on Registration', desc: 'Send notification when student registers' },
                    { key: 'notifyOnDrop', label: 'Notify on Drop', desc: 'Send notification when student drops course' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-neutral-900">{label}</h4>
                        <p className="text-sm text-neutral-600">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[key]}
                          onChange={(e) => handleSettingChange(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Session Timeout: {settings.sessionTimeout} minutes
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500 mt-1">How long before users are automatically logged out</p>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password Expiry: {settings.passwordExpiry} days
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      value={settings.passwordExpiry}
                      onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500 mt-1">How often users must change their passwords</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-neutral-600">Require 2FA for all users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Backup Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900">Automatic Backup</h4>
                      <p className="text-sm text-neutral-600">Enable automatic system backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Backup Frequency: {settings.backupFrequency}
                    </label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Backup Retention: {settings.backupRetention} days
                    </label>
                    <input
                      type="range"
                      min="7"
                      max="365"
                      value={settings.backupRetention}
                      onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500 mt-1">How long to keep backup files</p>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col space-y-3 p-4 sm:p-6 border-t border-neutral-200">
          {/* Status Messages */}
          {(saveStatus === 'success' || saveStatus === 'error') && (
            <div className="flex justify-center">
              {saveStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Settings saved!</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Failed to save!</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-neutral-600 hover:text-neutral-800 transition-colors border border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
