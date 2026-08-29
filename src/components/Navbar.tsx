import React, { useState } from 'react';
import { 
  Dna, 
  Kanban, 
  Briefcase, 
  Bell, 
  BookOpen, 
  Mail, 
  Sparkles, 
  SlidersHorizontal,
  ExternalLink,
  CheckCircle2,
  Clock,
  Flame,
  Plus
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

interface NavbarProps {
  activeTab: 'directory' | 'tracker' | 'notifications' | 'bridge' | 'email_sop';
  setActiveTab: (tab: 'directory' | 'tracker' | 'notifications' | 'bridge' | 'email_sop') => void;
  onOpenCustomAppModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCustomAppModal }) => {
  const { notifications, unreadCount, applications, triggerSimulatedAlert, markNotificationAsRead } = useTracker();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const activeAppsCount = applications.filter(a => a.status !== 'rejected').length;
  const interviewCount = applications.filter(a => a.status === 'interview').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Ticker Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Active CS Freshers Hiring: CSIR-IGIB, AstraZeneca Hub, Strand Life Sciences & IASc SRFP 2026!
            </span>
            <span className="text-slate-300 font-medium sm:hidden">
              Bioinformatics Hub for CS Freshers
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={triggerSimulatedAlert}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
              title="Test real-time notification alert"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Alert</span>
            </button>
            <div className="text-slate-400 text-[11px] hidden md:inline">
              India Edition • 2026
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('directory')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Dna className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">
                    BioInfo<span className="text-emerald-600">CS</span>
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 font-semibold bg-emerald-100 text-emerald-800 rounded border border-emerald-200">
                    India Hub
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Bioinformatics Internships & Tracker for CS Freshers
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Internships Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer relative ${
                activeTab === 'tracker'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Live Tracker</span>
              {activeAppsCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                  {activeAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer relative ${
                activeTab === 'notifications'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bridge')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'bridge'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>CS-Bio Bridge</span>
            </button>

            <button
              onClick={() => setActiveTab('email_sop')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'email_sop'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Cold Email & SOP</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Add Custom App */}
            <button
              onClick={onOpenCustomAppModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowNotifDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">Live Alerts</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowNotifDropdown(false);
                        setActiveTab('notifications');
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 4).map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                          !notif.read ? 'bg-emerald-50/40' : ''
                        }`}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.relatedId) {
                            setActiveTab('tracker');
                          }
                          setShowNotifDropdown(false);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-900">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    )}
                  </div>

                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={triggerSimulatedAlert}
                      className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Test simulated alert
                    </button>
                    <span className="text-slate-400">Live tracker sync</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'directory' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Directory
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'tracker' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Tracker ({activeAppsCount})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'notifications' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setActiveTab('bridge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'bridge' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            CS-Bio Bridge
          </button>
          <button
            onClick={() => setActiveTab('email_sop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'email_sop' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Cold Email/SOP
          </button>
        </div>
      </div>
    </header>
  );
};
