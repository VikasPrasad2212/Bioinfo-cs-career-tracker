import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  Clock, 
  Volume2, 
  VolumeX, 
  Mail, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Calendar, 
  Flame, 
  Check, 
  Sliders,
  Filter
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { AppNotification, NotificationType, OrgCategory } from '../types';

interface NotificationCenterProps {
  onNavigateToTracker: () => void;
  onNavigateToDirectory: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigateToTracker,
  onNavigateToDirectory
}) => {
  const { 
    notifications, 
    unreadCount, 
    settings, 
    updateSettings, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    triggerSimulatedAlert,
    requestBrowserNotifications
  } = useTracker();

  const [filterType, setFilterType] = useState<string>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [permissionState, setPermissionState] = useState<string>(() => {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  });

  const handleRequestPermission = async () => {
    const granted = await requestBrowserNotifications();
    setPermissionState(granted ? 'granted' : 'denied');
  };

  const filteredNotifs = notifications.filter(notif => {
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesUnread = !onlyUnread || !notif.read;
    return matchesType && matchesUnread;
  });

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-rose-600" />;
      case 'new_opening':
        return <Flame className="w-4 h-4 text-emerald-600" />;
      case 'interview_reminder':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'tip':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'system':
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Live Job & Deadline Alert Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time notifications for newly posted bioinformatics internships, interview schedules, and approaching deadlines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={triggerSimulatedAlert}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Simulate Job Alert</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={clearNotifications}
            title="Clear all alerts"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Browser Notification Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Browser Push & Audio Alerts</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {permissionState === 'granted'
                ? '✅ Desktop notifications are enabled. You will be alerted when new bioinformatics openings go live!'
                : 'Turn on instant notifications so you never miss tight fellowship deadlines (e.g. IASc SRFP or CSIR Trainees).'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {permissionState !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Enable Browser Alerts
            </button>
          )}

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              settings.soundEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
            }`}
            title="Toggle notification chime"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{settings.soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Notification Feed + Alert Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Alerts' },
                { id: 'new_opening', label: '🚀 Openings' },
                { id: 'deadline', label: '⏳ Deadlines' },
                { id: 'interview_reminder', label: '🎙️ Interviews' },
                { id: 'tip', label: '💡 CS BioTips' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    filterType === f.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => setOnlyUnread(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              Unread only
            </label>
          </div>

          {/* List of Notification Cards */}
          <div className="space-y-3">
            {filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`bg-white rounded-xl p-4 border transition-all hover:shadow-xs flex items-start gap-3.5 cursor-pointer ${
                  !notif.read ? 'border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                      {notif.priority === 'urgent' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {/* Contextual Action Button */}
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    {notif.relatedId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToTracker();
                        }}
                        className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        View in Application Tracker →
                      </button>
                    )}

                    {notif.actionUrl && (
                      <a
                        href={notif.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        Open Portal Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifs.length === 0 && (
              <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">No notifications found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  You're all caught up! Click "Simulate Job Alert" to test how live notifications appear.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alert Preferences & Subscription Rules (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Live Alert Preferences
            </h3>

            {/* Category Preferences */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Subscribed Alert Categories
              </label>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'gov_research' as OrgCategory, label: '🏛️ Premier Gov Labs (CSIR/IISc/NCBS)' },
                  { id: 'top_enterprise' as OrgCategory, label: '🏢 Top Industry (Strand/MedGenome)' },
                  { id: 'biotech_startup' as OrgCategory, label: '⚡ AI Biotech Startups (Bugworks)' },
                  { id: 'fellowship' as OrgCategory, label: '🎓 Fellowships (IASc SRFP / GSoC)' },
                ].map(cat => {
                  const isChecked = settings.subscribedCategories.includes(cat.id);
                  return (
                    <label key={cat.id} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? settings.subscribedCategories.filter(c => c !== cat.id)
                            : [...settings.subscribedCategories, cat.id];
                          updateSettings({ subscribedCategories: updated });
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{cat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Deadline Nudge Threshold */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Deadline Reminder Trigger
              </label>
              <select
                value={settings.deadlineThresholdDays}
                onChange={(e) => updateSettings({ deadlineThresholdDays: Number(e.target.value) })}
                className="w-full bg-slate-50 text-slate-800 text-xs py-1.5 px-2.5 rounded-lg border border-slate-200"
              >
                <option value={3}>3 Days Before Deadline</option>
                <option value={5}>5 Days Before Deadline</option>
                <option value={7}>7 Days Before Deadline</option>
                <option value={14}>14 Days Before (Early Prep)</option>
              </select>
            </div>

            {/* Email Digest Simulation */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Weekly CS-Bio Digest</div>
                  <div className="text-[11px] text-slate-500">Summary of upcoming batches</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => updateSettings({ emailAlerts: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Test Alert Button */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={triggerSimulatedAlert}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Send Test Alert Now
              </button>
            </div>
          </div>

          {/* Tips Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              Pro Tip for CS Applicants
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Gov labs like CSIR-IGIB and NCBS often recruit project trainees on rolling cycles via direct PI contact even before formal web portal updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
