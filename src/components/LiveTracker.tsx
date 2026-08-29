import React, { useState } from 'react';
import { 
  Kanban, 
  ListFilter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  MapPin, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  DollarSign, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Download,
  Flame,
  Award
} from 'lucide-react';
import { TrackedApplication, ApplicationStatus, TrackerTask } from '../types';
import { useTracker } from '../context/TrackerContext';

interface LiveTrackerProps {
  onOpenCustomAppModal: () => void;
  onNavigateToDirectory: () => void;
  onNavigateToEmailGenerator: (opp?: any) => void;
}

const STAGES: { id: ApplicationStatus; title: string; emoji: string; color: string; bg: string; border: string }[] = [
  { id: 'wishlist', title: 'Wishlist / Target', emoji: '📌', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-300' },
  { id: 'applied', title: 'Applied / Emailed', emoji: '📨', color: 'text-blue-700', bg: 'bg-blue-50/50', border: 'border-blue-200' },
  { id: 'assessment', title: 'Coding Test', emoji: '💻', color: 'text-amber-700', bg: 'bg-amber-50/50', border: 'border-amber-200' },
  { id: 'interview', title: 'Interviewing', emoji: '🎙️', color: 'text-purple-700', bg: 'bg-purple-50/50', border: 'border-purple-200' },
  { id: 'offer', title: 'Offer Received', emoji: '🎉', color: 'text-emerald-700', bg: 'bg-emerald-50/60', border: 'border-emerald-300' },
  { id: 'rejected', title: 'Closed / Next Cycle', emoji: '📁', color: 'text-slate-500', bg: 'bg-slate-100/60', border: 'border-slate-200' },
];

export const LiveTracker: React.FC<LiveTrackerProps> = ({ 
  onOpenCustomAppModal, 
  onNavigateToDirectory,
  onNavigateToEmailGenerator 
}) => {
  const { 
    applications, 
    updateApplicationStatus, 
    deleteApplication, 
    updateApplication,
    toggleTaskCompletion, 
    addTaskToApplication, 
    deleteTaskFromApplication 
  } = useTracker();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedApp, setSelectedApp] = useState<TrackedApplication | null>(null);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || app.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getStageApps = (status: ApplicationStatus) => {
    return filteredApps.filter(app => app.status === status);
  };

  const handleExportCSV = () => {
    const headers = ['Title', 'Organization', 'Status', 'Applied Date', 'Deadline', 'Interview Date', 'Stipend', 'Priority', 'Notes'];
    const rows = applications.map(a => [
      `"${a.title}"`,
      `"${a.organization}"`,
      `"${a.status}"`,
      `"${a.appliedDate || ''}"`,
      `"${a.deadlineDate || ''}"`,
      `"${a.interviewDate || ''}"`,
      `"${a.stipend || ''}"`,
      `"${a.priority}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bioinformatics_internship_tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Live Application Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {applications.length} Applications
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pipeline monitoring, interview dates, preparation checklists, and follow-ups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              List Table
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            title="Export applications to CSV spreadsheet"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Add Custom Application */}
          <button
            onClick={onOpenCustomAppModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <input
          type="text"
          placeholder="Filter tracked applications by lab, role, or note..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-full sm:w-72"
        />

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 text-xs cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {STAGES.map((stage) => {
            const stageApps = getStageApps(stage.id);

            return (
              <div
                key={stage.id}
                className={`rounded-xl border ${stage.border} ${stage.bg} p-3.5 flex flex-col min-h-[480px] shadow-2xs`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{stage.emoji}</span>
                    <span className={`font-bold text-xs ${stage.color}`}>{stage.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageApps.map((app) => {
                    const completedTasks = app.tasks.filter(t => t.completed).length;

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 group"
                      >
                        <div>
                          {/* Priority Badge & Actions */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                app.priority === 'high'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : app.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {app.priority}
                            </span>

                            {app.stipend && (
                              <span className="text-[10px] font-semibold text-emerald-700 truncate max-w-[100px]">
                                {app.stipend.split('/')[0]}
                              </span>
                            )}
                          </div>

                          {/* Role & Org */}
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                            {app.title}
                          </h4>
                          <div className="text-[11px] text-slate-600 font-medium mt-1 truncate">
                            {app.organization}
                          </div>

                          {/* Dates / Deadlines */}
                          {app.interviewDate && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 p-1.5 rounded border border-purple-200">
                              <Calendar className="w-3 h-3 text-purple-600" />
                              <span>Interview: {app.interviewDate}</span>
                            </div>
                          )}

                          {app.deadlineDate && !app.interviewDate && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50/70 p-1 rounded">
                              <Clock className="w-3 h-3 text-rose-500" />
                              <span>Due: {app.deadlineDate}</span>
                            </div>
                          )}

                          {/* Tasks mini preview */}
                          {app.tasks.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-emerald-600" />
                                {completedTasks}/{app.tasks.length} Tasks
                              </span>
                              <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full rounded-full transition-all"
                                  style={{ width: `${(completedTasks / app.tasks.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Move Footer Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <select
                            value={app.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateApplicationStatus(app.id, e.target.value as ApplicationStatus);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-[10px] py-1 px-1.5 rounded border border-slate-200 cursor-pointer"
                          >
                            <option value="wishlist">📌 Wishlist</option>
                            <option value="applied">📨 Applied</option>
                            <option value="assessment">💻 Test</option>
                            <option value="interview">🎙️ Interview</option>
                            <option value="offer">🎉 Offer</option>
                            <option value="rejected">📁 Closed</option>
                          </select>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteApplication(app.id);
                            }}
                            title="Delete Application"
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {stageApps.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-slate-400 border-2 border-dashed border-slate-200/80 rounded-lg">
                      No applications
                    </div>
                  )}
                </div>

                {/* Quick Add Button inside Wishlist */}
                {stage.id === 'wishlist' && (
                  <button
                    onClick={onNavigateToDirectory}
                    className="mt-3 w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Browse Openings</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* List Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Organization & Role</th>
                  <th className="p-3.5">Stage / Status</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Key Dates</th>
                  <th className="p-3.5">Tasks</th>
                  <th className="p-3.5">Stipend</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const completedTasks = app.tasks.filter(t => t.completed).length;
                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">{app.title}</div>
                        <div className="text-slate-500 font-medium">{app.organization} • {app.location}</div>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={app.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(app.id, e.target.value as ApplicationStatus);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-100 font-semibold text-slate-800 text-xs py-1 px-2 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          <option value="wishlist">📌 Wishlist</option>
                          <option value="applied">📨 Applied</option>
                          <option value="assessment">💻 Coding Test</option>
                          <option value="interview">🎙️ Interview</option>
                          <option value="offer">🎉 Offer Received</option>
                          <option value="rejected">📁 Closed</option>
                        </select>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            app.priority === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : app.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {app.priority}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {app.interviewDate ? (
                          <div className="font-bold text-purple-700">Interview: {app.interviewDate}</div>
                        ) : app.deadlineDate ? (
                          <div className="text-slate-600">Due: {app.deadlineDate}</div>
                        ) : (
                          <span className="text-slate-400">Not set</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-700">
                          {completedTasks}/{app.tasks.length} Completed
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-700">
                        {app.stipend || '—'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteApplication(app.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail & Edit Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Application Management
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedApp.title}</h3>
                <div className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{selectedApp.organization}</span>
                  <span>•</span>
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{selectedApp.location}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
              {/* Quick Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Stage Status</label>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => {
                      updateApplicationStatus(selectedApp.id, e.target.value as ApplicationStatus);
                      setSelectedApp({ ...selectedApp, status: e.target.value as ApplicationStatus });
                    }}
                    className="w-full bg-white font-semibold text-slate-800 text-xs py-1.5 px-2 rounded-lg border border-slate-300"
                  >
                    <option value="wishlist">📌 Wishlist / Target</option>
                    <option value="applied">📨 Applied / Sent</option>
                    <option value="assessment">💻 Coding Test</option>
                    <option value="interview">🎙️ Interviewing</option>
                    <option value="offer">🎉 Offer Received</option>
                    <option value="rejected">📁 Closed / Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Priority</label>
                  <select
                    value={selectedApp.priority}
                    onChange={(e) => {
                      const newPri = e.target.value as 'high' | 'medium' | 'low';
                      updateApplication(selectedApp.id, { priority: newPri });
                      setSelectedApp({ ...selectedApp, priority: newPri });
                    }}
                    className="w-full bg-white font-semibold text-slate-800 text-xs py-1.5 px-2 rounded-lg border border-slate-300"
                  >
                    <option value="high">🔥 High Priority</option>
                    <option value="medium">⚡ Medium Priority</option>
                    <option value="low">🌱 Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={selectedApp.interviewDate || ''}
                    onChange={(e) => {
                      updateApplication(selectedApp.id, { interviewDate: e.target.value });
                      setSelectedApp({ ...selectedApp, interviewDate: e.target.value });
                    }}
                    className="w-full bg-white text-xs py-1.5 px-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" /> Action Items & Checklist
                  </h4>
                  <span className="text-xs text-slate-400">
                    {selectedApp.tasks.filter(t => t.completed).length} / {selectedApp.tasks.length} Completed
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedApp.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                        task.completed ? 'bg-emerald-50/50 border-emerald-200 text-slate-500 line-through' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div 
                        className="flex items-center gap-2 cursor-pointer flex-1"
                        onClick={() => {
                          toggleTaskCompletion(selectedApp.id, task.id);
                          setSelectedApp({
                            ...selectedApp,
                            tasks: selectedApp.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
                          });
                        }}
                      >
                        {task.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>{task.label}</span>
                      </div>

                      <button
                        onClick={() => {
                          deleteTaskFromApplication(selectedApp.id, task.id);
                          setSelectedApp({
                            ...selectedApp,
                            tasks: selectedApp.tasks.filter(t => t.id !== task.id)
                          });
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Task Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add task (e.g., 'Review Nextflow pipeline', 'Send follow-up')..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTaskInput.trim()) {
                        addTaskToApplication(selectedApp.id, newTaskInput.trim());
                        setSelectedApp({
                          ...selectedApp,
                          tasks: [...selectedApp.tasks, { id: 'task-' + Date.now(), label: newTaskInput.trim(), completed: false }]
                        });
                        setNewTaskInput('');
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => {
                      if (newTaskInput.trim()) {
                        addTaskToApplication(selectedApp.id, newTaskInput.trim());
                        setSelectedApp({
                          ...selectedApp,
                          tasks: [...selectedApp.tasks, { id: 'task-' + Date.now(), label: newTaskInput.trim(), completed: false }]
                        });
                        setNewTaskInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Notes & Recruiter Contacts */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Personal Application Notes & Tech Prep</label>
                <textarea
                  rows={3}
                  value={selectedApp.notes}
                  onChange={(e) => {
                    updateApplication(selectedApp.id, { notes: e.target.value });
                    setSelectedApp({ ...selectedApp, notes: e.target.value });
                  }}
                  placeholder="Record interview notes, PI questions, technical requirements discussed..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Contact Person / PI</label>
                  <input
                    type="text"
                    value={selectedApp.contactPerson || ''}
                    onChange={(e) => {
                      updateApplication(selectedApp.id, { contactPerson: e.target.value });
                      setSelectedApp({ ...selectedApp, contactPerson: e.target.value });
                    }}
                    placeholder="e.g. Dr. Vinod Scaria"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={selectedApp.contactEmail || ''}
                    onChange={(e) => {
                      updateApplication(selectedApp.id, { contactEmail: e.target.value });
                      setSelectedApp({ ...selectedApp, contactEmail: e.target.value });
                    }}
                    placeholder="e.g. hr@lab.in"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  deleteApplication(selectedApp.id);
                  setSelectedApp(null);
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete from Tracker
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
