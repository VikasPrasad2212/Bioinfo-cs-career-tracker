import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  BookmarkCheck, 
  ShieldCheck, 
  GraduationCap, 
  Code2, 
  Filter,
  Layers,
  ArrowRight,
  Info,
  Send,
  Zap,
  RefreshCw,
  Rss
} from 'lucide-react';
import { InternshipOpportunity, OrgCategory, ApplicationStatus } from '../types';
import { useTracker } from '../context/TrackerContext';

interface DirectoryViewProps {
  onSelectOpportunity: (opp: InternshipOpportunity) => void;
  onNavigateToTracker: () => void;
  onNavigateToEmailGenerator: (opp?: InternshipOpportunity) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ 
  onSelectOpportunity, 
  onNavigateToTracker,
  onNavigateToEmailGenerator
}) => {
  const { opportunities, applications, addToTracker } = useTracker();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [addedModalOpp, setAddedModalOpp] = useState<InternshipOpportunity | null>(null);

  // Live Sync metadata state
  const [liveSyncInfo, setLiveSyncInfo] = useState<{
    lastUpdated?: string;
    status?: string;
    liveNewsAndUpdates?: Array<{ title: string; doiUrl: string; journal: string; pubYear: string }>;
  } | null>(null);

  useEffect(() => {
    fetch('./live_feed.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setLiveSyncInfo(data);
      })
      .catch(() => {
        // Fallback gracefully
      });
  }, []);

  // Derive all unique skills and locations for filter pills
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach(opp => {
      opp.csSkills.forEach(s => set.add(s.split('/')[0].trim()));
    });
    return Array.from(set);
  }, [opportunities]);

  const allLocations = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach(opp => {
      const loc = opp.location.split('/')[0].split('(')[0].trim();
      set.add(loc);
    });
    return Array.from(set);
  }, [opportunities]);

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.csSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        opp.bioFocus.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || opp.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesSkill = selectedSkill === 'all' || opp.csSkills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()));
      const matchesMode = selectedWorkMode === 'all' || opp.workMode.toLowerCase() === selectedWorkMode.toLowerCase();

      return matchesSearch && matchesCategory && matchesLocation && matchesSkill && matchesMode;
    });
  }, [opportunities, searchQuery, selectedCategory, selectedLocation, selectedSkill, selectedWorkMode]);

  // Check if an opportunity is already tracked
  const getTrackedStatus = (oppId: string): ApplicationStatus | null => {
    const found = applications.find(a => a.opportunityId === oppId);
    return found ? found.status : null;
  };

  const getCategoryBadge = (category: OrgCategory) => {
    switch (category) {
      case 'gov_research':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Building2 className="w-3 h-3" />
            Gov Research Lab
          </span>
        );
      case 'top_enterprise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            Top Enterprise
          </span>
        );
      case 'biotech_startup':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Zap className="w-3 h-3" />
            AI Biotech Startup
          </span>
        );
      case 'fellowship':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <GraduationCap className="w-3 h-3" />
            National Fellowship
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-slate-700">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 via-teal-200 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated for Computer Science Freshers & Graduates in India
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Bioinformatics & Computational Biology Internships
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            High-demand opportunities where your programming, algorithms, machine learning, and data engineering skills give you an immediate edge over non-computational applicants.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-xl font-bold text-emerald-400">{opportunities.length}</div>
              <div className="text-xs text-slate-300">Verified Openings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-xl font-bold text-teal-300">₹15k - ₹50k</div>
              <div className="text-xs text-slate-300">Monthly Stipend Range</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-xl font-bold text-amber-300">{applications.length}</div>
              <div className="text-xs text-slate-300">Applications Tracked</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-xl font-bold text-indigo-300">100%</div>
              <div className="text-xs text-slate-300">CS-Friendly Roles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Automated GitHub Actions Live Sync & Feed Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <span className="font-bold text-slate-800">Automated Pipeline Sync:</span>{' '}
            <span className="text-slate-600">
              {liveSyncInfo?.lastUpdated
                ? `Last synchronized with NCBI / Europe PMC repositories on ${new Date(liveSyncInfo.lastUpdated).toLocaleDateString()} at ${new Date(liveSyncInfo.lastUpdated).toLocaleTimeString()}`
                : 'Auto-updating every 12 hours via GitHub Actions workflow'}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
          <Rss className="w-3 h-3" />
          <span>Live Data Feed Active</span>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by institute (CSIR, IISc, Strand), skills (Python, PyTorch, Nextflow, Docker), or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-900 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Type:
          </span>
          {[
            { id: 'all', label: 'All Openings' },
            { id: 'gov_research', label: '🏛️ Premier Gov Labs (CSIR/IISc/NCBS)' },
            { id: 'top_enterprise', label: '🏢 Top Industry (Strand/AstraZeneca)' },
            { id: 'biotech_startup', label: '⚡ AI Biotech Startups' },
            { id: 'fellowship', label: '🎓 National Fellowships (IASc SRFP)' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Location & WorkMode Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location:
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Locations (Pan-India)</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Pune">Pune</option>
            </select>

            <span className="font-semibold text-slate-500 ml-2">Mode:</span>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Modes</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="text-slate-500 text-xs">
            Showing <strong className="text-slate-800">{filteredOpportunities.length}</strong> of {opportunities.length} opportunities
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredOpportunities.map(opp => {
          const trackedStatus = getTrackedStatus(opp.id);

          return (
            <div
              key={opp.id}
              className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between hover:shadow-md ${
                opp.featured ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {getCategoryBadge(opp.category)}
                    {opp.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        High PPO / Stipend
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                    {opp.workMode}
                  </span>
                </div>

                {/* Title & Organization */}
                <h3 
                  onClick={() => onSelectOpportunity(opp)}
                  className="font-bold text-base text-slate-900 hover:text-emerald-600 cursor-pointer transition-colors line-clamp-1"
                  title={opp.title}
                >
                  {opp.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{opp.organization}</span>
                  {opp.isVerified && (
                    <span title="Verified Recruiter/Lab">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </span>
                  )}
                </div>

                {/* Location, Stipend & Duration */}
                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{opp.stipend}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{opp.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="text-[11px] font-bold text-rose-600">Deadline:</span>
                    <span className="truncate">{opp.deadline}</span>
                  </div>
                </div>

                {/* CS Edge Highlight Box */}
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1 mb-1">
                    <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                    CS Freshers Edge:
                  </span>
                  <p className="text-emerald-800 text-[11px] leading-relaxed line-clamp-2">
                    {opp.csCandidateAdvantage}
                  </p>
                </div>

                {/* CS Skills Badges */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Required Tech Stack:</div>
                  <div className="flex flex-wrap gap-1">
                    {opp.csSkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {opp.csSkills.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                        +{opp.csSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectOpportunity(opp)}
                  className="text-xs font-semibold text-slate-700 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  Full Details
                </button>

                <div className="flex items-center gap-2">
                  {/* Cold email quick link */}
                  <button
                    onClick={() => onNavigateToEmailGenerator(opp)}
                    title="Generate tailored Cold Email / SOP for this position"
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>

                  {/* Add to tracker or View in tracker */}
                  {trackedStatus ? (
                    <button
                      onClick={onNavigateToTracker}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tracking ({trackedStatus})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToTracker(opp, 'applied')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Track Application</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No opportunities match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try clearing search keywords or selecting "All Locations" and "All Openings" to see the full list of verified bioinformatics roles.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLocation('all');
              setSelectedSkill('all');
              setSelectedWorkMode('all');
            }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
