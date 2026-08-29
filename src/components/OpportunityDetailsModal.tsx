import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Send, 
  BookmarkCheck, 
  Plus, 
  ShieldCheck, 
  Code2, 
  Brain, 
  FileText, 
  Mail, 
  Share2
} from 'lucide-react';
import { InternshipOpportunity, ApplicationStatus } from '../types';
import { useTracker } from '../context/TrackerContext';

interface OpportunityDetailsModalProps {
  opportunity: InternshipOpportunity | null;
  onClose: () => void;
  onNavigateToEmailGenerator: (opp: InternshipOpportunity) => void;
  onNavigateToTracker: () => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  onClose,
  onNavigateToEmailGenerator,
  onNavigateToTracker
}) => {
  const { applications, addToTracker, updateApplicationStatus } = useTracker();

  if (!opportunity) return null;

  const currentTracked = applications.find(a => a.opportunityId === opportunity.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {opportunity.category.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {opportunity.workMode}
              </span>
              {opportunity.isVerified && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Lab / Org
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {opportunity.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">{opportunity.organization}</span>
              <span>•</span>
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{opportunity.location}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <div className="text-xs text-slate-500 font-medium">Monthly Stipend</div>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">{opportunity.stipend}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Internship Duration</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">{opportunity.duration}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Application Deadline</div>
              <div className="text-sm font-semibold text-rose-600 mt-0.5">{opportunity.deadline}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Batch / Status</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">{opportunity.status}</div>
            </div>
          </div>

          {/* Why CS Freshers Have High Advantage */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2 mb-1.5 text-sm">
              <Code2 className="w-4 h-4 text-emerald-600" />
              Why Computer Science Freshers are Prioritized Here
            </h3>
            <p className="text-emerald-900 text-xs sm:text-sm leading-relaxed">
              {opportunity.csCandidateAdvantage}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 text-sm">Role & Research Overview</h3>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {opportunity.description}
            </p>
          </div>

          {/* Tech Stack & Biological Focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                <Code2 className="w-4 h-4 text-indigo-500" /> Computer Science Skills Needed
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.csSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-indigo-900 border border-indigo-200 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                <Brain className="w-4 h-4 text-emerald-500" /> Biological Domain Focus
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.bioFocus.map((bio, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-emerald-900 border border-emerald-200 shadow-2xs"
                  >
                    {bio}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Application Procedure Guide */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
              <FileText className="w-4 h-4 text-amber-500" /> How to Apply / Official Procedure
            </h4>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {opportunity.applicationProcedure}
            </p>
            {opportunity.contactEmail && (
              <div className="text-xs text-slate-600 pt-1 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Contact / PI Email: <span className="font-mono text-slate-900">{opportunity.contactEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onNavigateToEmailGenerator(opportunity);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-indigo-600" />
            Generate Tailored Cold Email / SOP
          </button>

          <div className="flex items-center gap-2">
            {currentTracked ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTracker();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                Tracked in Kanban ({currentTracked.status})
              </button>
            ) : (
              <button
                onClick={() => {
                  addToTracker(opportunity, 'applied');
                  onClose();
                  onNavigateToTracker();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add to Live Tracker
              </button>
            )}

            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-colors"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
