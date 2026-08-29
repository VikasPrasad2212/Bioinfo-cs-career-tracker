/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrackerProvider } from './context/TrackerContext';
import { Navbar } from './components/Navbar';
import { DirectoryView } from './components/DirectoryView';
import { LiveTracker } from './components/LiveTracker';
import { NotificationCenter } from './components/NotificationCenter';
import { CSReadinessBridge } from './components/CSReadinessBridge';
import { ColdEmailGenerator } from './components/ColdEmailGenerator';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';
import { AddCustomAppModal } from './components/AddCustomAppModal';
import { InternshipOpportunity } from './types';
import { 
  Dna, 
  Github, 
  Sparkles, 
  ExternalLink, 
  Briefcase, 
  Bell, 
  BookOpen, 
  ShieldCheck, 
  Building2,
  Send
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'directory' | 'tracker' | 'notifications' | 'bridge' | 'email_sop'>('directory');
  const [selectedOpportunity, setSelectedOpportunity] = useState<InternshipOpportunity | null>(null);
  const [isCustomAppModalOpen, setIsCustomAppModalOpen] = useState(false);
  const [emailGenTargetOpp, setEmailGenTargetOpp] = useState<InternshipOpportunity | null>(null);

  const handleNavigateToEmailGenerator = (opp?: InternshipOpportunity) => {
    if (opp) {
      setEmailGenTargetOpp(opp);
    }
    setActiveTab('email_sop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOpportunity = (opp: InternshipOpportunity) => {
    setSelectedOpportunity(opp);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation & Live Ticker */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenCustomAppModal={() => setIsCustomAppModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'directory' && (
          <DirectoryView 
            onSelectOpportunity={handleSelectOpportunity}
            onNavigateToTracker={() => {
              setActiveTab('tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToEmailGenerator={handleNavigateToEmailGenerator}
          />
        )}

        {activeTab === 'tracker' && (
          <LiveTracker 
            onOpenCustomAppModal={() => setIsCustomAppModalOpen(true)}
            onNavigateToDirectory={() => {
              setActiveTab('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToEmailGenerator={handleNavigateToEmailGenerator}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationCenter 
            onNavigateToTracker={() => {
              setActiveTab('tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToDirectory={() => {
              setActiveTab('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'bridge' && (
          <CSReadinessBridge 
            onNavigateToEmailGenerator={() => {
              setActiveTab('email_sop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToTracker={() => {
              setActiveTab('tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'email_sop' && (
          <ColdEmailGenerator 
            initialOpportunity={emailGenTargetOpp}
          />
        )}
      </main>

      {/* Opportunity Full Details Modal */}
      <OpportunityDetailsModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onNavigateToEmailGenerator={handleNavigateToEmailGenerator}
        onNavigateToTracker={() => {
          setActiveTab('tracker');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Add Custom Application Modal */}
      <AddCustomAppModal
        isOpen={isCustomAppModalOpen}
        onClose={() => setIsCustomAppModalOpen(false)}
        onNavigateToTracker={() => {
          setActiveTab('tracker');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Comprehensive Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Dna className="w-4 h-4" />
                </div>
                <span>BioInfo<span className="text-emerald-500">CS</span> India</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Empowering Computer Science freshers and engineers to break into India's computational genomics, AI drug discovery, and bioinformatics research ecosystem.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                Top Indian Research Hubs
              </h4>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li><a href="https://www.igib.res.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">CSIR-IGIB (New Delhi)</a></li>
                <li><a href="https://www.ccmb.res.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">CSIR-CCMB (Hyderabad)</a></li>
                <li><a href="https://www.ncbs.res.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">NCBS & InStem (Bengaluru)</a></li>
                <li><a href="https://ccnsb.iiit.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">IIIT-H CCNSB (Hyderabad)</a></li>
                <li><a href="https://www.ibab.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">IBAB Biotech Park (Bengaluru)</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                Industry & Enterprises
              </h4>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li><a href="https://strandls.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Strand Life Sciences</a></li>
                <li><a href="https://www.medgenome.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">MedGenome Labs</a></li>
                <li><a href="https://elucidata.io" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Elucidata (Polly Platform)</a></li>
                <li><a href="https://bugworksresearch.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Bugworks Research (AI Drug Design)</a></li>
                <li><a href="https://mapmygenome.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Mapmygenome India</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                CS Fresher Quick Tools
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('tracker');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium flex items-center justify-between"
                >
                  <span>Open Kanban Tracker</span>
                  <span className="text-[10px] text-emerald-400">Live</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('email_sop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium flex items-center justify-between"
                >
                  <span>Cold Email & SOP Studio</span>
                  <Send className="w-3 h-3 text-indigo-400" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('bridge');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium flex items-center justify-between"
                >
                  <span>ATS Keyword Matcher</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 BioInfoCS India Hub. Built specifically for CS freshers entering Bioinformatics & Computational Biology.
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> All listings verified
              </span>
              <span>•</span>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <AppContent />
    </TrackerProvider>
  );
}
