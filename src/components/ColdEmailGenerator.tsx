import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  Sparkles, 
  Building2, 
  User, 
  Send, 
  FileText, 
  CheckCircle2, 
  Lightbulb, 
  ExternalLink,
  Code2
} from 'lucide-react';
import { InternshipOpportunity } from '../types';

interface ColdEmailGeneratorProps {
  initialOpportunity?: InternshipOpportunity | null;
}

export const ColdEmailGenerator: React.FC<ColdEmailGeneratorProps> = ({ initialOpportunity }) => {
  const [candidateName, setCandidateName] = useState('Rahul Sharma');
  const [collegeName, setCollegeName] = useState('National Institute of Technology (NIT)');
  const [degree, setDegree] = useState('B.Tech in Computer Science & Engineering');
  const [targetLab, setTargetLab] = useState(initialOpportunity ? initialOpportunity.organization : 'CSIR-IGIB (Institute of Genomics and Integrative Biology)');
  const [piName, setPiName] = useState(
    initialOpportunity?.contactEmail?.includes('vinod') ? 'Dr. Vinod Scaria' : 
    initialOpportunity?.category === 'gov_research' ? 'Respected Professor / Principal Investigator' : 'Hiring Manager / Talent Team'
  );
  const [researchTopic, setResearchTopic] = useState(
    initialOpportunity ? initialOpportunity.bioFocus.join(', ') : 'High-throughput Next-Generation Sequencing (NGS) pipeline optimization and variant calling algorithms'
  );
  const [csStrengths, setCsStrengths] = useState(
    initialOpportunity ? initialOpportunity.csSkills.join(', ') : 'Python, Nextflow, Docker, Linux Shell Scripting, PyTorch, and Data Structures & Algorithms'
  );
  const [githubUrl, setGithubUrl] = useState('https://github.com/rahul-cs');
  const [duration, setDuration] = useState('6 Months (Jan 2027 - June 2027 / Immediate)');
  
  const [activeTab, setActiveTab] = useState<'email' | 'sop'>('email');
  const [copied, setCopied] = useState(false);

  // Update when initialOpportunity changes
  useEffect(() => {
    if (initialOpportunity) {
      setTargetLab(initialOpportunity.organization);
      setResearchTopic(initialOpportunity.bioFocus.join(', '));
      setCsStrengths(initialOpportunity.csSkills.join(', '));
    }
  }, [initialOpportunity]);

  const emailSubject = `Prospective Research Trainee / Intern Application - ${candidateName} (${degree}, ${collegeName})`;

  const generatedEmail = `Subject: ${emailSubject}

Dear ${piName},

I hope this email finds you well.

My name is ${candidateName}, currently pursuing my ${degree} at ${collegeName}. I am writing to express my strong enthusiasm for joining your laboratory at ${targetLab} as a Project Trainee / Research Intern for a duration of ${duration}.

I have been closely following your lab's pioneering contributions in ${researchTopic}. As a Computer Science student with a focused interest in computational biology and high-throughput biological data processing, I am eager to apply my software engineering and algorithmic background to accelerate your computational workflows.

Key technical competencies I would bring to your team:
• Core Programming & Scripting: Proficient in ${csStrengths}, with experience building scalable data processing scripts.
• Computational Workflows: Hands-on experience with Linux environments, Docker containerization, and automated data pipelines.
• Algorithmic Problem Solving: Strong grasp of data structures, graph theory, and parallel computing principles.

You can inspect my open-source projects and bioinformatics code repositories at my GitHub profile: ${githubUrl}

I have attached my detailed Curriculum Vitae (CV) and academic transcripts for your review. I would be deeply grateful for the opportunity to discuss how my computational skillset can contribute to ongoing research projects in your group.

Thank you very much for your time and consideration.

Sincerely,
${candidateName}
${degree}
${collegeName}
GitHub: ${githubUrl}`;

  const generatedSOP = `STATEMENT OF PURPOSE: COMPUTATIONAL BIOLOGY & BIOINFORMATICS

Applicant: ${candidateName}
Academic Background: ${degree}, ${collegeName}
Target Program: Research Trainee at ${targetLab}

Biological sciences are experiencing a computational revolution where high-throughput data processing, algorithm efficiency, and machine learning are critical to unlocking genomic insights. Coming from a Computer Science background, I have developed strong algorithmic rigor, data engineering capabilities, and proficiency in modern workflow frameworks (${csStrengths}).

My academic interests center on ${researchTopic}. Rather than viewing biological systems solely through classical wet-lab perspectives, I am passionate about modeling biological data as high-dimensional graphs, sequence matrices, and scalable distributed pipelines. 

At ${targetLab}, I aim to leverage my software engineering foundations in Python, Linux, and parallel computing to build reproducible pipelines, optimize sequence alignment algorithms, and accelerate data analysis. This internship will provide vital immersion in real-world biomedical datasets while allowing me to contribute computational horsepower to your esteemed research mission.`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'email' ? generatedEmail : generatedSOP;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Cold Email & SOP Studio for CS Candidates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              High Response Rate Formula
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate customized, professional outreach emails and Statements of Purpose tailored specifically for contacting Indian bioinformatics professors and biotech recruiters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              Your Candidate Profile & Target Lab
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Degree Program</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">College / University</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Organization / Lab</label>
                <input
                  type="text"
                  value={targetLab}
                  onChange={(e) => setTargetLab(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">PI / Recruiter Name</label>
                <input
                  type="text"
                  value={piName}
                  onChange={(e) => setPiName(e.target.value)}
                  placeholder="e.g. Dr. Vinod Scaria"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lab's Research Topic</label>
                <textarea
                  rows={2}
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your CS Skills to Highlight</label>
                <input
                  type="text"
                  value={csStrengths}
                  onChange={(e) => setCsStrengths(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GitHub Portfolio Link</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Desired Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              Rules for 80%+ PI Email Open Rates
            </div>
            <ul className="list-disc list-inside text-indigo-900 text-[11px] space-y-1">
              <li><strong>Send between 8:30 AM - 9:30 AM IST (Tuesday - Thursday)</strong> when professors read morning inboxes.</li>
              <li><strong>Always attach a 1-page PDF CV</strong> named <code>CV_{candidateName.replace(' ', '_')}_CS.pdf</code>.</li>
              <li><strong>Link a GitHub repo</strong> containing at least one clean Python script or sample data pipeline.</li>
            </ul>
          </div>
        </div>

        {/* Right Output Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            {/* Header Tabs */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('email')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'email' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Cold Outreach Email
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('sop')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'sop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> 200-Word Statement of Purpose
                  </span>
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Output Preview */}
            <div className="p-5 overflow-y-auto max-h-[550px] bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
              {activeTab === 'email' ? generatedEmail : generatedSOP}
            </div>

            {/* Bottom Actions */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">Format: Ready to paste into Gmail / Outlook</span>
              <button
                onClick={handleCopy}
                className="text-emerald-700 font-bold hover:underline"
              >
                {copied ? '✓ Copied' : '1-Click Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
