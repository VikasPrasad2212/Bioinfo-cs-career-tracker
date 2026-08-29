import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Brain, 
  FileCode2, 
  Sparkles, 
  Dna, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Zap, 
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  Briefcase,
  GraduationCap,
  Target,
  ChevronRight,
  RefreshCw,
  FolderGit2,
  HelpCircle,
  FileCheck,
  Send,
  Building2,
  BookmarkCheck,
  Award,
  UserCheck,
  Database,
  Cloud,
  HardDrive
} from 'lucide-react';
import { 
  CS_BIO_SKILL_ROADMAP, 
  ATS_BIOINFO_KEYWORDS, 
  SAMPLE_RESUMES, 
  TARGET_BIOINFO_ROLES,
  SampleResumePreset 
} from '../data/internships';
import { 
  SkillGapAnalysisResult, 
  RoadmapPhase, 
  SkillGapItem 
} from '../types';
import { BioInterviewSimulator } from './BioInterviewSimulator';
import { BioDatabasesAndCloudHub } from './BioDatabasesAndCloudHub';

interface CSReadinessBridgeProps {
  onNavigateToEmailGenerator?: () => void;
  onNavigateToTracker?: () => void;
}

export const CSReadinessBridge: React.FC<CSReadinessBridgeProps> = ({
  onNavigateToEmailGenerator,
  onNavigateToTracker
}) => {
  // Navigation between sub-modules
  const [activeSection, setActiveSection] = useState<'roadmap' | 'databases_cloud' | 'interview' | 'modules'>('roadmap');

  // Existing Roadmap & Code walkthrough state
  const [selectedRoadmapIdx, setSelectedRoadmapIdx] = useState(0);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  
  // Resume & AI Skill Gap state
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_RESUMES[0].id);
  const [selectedTargetRole, setSelectedTargetRole] = useState(TARGET_BIOINFO_ROLES[0].title);
  const [educationLevel, setEducationLevel] = useState('B.Tech in Computer Science & Engineering');

  
  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<SkillGapAnalysisResult | null>(null);
  const [activeRoadmapPhase, setActiveRoadmapPhase] = useState(0);
  const [copiedRoadmap, setCopiedRoadmap] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Checkbox topic tracking state (saved in localStorage)
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('bioinfocs_completed_topics');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bioinfocs_completed_topics', JSON.stringify(completedTopics));
    } catch {
      // ignore
    }
  }, [completedTopics]);

  // Handle Preset selection
  const handleSelectPreset = (preset: SampleResumePreset) => {
    setSelectedPresetId(preset.id);
    setResumeText(preset.text);
    const matchedRole = TARGET_BIOINFO_ROLES.find(r => r.title === preset.targetRole);
    if (matchedRole) {
      setSelectedTargetRole(matchedRole.title);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Match resume text against keywords
  const matchedKeywords = ATS_BIOINFO_KEYWORDS.filter(kw => {
    if (!resumeText.trim()) return false;
    const regex = new RegExp(`\\b${kw.replace('/', '[/ ]')}\\b`, 'i');
    return regex.test(resumeText);
  });

  const missingKeywords = ATS_BIOINFO_KEYWORDS.filter(kw => !matchedKeywords.includes(kw));
  const matchPercentage = resumeText.trim() ? Math.round((matchedKeywords.length / ATS_BIOINFO_KEYWORDS.length) * 100) : 0;

  // Trigger AI-Powered Skill Gap Analysis
  const handleRunAiAnalysis = async () => {
    if (!resumeText.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1100);

    try {
      const response = await fetch('/api/gemini/skill-gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: selectedTargetRole,
          matchedKeywords,
          missingKeywords,
          educationLevel
        })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        setAnalysisResult(data.result);
        setActiveRoadmapPhase(0);
      } else {
        throw new Error('Invalid analysis result structure received.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Skill gap analysis error:', err);
      setErrorMessage(err.message || 'Failed to generate roadmap. Please check connection and try again.');
    } finally {
      setIsGenerating(false);
      setLoadingStep(0);
    }
  };

  // Run initial analysis automatically with preset on first mount
  useEffect(() => {
    handleRunAiAnalysis();
  }, []);

  const toggleTopicCompletion = (topicId: string) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  // Export Full Roadmap as Markdown
  const handleExportRoadmap = () => {
    if (!analysisResult) return;

    const mdContent = `# Personalized Bioinformatics Learning Roadmap
**Target Role:** ${analysisResult.targetRole}
**Readiness Level:** ${analysisResult.readinessLevel} (Score: ${analysisResult.overallFitScore}/100)
**Generated Date:** ${new Date(analysisResult.generatedAt).toLocaleDateString()}

## Executive Summary
${analysisResult.executiveSummary}

## Transferable CS Strengths
${analysisResult.strengthsIdentified.map(s => `- ${s}`).join('\n')}

## Critical Skill Gaps & Estimated Mastery Time
${analysisResult.criticalGaps.map(g => `- **${g.skill}** [${g.category}] (${g.estimatedTimeToMaster}): ${g.whyItMatters}${g.csAnalog ? ` *(CS Analog: ${g.csAnalog})*` : ''}`).join('\n')}

## 4-Phase Step-by-Step Learning Roadmap
${analysisResult.personalizedRoadmap.map(p => `
### Phase ${p.phaseNumber}: ${p.phaseName} (${p.durationWeeks})
**Goal:** ${p.goal}

**Topics to Learn:**
${p.topicsToLearn.map(t => `- [ ] ${t}`).join('\n')}

**Recommended Tools & Libraries:** ${p.recommendedToolsAndLibraries.join(', ')}

**Actionable Capstone Mini-Project:**
- **Title:** ${p.actionableMiniProject.title}
- **Dataset:** ${p.actionableMiniProject.suggestedDataset}
- **Description:** ${p.actionableMiniProject.description}
- **GitHub Deliverable:** ${p.actionableMiniProject.githubDeliverable}

**Recommended Free Resources:**
${p.recommendedFreeResources.map(r => `- [${r.title}] (${r.type}): ${r.urlDescription}`).join('\n')}
`).join('\n')}

## Technical Interview Questions to Prepare
${analysisResult.interviewQuestionsToExpect.map((q, i) => `
${i + 1}. **${q.question}**
   - *Concept Tested:* ${q.conceptTested}
   - *Tip for CS Students:* ${q.tipForCSStudent}
`).join('\n')}

---
*Generated by BioInfoCS India Hub - AI Skill Gap Studio*`;

    navigator.clipboard.writeText(mdContent);
    setCopiedRoadmap(true);
    setTimeout(() => setCopiedRoadmap(false), 2500);
  };

  const handleDownloadRoadmapFile = () => {
    if (!analysisResult) return;
    const blob = new Blob([
      `# Bioinformatics Learning Roadmap - ${analysisResult.targetRole}\n\n` +
      `Readiness: ${analysisResult.readinessLevel} (${analysisResult.overallFitScore}/100)\n\n` +
      analysisResult.executiveSummary + '\n\n' +
      `Generated via BioInfoCS India Hub.`
    ], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bioinformatics_Roadmap_${selectedTargetRole.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Skill Gap Analyzer & Personalized Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            CS-to-Bioinformatics Readiness Bridge & AI Roadmap
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Bridge your Computer Science background directly into genomics, drug discovery, and bioinformatics. Evaluate your CV against India's premier research labs (CSIR-IGIB, CCMB, NCBS) and biotech enterprises to generate an actionable 4-phase project learning roadmap.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSection('roadmap')}
          className={`flex-1 min-w-[170px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'roadmap'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeSection === 'roadmap' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>AI Skill Gap & Roadmap</span>
        </button>

        <button
          onClick={() => setActiveSection('databases_cloud')}
          className={`flex-1 min-w-[170px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
            activeSection === 'databases_cloud'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Database className={`w-4 h-4 ${activeSection === 'databases_cloud' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>Databases & Cloud Hub</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 font-black rounded-full uppercase tracking-wider">
            AWS / SQL
          </span>
        </button>

        <button
          onClick={() => setActiveSection('interview')}
          className={`flex-1 min-w-[170px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
            activeSection === 'interview'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <UserCheck className={`w-4 h-4 ${activeSection === 'interview' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>AI Mock Interview</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-full uppercase tracking-wider">
            Gemini Live
          </span>
        </button>

        <button
          onClick={() => setActiveSection('modules')}
          className={`flex-1 min-w-[170px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'modules'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Code2 className={`w-4 h-4 ${activeSection === 'modules' ? 'text-teal-600' : 'text-slate-400'}`} />
          <span>Code Walkthroughs</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: DATABASES & CLOUD GENOMICS HUB */}
      {/* ========================================================================= */}
      {activeSection === 'databases_cloud' && (
        <BioDatabasesAndCloudHub
          onNavigateToRoadmap={() => setActiveSection('roadmap')}
          onNavigateToInterview={() => setActiveSection('interview')}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION: INTERVIEW PREP & LIVE AI SIMULATOR */}
      {/* ========================================================================= */}
      {activeSection === 'interview' && (
        <BioInterviewSimulator
          initialResumeText={resumeText}
          initialTargetRole={selectedTargetRole}
          onNavigateToEmailGenerator={onNavigateToEmailGenerator}
          onNavigateToTracker={onNavigateToTracker}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION: AI SKILL GAP STUDIO & ROADMAP */}
      {/* ========================================================================= */}
      {activeSection === 'roadmap' && (
        <>
          {/* 6 Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {[
              {
                icon: <Terminal className="w-5 h-5 text-emerald-600" />,
                title: '1. Sequence Algorithms',
                desc: 'String search (KMP, suffix trees), dynamic programming (Needleman-Wunsch), and BWT FM-index.'
              },
              {
                icon: <Layers className="w-5 h-5 text-blue-600" />,
                title: '2. Pipeline Engineering',
                desc: 'Nextflow / Snakemake workflow orchestration, Docker containers, and HPC cluster management (Slurm).'
              },
              {
                icon: <BookmarkCheck className="w-5 h-5 text-teal-600" />,
                title: '3. R & Bioconductor',
                desc: 'Differential gene expression (DESeq2), single-cell transcriptomics (Seurat), and statistical viz (ggplot2).'
              },
              {
                icon: <Database className="w-5 h-5 text-indigo-600" />,
                title: '4. Databases & Cloud',
                desc: 'NCBI Entrez, Ensembl REST, AWS Batch spot pipelines, BigQuery SQL, and DuckDB Parquet variant indexing.'
              },
              {
                icon: <Brain className="w-5 h-5 text-purple-600" />,
                title: '5. AI & Graph Networks',
                desc: 'Graph Neural Networks (PyTorch Geometric) for molecular docking, AlphaFold embeddings, and diffusion models.'
              },
              {
                icon: <FileCode2 className="w-5 h-5 text-amber-600" />,
                title: '6. High-Dim Data Science',
                desc: 'Dimensionality reduction (PCA, UMAP), graph clustering (Leiden), and sparse matrix single-cell genomics.'
              },
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center mb-2.5">
                    {pillar.icon}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{pillar.title}</h3>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Skill Gap Studio & Roadmap */}
          <div id="ai-roadmap-studio" className="bg-white rounded-2xl border-2 border-emerald-600/30 p-6 sm:p-7 shadow-md space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                AI Skill Gap Analysis & Custom Roadmap Studio
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a target specialization, paste or tweak your CV text, and let Gemini AI diagnose your CS transferable skills and synthesize a 4-phase project roadmap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Quick Test Profiles:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_RESUMES.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedPresetId === preset.id
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset.badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Target Role & Education Selection (4 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Target Bioinformatics Specialization
              </label>
              <div className="space-y-2">
                {TARGET_BIOINFO_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedTargetRole(role.title)}
                    className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                      selectedTargetRole === role.title
                        ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      {role.icon === 'Terminal' && <Terminal className="w-4 h-4 text-emerald-600" />}
                      {role.icon === 'Brain' && <Brain className="w-4 h-4 text-purple-600" />}
                      {role.icon === 'Layers' && <Layers className="w-4 h-4 text-blue-600" />}
                      {role.icon === 'Cpu' && <Cpu className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs leading-tight">{role.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{role.labs}</div>
                    </div>
                    {selectedTargetRole === role.title && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Your Academic Background / Degree
              </label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. B.Tech Computer Science & Engineering / M.Sc CS"
              />
            </div>
          </div>

          {/* Resume Editor & ATS Keyword Feedback (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Your Resume Text / Technical Summary
              </label>
              <button
                onClick={() => {
                  setResumeText('');
                  setSelectedPresetId('');
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Clear Text
              </button>
            </div>

            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setSelectedPresetId('');
              }}
              placeholder="Paste your CV text, technical projects, programming languages, and coursework here..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />

            {/* Quick Live Keyword ATS Density Meter */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Keyword Density:</span>
                <span className="font-extrabold text-emerald-700 text-sm">{matchPercentage}%</span>
                <span className="text-slate-500 text-[11px]">({matchedKeywords.length} of {ATS_BIOINFO_KEYWORDS.length} bio keywords detected)</span>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={isGenerating || !resumeText.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isGenerating || !resumeText.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing CS Skills ({loadingStep}/3)...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Generate AI Skill Gap Analysis & Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Error generating roadmap:</span> {errorMessage}
              <div className="mt-1">
                <button
                  onClick={handleRunAiAnalysis}
                  className="font-bold underline text-rose-900 hover:text-rose-950"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* GENERATED AI SKILL GAP RESULTS & PERSONALIZED ROADMAP */}
        {/* ===================================================================== */}
        {analysisResult && (
          <div className="pt-6 border-t border-slate-200 space-y-6 animate-in fade-in duration-300">
            {/* Fit Score & Executive Assessment Header Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    Bioinformatics Readiness Evaluation
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    {analysisResult.readinessLevel}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Evaluated for: <span className="font-bold text-emerald-400">{analysisResult.targetRole}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  <div className="text-center">
                    <div className="text-3xl font-black text-emerald-400">
                      {analysisResult.overallFitScore}<span className="text-sm text-slate-400 font-normal">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      CS Transfer Fit
                    </div>
                  </div>

                  <div className="h-10 w-px bg-slate-700"></div>

                  <div className="text-xs text-slate-300 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>4-Phase Project Plan Ready</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      <span>{analysisResult.criticalGaps.length} Target Skill Milestones</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-1">Executive CS Transition Assessment:</span>
                {analysisResult.executiveSummary}
              </div>

              {/* CS Transferable Strengths */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  ✅ Transferable CS Foundations Identified in Your Profile:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysisResult.strengthsIdentified.map((strength, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-800/70 rounded-lg border border-slate-700 text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Gap Matrix */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Target className="w-4 h-4 text-rose-600" />
                    Critical Skill Gap Diagnostic Matrix
                  </h4>
                  <p className="text-xs text-slate-500">
                    Key domains you must master to qualify for top research positions, mapped to familiar CS concepts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.criticalGaps.map((gap: SkillGapItem, idx: number) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-xs text-slate-900">{gap.skill}</div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        gap.category === 'Critical' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : gap.category === 'Recommended' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {gap.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {gap.whyItMatters}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      {gap.csAnalog && (
                        <span className="text-indigo-700 font-medium">
                          <strong>CS Analog:</strong> {gap.csAnalog}
                        </span>
                      )}
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {gap.estimatedTimeToMaster}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Phase Step-by-Step Personalized Learning Roadmap */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    Personalized 4-Phase Project-Based Learning Roadmap
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click through each milestone phase to inspect weekly topics, recommended toolkits, and capstone GitHub projects.
                  </p>
                </div>

                {/* Export & Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportRoadmap}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedRoadmap ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Roadmap Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadRoadmapFile}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Plan</span>
                  </button>
                </div>
              </div>

              {/* Phase Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {analysisResult.personalizedRoadmap.map((phase: RoadmapPhase, idx: number) => (
                  <button
                    key={phase.phaseNumber}
                    onClick={() => setActiveRoadmapPhase(idx)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      activeRoadmapPhase === idx
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-emerald-500'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                        activeRoadmapPhase === idx ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Phase {phase.phaseNumber}
                      </span>
                      <span className={`text-[11px] font-semibold ${activeRoadmapPhase === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                        {phase.durationWeeks}
                      </span>
                    </div>
                    <div className="font-bold text-xs mt-2 line-clamp-1">{phase.phaseName}</div>
                  </button>
                ))}
              </div>

              {/* Active Phase Detailed View */}
              {(() => {
                const currentPhase = analysisResult.personalizedRoadmap[activeRoadmapPhase];
                if (!currentPhase) return null;

                return (
                  <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                            Phase {currentPhase.phaseNumber} of 4 • {currentPhase.durationWeeks}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 mt-1">
                          {currentPhase.phaseName}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">
                          <strong>Core Milestone Goal:</strong> {currentPhase.goal}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {currentPhase.recommendedToolsAndLibraries.map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-white rounded-md text-[11px] font-bold text-slate-700 border border-slate-200">
                            🛠️ {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Topics Checklist with Interactive Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          Curriculum Topics (Check off as you complete):
                        </span>
                      </div>

                      <div className="space-y-2">
                        {currentPhase.topicsToLearn.map((topic, i) => {
                          const topicKey = `p${currentPhase.phaseNumber}_t${i}`;
                          const isDone = !!completedTopics[topicKey];

                          return (
                            <label
                              key={i}
                              onClick={() => toggleTopicCompletion(topicKey)}
                              className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer select-none ${
                                isDone 
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => {}} // handled by parent onClick
                                className="mt-0.5 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
                              />
                              <div className="text-xs flex-1">
                                <span className={isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold'}>
                                  {topic}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actionable Capstone Mini-Project Card */}
                    <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl border border-indigo-800 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-indigo-300" />
                          <span className="font-bold text-xs text-indigo-200 uppercase tracking-wider">
                            Phase {currentPhase.phaseNumber} Capstone GitHub Project
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                          Portfolio Deliverable
                        </span>
                      </div>

                      <h5 className="font-extrabold text-sm text-white">
                        {currentPhase.actionableMiniProject.title}
                      </h5>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {currentPhase.actionableMiniProject.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                          <span className="text-indigo-300 font-bold block mb-0.5">Suggested Open Dataset:</span>
                          <span className="text-slate-200 font-mono text-[11px]">{currentPhase.actionableMiniProject.suggestedDataset}</span>
                        </div>
                        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                          <span className="text-emerald-300 font-bold block mb-0.5">GitHub Repository Output:</span>
                          <span className="text-slate-200 font-mono text-[11px]">{currentPhase.actionableMiniProject.githubDeliverable}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Free Resources */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        Curated Free Learning Resources:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentPhase.recommendedFreeResources.map((res, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-slate-900">{res.title}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{res.urlDescription}</div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 shrink-0">
                              {res.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Technical Interview Questions for CS Freshers */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    Bioinformatics Technical Interview Questions (Targeting CS Backgrounds)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Frequently asked in screening calls at CSIR-IGIB, CCMB, Strand, and AstraZeneca.
                  </p>
                </div>

                <button
                  onClick={() => setActiveSection('interview')}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Practice in Live AI Mock Interview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {analysisResult.interviewQuestionsToExpect.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 text-sm flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item.question}</span>
                    </div>

                    <div className="pl-7 space-y-1.5">
                      <div className="text-slate-600">
                        <strong className="text-slate-800">Concept Tested:</strong> {item.conceptTested}
                      </div>
                      <div className="p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-200 text-emerald-950 font-medium">
                        <strong className="text-emerald-900">💡 Tactical Tip for CS Students:</strong> {item.tipForCSStudent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Matching Roles & Lab Recommendations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    Top Matching Roles & Research Labs in India
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct opportunities where your CS background provides immediate leverage.
                  </p>
                </div>

                {onNavigateToEmailGenerator && (
                  <button
                    onClick={onNavigateToEmailGenerator}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate Cold Email to PI</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResult.topMatchingRolesInIndia.map((role, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{role.roleTitle}</div>
                      <div className="text-xs font-semibold text-emerald-700 mt-1">
                        {role.exampleOrganizations.join(' • ')}
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {role.whyGoodFit}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTargetRole(role.roleTitle);
                          setActiveSection('interview');
                        }}
                        className="flex-1 py-1.5 px-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Mock Interview</span>
                      </button>

                      {onNavigateToTracker && (
                        <button
                          onClick={onNavigateToTracker}
                          className="py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 text-center flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Tracker</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE CODE MODULES (WALKTHROUGH) */}
      {/* ========================================================================= */}
      {(activeSection === 'modules' || activeSection === 'roadmap') && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-600" />
            Core Bioinformatics Code Modules for CS Students
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Explore industry-standard code patterns used at CSIR-IGIB, Strand Life Sciences, and AstraZeneca.
          </p>
        </div>

        {/* Module Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CS_BIO_SKILL_ROADMAP.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedRoadmapIdx(idx)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                selectedRoadmapIdx === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mb-1 ${
                selectedRoadmapIdx === idx ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {item.tag}
              </span>
              <div className="font-bold text-xs line-clamp-1">{item.title}</div>
              <div className={`text-[11px] mt-0.5 ${selectedRoadmapIdx === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                {item.timeEst}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Module Detail */}
        {(() => {
          const current = CS_BIO_SKILL_ROADMAP[selectedRoadmapIdx];
          return (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{current.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{current.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-slate-700 border border-slate-200">
                    Difficulty: {current.difficulty}
                  </span>
                </div>
              </div>

              {/* CS vs Bio Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700 flex items-center gap-1.5 mb-1">
                    <Terminal className="w-3.5 h-3.5" /> What You Already Know (CS Concept):
                  </div>
                  <div className="text-slate-700 font-medium">{current.csConcept}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                    <Dna className="w-3.5 h-3.5" /> Biology Translation:
                  </div>
                  <div className="text-slate-700 font-medium">{current.bioConcept}</div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 text-slate-200 border border-slate-800">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                  <span className="font-mono text-slate-400">Implementation Example</span>
                  <button
                    onClick={() => handleCopyCode(current.codeSnippet, selectedRoadmapIdx)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCodeIdx === selectedRoadmapIdx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-xs">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed">
                  <code>{current.codeSnippet}</code>
                </pre>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Biological File Formats Cheat Sheet for Programmers */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-indigo-600" />
          Biological File Formats Demystified for CS Engineers
        </h2>
        <p className="text-xs text-slate-500">
          In interview coding tests, you will likely be asked to parse or analyze one of these core file and object structures:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-mono font-bold text-sm text-indigo-700">.FASTA / .FA</div>
            <div className="font-semibold text-slate-800 mt-1">Raw Sequences</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Header starting with <code className="bg-slate-200 px-1 rounded">&gt;seq_id</code> followed by raw DNA/Protein characters (ATCG or amino acids).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-mono font-bold text-sm text-emerald-700">.FASTQ / .FQ</div>
            <div className="font-semibold text-slate-800 mt-1">Raw Sequencing Reads + Phred Scores</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              4 lines per read: Header (@), DNA string, separator (+), and ASCII quality score string (Phred+33).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-mono font-bold text-sm text-purple-700">.SAM / .BAM</div>
            <div className="font-semibold text-slate-800 mt-1">Sequence Alignment Map</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Tab-separated coordinates mapping reads against a reference genome. BAM is the indexed binary compressed version (via Samtools).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-mono font-bold text-sm text-amber-700">.VCF</div>
            <div className="font-semibold text-slate-800 mt-1">Variant Call Format</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Tab-delimited table recording genetic mutations (SNPs, insertions, deletions), chromosomal positions, and genotype quality.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-mono font-bold text-sm text-teal-700">.RDS / SummarizedExperiment</div>
            <div className="font-semibold text-slate-800 mt-1">R & Bioconductor S4 Object</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Standard R container matrix housing RNA-seq count assays, sample phenotypes (<code className="bg-slate-200 px-0.5 rounded">colData</code>), and gene ranges (<code className="bg-slate-200 px-0.5 rounded">rowData</code>).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-mono font-bold text-sm text-rose-700">.PDB / .mmCIF</div>
            <div className="font-semibold text-slate-800 mt-1">Protein 3D Coordinates</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              3D Cartesian (x, y, z) atomic coordinates of protein structures output by Cryo-EM or predicted by AlphaFold.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-mono font-bold text-sm text-cyan-700">.h5ad (AnnData)</div>
            <div className="font-semibold text-slate-800 mt-1">HDF5 Single-Cell Matrices</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Hierarchical sparse matrix container storing gene expression counts (cells x genes), PCA coordinates, and cell annotations.
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
