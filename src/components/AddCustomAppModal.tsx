import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Plus, 
  Sparkles,
  FileText,
  User,
  Mail
} from 'lucide-react';
import { OrgCategory, ApplicationStatus, TrackedApplication } from '../types';
import { useTracker } from '../context/TrackerContext';

interface AddCustomAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTracker: () => void;
}

export const AddCustomAppModal: React.FC<AddCustomAppModalProps> = ({ isOpen, onClose, onNavigateToTracker }) => {
  const { createCustomApplication } = useTracker();

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<OrgCategory>('gov_research');
  const [location, setLocation] = useState('Bengaluru');
  const [status, setStatus] = useState<ApplicationStatus>('applied');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    createCustomApplication({
      title: title.trim(),
      organization: organization.trim(),
      category,
      location: location.trim(),
      status,
      appliedDate,
      deadlineDate: deadlineDate || undefined,
      interviewDate: interviewDate || undefined,
      stipend: stipend.trim() || undefined,
      contactPerson: contactPerson.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      notes: notes.trim(),
      priority,
      tasks: [
        { id: 't_' + Date.now() + '_1', label: 'Submit CV and GitHub project link', completed: status !== 'wishlist' },
        { id: 't_' + Date.now() + '_2', label: 'Prepare technical interview questions', completed: false }
      ]
    });

    onClose();
    onNavigateToTracker();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Add Custom Application to Live Tracker
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track cold emails, LinkedIn postings, or off-campus bioinformatics applications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Internship / Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bio-Pipeline Engineer Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Organization / Lab Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. IISc Molecular Biophysics / Pfizer"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OrgCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                <option value="gov_research">🏛️ Gov Lab (CSIR/IISc)</option>
                <option value="top_enterprise">🏢 Top Enterprise</option>
                <option value="biotech_startup">⚡ AI Startup</option>
                <option value="fellowship">🎓 Fellowship</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Stipend / CTC</label>
              <input
                type="text"
                placeholder="e.g. ₹30,000 / month"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Initial Stage Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="wishlist">📌 Wishlist</option>
                <option value="applied">📨 Applied</option>
                <option value="assessment">💻 Coding Test</option>
                <option value="interview">🎙️ Interviewing</option>
                <option value="offer">🎉 Offer Received</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                <option value="high">🔥 High Priority</option>
                <option value="medium">⚡ Medium Priority</option>
                <option value="low">🌱 Low Priority</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date Applied</label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Interview Date (Optional)</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Application Deadline (Optional)</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Person / PI</label>
              <input
                type="text"
                placeholder="e.g. Dr. Ramesh (Genomics Lead)"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="e.g. pi@institute.ac.in"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Notes & Follow-up Plan</label>
            <textarea
              rows={2}
              placeholder="e.g. Reached out via alumni referral on LinkedIn. Sent GNN repo demo."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-sans"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Add to Live Tracker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
