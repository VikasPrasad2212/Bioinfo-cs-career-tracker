import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Terminal,
  Sparkles,
  Award,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  Download,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  FileText,
  UserCheck,
  Zap,
  BookmarkCheck,
  Dna,
  Layers,
  ArrowRight,
  RefreshCw,
  Target,
  GraduationCap
} from 'lucide-react';
import { 
  TARGET_BIOINFO_ROLES, 
  SAMPLE_RESUMES 
} from '../data/internships';
import { 
  MockInterviewTurn, 
  InterviewSessionReport, 
  InterviewSessionState 
} from '../types';

interface BioInterviewSimulatorProps {
  initialResumeText?: string;
  initialTargetRole?: string;
  onNavigateToEmailGenerator?: () => void;
  onNavigateToTracker?: () => void;
}

export const INDIAN_BIOINFO_LABS = [
  {
    id: 'csir_igib',
    name: 'CSIR-IGIB (New Delhi)',
    fullName: 'CSIR - Institute of Genomics and Integrative Biology',
    specialty: 'Nextflow Genomics Pipelines, Variant Calling, Rare Disease & COVID Genomics',
    piName: 'Dr. Anurag Agrawal / Dr. Vinod Scaria',
    focusTags: ['Nextflow', 'BWA/GATK', 'Variant Calling', 'Linux HPC']
  },
  {
    id: 'csir_ccmb',
    name: 'CSIR-CCMB (Hyderabad)',
    fullName: 'CSIR - Centre for Cellular and Molecular Biology',
    specialty: 'Statistical Genomics, R & Bioconductor, RNA-seq Differential Expression',
    piName: 'Dr. Rakesh K. Mishra / Dr. Somdatta Sinha',
    focusTags: ['R / Bioconductor', 'DESeq2', 'Statistical Testing', 'Gene Regulation']
  },
  {
    id: 'ncbs_instem',
    name: 'NCBS & InStem (Bengaluru)',
    fullName: 'National Centre for Biological Sciences & Institute for Stem Cell Science',
    specialty: 'Single-Cell Transcriptomics, Biophysical Simulations, Cryo-EM & Systems Biology',
    piName: 'Dr. Mukund Thattai / Dr. Satyajit Mayor',
    focusTags: ['Single-Cell (Seurat/Scanpy)', 'PCA/UMAP', 'Molecular Modeling', 'Python']
  },
  {
    id: 'strand_life_sciences',
    name: 'Strand Life Sciences & MedGenome (Bengaluru)',
    fullName: 'Strand Life Sciences & MedGenome Diagnostics Labs',
    specialty: 'Clinical NGS Pipelines, High-Throughput Variant Interpretation, Cloud Software',
    piName: 'Dr. Ramesh Hariharan / Dr. V. L. Ramprasad',
    focusTags: ['Clinical Variant DBs', 'Python/C++', 'Cloud Scaling', 'Docker/K8s']
  },
  {
    id: 'bugworks_iiith',
    name: 'Bugworks Research & IIIT-H CCNSB (Bengaluru / Hyderabad)',
    fullName: 'Bugworks Biotech & IIIT-Hyderabad Centre for Computational Natural Sciences',
    specialty: 'AI-Driven Drug Discovery, Graph Neural Networks, Molecular Docking & PyTorch',
    piName: 'Dr. Anand Anandkumar / Prof. Deva Priyakumar',
    focusTags: ['Graph Neural Networks', 'PyTorch Geometric', 'RDKit', 'Molecular Dynamics']
  }
];

const STATIC_QUESTION_BANK = [
  {
    id: 'bank-1',
    category: 'Algorithms & String Search' as const,
    question: 'How does the Burrows-Wheeler Transform (BWT) enable aligning millions of sequencing reads in seconds?',
    lab: 'CSIR-IGIB / Strand Life Sciences',
    concept: 'String search algorithms & suffix array compression (FM-index)',
    csTip: 'Explain BWT as a reversible permutation of a string that clusters identical characters, combined with an FM-index to achieve O(m) pattern lookup time independent of genome length.',
    modelAnswer: 'Aligners like BWA-MEM convert the 3-billion base pair reference genome into a Burrows-Wheeler Transform (BWT) combined with an FM-Index (compressed suffix array). This reduces the memory footprint from ~40GB (standard suffix tree) to ~2.5GB (fits in RAM) and enables O(m) exact pattern match lookup where m is read length, completely independent of genome size.'
  },
  {
    id: 'bank-2',
    category: 'R / Statistical Genomics' as const,
    question: 'Why do we use the Negative Binomial distribution instead of Poisson for RNA-seq differential expression in DESeq2 / EdgeR?',
    lab: 'CSIR-CCMB / NCBS',
    concept: 'Biological overdispersion vs technical variance',
    csTip: 'In RNA-seq count data, biological variance between replicates causes overdispersion (variance exceeds the mean), violating Poissons mean=variance assumption. Negative Binomial introduces a dispersion parameter (alpha) to model this biological stochasticity.',
    modelAnswer: 'While technical sequencing replicates follow a Poisson distribution (mean = variance), biological replicates exhibit extra biological variation known as overdispersion (variance > mean). Negative Binomial incorporates a dispersion parameter alpha where Variance = mu + alpha * mu^2, preventing severe false-positive inflation in differential gene expression.'
  },
  {
    id: 'bank-3',
    category: 'NGS Pipelines & HPC' as const,
    question: 'What is the purpose of CIGAR strings in SAM/BAM files, and how does Samtools index coordinates for O(log N) lookups?',
    lab: 'CSIR-IGIB / MedGenome',
    concept: 'BAM binary alignment indexing (BAI) and alignment operators',
    csTip: 'CIGAR (Concise Idiosyncratic Gapped Alignment Report) encodes match/mismatch (M), insertion (I), and deletion (D) offsets. Samtools builds an R-tree-like genomic binning index (BAI) to fetch reads overlapping any chromosomal locus in O(log N) time.',
    modelAnswer: 'A CIGAR string compactly encodes alignment operations against the reference genome (e.g. 75M2I23M indicates 75 matches, 2 base insertions, and 23 matches). Samtools uses an R-tree hierarchical binning algorithm (BAI index) that segments the chromosome into multi-level bins (16kb to 512Mb), enabling instant coordinate-range seek without scanning gigabytes of linear data.'
  },
  {
    id: 'bank-4',
    category: 'AI & Structural Biology' as const,
    question: 'Why do Graph Neural Networks (GNNs) represent small molecules better than traditional grid-based CNNs?',
    lab: 'Bugworks Research / IIIT-H CCNSB',
    concept: 'Non-Euclidean topological molecular graphs & rotational invariance',
    csTip: 'Molecules are naturally permutation-invariant graphs where atoms are node feature vectors and chemical bonds are edge features. Standard CNNs require rigid 2D/3D pixel grids which are sensitive to arbitrary rotation and translation.',
    modelAnswer: 'Molecules are non-Euclidean graphs defined by topology rather than rigid coordinates. Graph Neural Networks (Message Passing / Graph Attention) operate directly on atoms as nodes and chemical bonds as edges, providing natural permutation invariance and capturing multi-hop covalent/spatial interactions without artificial 3D voxelization.'
  },
  {
    id: 'bank-5',
    category: 'Databases & Cloud Genomics' as const,
    question: 'Why is Apache Parquet with DuckDB or BigQuery preferred over relational PostgreSQL or flat VCF.gz for multi-billion variant analytics?',
    lab: 'Strand Life Sciences / CSIR-IGIB',
    concept: 'Columnar storage, projection & predicate pushdown, and distributed partition pruning',
    csTip: 'Relational row-oriented databases (PostgreSQL) load entire multi-column rows into memory. Parquet stores data column-by-column, allowing DuckDB/BigQuery to read only the specific 3 requested columns (projection pushdown) and skip millions of non-matching rows using min/max chunk statistics (predicate pushdown).',
    modelAnswer: 'Flat VCF.gz files require sequential decompression, while relational row stores (Postgres) suffer severe I/O bottlenecks when aggregating across billions of variant calls. Apache Parquet stores genomic variants in columnar chunks with Snappy/Zstandard compression. Analytical engines like DuckDB, Google BigQuery, or AWS Athena execute vectorized SIMD operations with projection pushdown (only reading queried columns like chrom, pos, allele_freq) and predicate pushdown (skipping irrelevant genomic partitions), slashing query runtimes from minutes to sub-second.'
  },
  {
    id: 'bank-6',
    category: 'Databases & Cloud Genomics' as const,
    question: 'How do you architect a scalable, cost-optimized NGS pipeline on AWS utilizing Nextflow and AWS Batch spot instances?',
    lab: 'MedGenome / Elucidata / AstraZeneca',
    concept: 'Cloud object storage, spot instance orchestration, Docker containerization, and S3 lifecycle rules',
    csTip: 'Explain how Nextflow decouples process logic from execution environments by dispatching each step (BWA, Samtools, GATK) as an isolated Docker task on AWS Batch EC2 Spot instances (up to 70% cheaper than on-demand), reading and streaming FASTQ/BAM assets directly from Amazon S3.',
    modelAnswer: 'A modern cloud genomics architecture stores raw FASTQ and reference genomes in Amazon S3 buckets with intelligent tiering. A Nextflow workflow manager orchestrates tasks via the AWS Batch executor. Each pipeline step (e.g. BWA alignment, GATK variant calling) executes inside an isolated Docker container on ephemeral EC2 Spot instances, providing 60-70% cost savings. Nextflow maintains process checkpoints in S3 so that any spot instance preemption triggers automatic re-execution of only the interrupted container rather than restarting the entire workflow.'
  },
  {
    id: 'bank-7',
    category: 'R / Statistical Genomics' as const,
    question: 'What is the False Discovery Rate (FDR) and why is Benjamini-Hochberg correction essential when testing 20,000 genes?',
    lab: 'CSIR-CCMB / ACTREC',
    concept: 'Multiple hypothesis testing and Type I error control',
    csTip: 'Testing 20,000 genes at standard p < 0.05 yields ~1,000 false positives by chance alone. Benjamini-Hochberg controls the expected proportion of false discoveries among rejected null hypotheses.',
    modelAnswer: 'In genome-wide transcriptome experiments, simultaneously testing 20,000 null hypotheses at alpha = 0.05 will yield approximately 1,000 false positive biomarker genes purely due to random chance. The Benjamini-Hochberg procedure ranks raw p-values and controls the False Discovery Rate (FDR q-value) to ensure that only a designated percentage (e.g. < 5%) of the identified significant genes are false positives.'
  }
];

export const BioInterviewSimulator: React.FC<BioInterviewSimulatorProps> = ({
  initialResumeText = SAMPLE_RESUMES[0].text,
  initialTargetRole = TARGET_BIOINFO_ROLES[0].title,
  onNavigateToEmailGenerator,
  onNavigateToTracker
}) => {
  // Mode: 'roleplay' (Live AI Interviewer) vs 'bank' (Practice Question Bank)
  const [activeMode, setActiveMode] = useState<'roleplay' | 'bank'>('roleplay');

  // Setup configuration state
  const [selectedLab, setSelectedLab] = useState(INDIAN_BIOINFO_LABS[0]);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [difficulty, setDifficulty] = useState<'Fresher / Project Trainee' | 'Junior Bio-Pipeline Engineer' | 'Research Fellow / Specialist'>('Fresher / Project Trainee');
  const [questionCount, setQuestionCount] = useState(4);
  const [resumeSnippet, setResumeSnippet] = useState(initialResumeText);

  // Active session state
  const [session, setSession] = useState<InterviewSessionState | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedBankId, setExpandedBankId] = useState<string | null>('bank-1');

  // Voice synthesis ref
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak text helper
  const speakText = (text: string) => {
    if (!speechSynthRef.current) return;
    speechSynthRef.current.cancel(); // Stop any active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    speechSynthRef.current.speak(utterance);
  };

  const stopSpeech = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  // Speech Recognition (Speech to Text)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentAnswer(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Start new Interview Session
  const handleStartInterview = async () => {
    setIsStartingSession(true);
    setErrorMessage(null);
    stopSpeech();

    try {
      const response = await fetch('/api/gemini/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          targetLab: `${selectedLab.name} - ${selectedLab.specialty}`,
          difficulty,
          resumeSnippet,
          candidateBackground: 'B.Tech in Computer Science & Engineering',
          totalQuestions: questionCount
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.result || !data.result.firstQuestion) {
        throw new Error('Invalid interview response received.');
      }

      const newSession: InterviewSessionState = {
        sessionId: data.result.sessionId || `session-${Date.now()}`,
        targetRole,
        targetLab: selectedLab.name,
        interviewerPersona: data.result.interviewerPersona,
        difficulty,
        totalQuestions: questionCount,
        currentQuestionIndex: 0,
        turns: [
          {
            id: data.result.firstQuestion.id,
            questionNumber: 1,
            question: data.result.firstQuestion.question,
            category: data.result.firstQuestion.category,
            conceptTested: data.result.firstQuestion.conceptTested,
            hintForCS: data.result.firstQuestion.hintForCS,
            timestamp: new Date().toISOString()
          }
        ],
        isCompleted: false
      };

      setSession(newSession);
      setCurrentAnswer('');
      setShowHint(false);
      setShowModelAnswer(false);

      if (isSpeechEnabled && data.result.firstQuestion.question) {
        speakText(data.result.firstQuestion.question);
      }
    } catch (err: any) {
      console.error('Failed to start interview:', err);
      setErrorMessage(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setIsStartingSession(false);
    }
  };

  // Submit Answer for current question
  const handleSubmitAnswer = async () => {
    if (!session || !currentAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setErrorMessage(null);
    stopSpeech();

    const currentTurn = session.turns[session.currentQuestionIndex];

    try {
      const response = await fetch('/api/gemini/interview/evaluate-and-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          targetRole: session.targetRole,
          targetLab: session.targetLab,
          difficulty: session.difficulty,
          questionNumber: currentTurn.questionNumber,
          totalQuestions: session.totalQuestions,
          question: currentTurn.question,
          conceptTested: currentTurn.conceptTested,
          category: currentTurn.category,
          userAnswer: currentAnswer,
          previousTurns: session.turns.slice(0, session.currentQuestionIndex)
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.result || !data.result.feedback) {
        throw new Error('Invalid feedback structure received.');
      }

      const updatedTurns = [...session.turns];
      updatedTurns[session.currentQuestionIndex] = {
        ...currentTurn,
        userAnswer: currentAnswer,
        feedback: data.result.feedback
      };

      // Check if there is a next question
      if (!data.result.isLastQuestion && data.result.nextQuestion) {
        updatedTurns.push({
          id: data.result.nextQuestion.id,
          questionNumber: data.result.nextQuestion.questionNumber,
          question: data.result.nextQuestion.question,
          category: data.result.nextQuestion.category,
          conceptTested: data.result.nextQuestion.conceptTested,
          hintForCS: data.result.nextQuestion.hintForCS,
          timestamp: new Date().toISOString()
        });

        setSession({
          ...session,
          turns: updatedTurns,
          currentQuestionIndex: session.currentQuestionIndex + 1
        });

        setCurrentAnswer('');
        setShowHint(false);
        setShowModelAnswer(false);

        if (isSpeechEnabled && data.result.nextQuestion.question) {
          speakText(data.result.nextQuestion.question);
        }
      } else {
        // Last question answered - Generate final report card!
        setSession({
          ...session,
          turns: updatedTurns
        });
        await handleGenerateReport(updatedTurns);
      }
    } catch (err: any) {
      console.error('Evaluation error:', err);
      setErrorMessage(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Generate Final Report Card
  const handleGenerateReport = async (turns: MockInterviewTurn[]) => {
    if (!session) return;
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/gemini/interview/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          targetRole: session.targetRole,
          targetLab: session.targetLab,
          difficulty: session.difficulty,
          turns
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate report card: ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        setSession(prev => prev ? {
          ...prev,
          isCompleted: true,
          finalReport: data.result
        } : null);
      }
    } catch (err: any) {
      console.error('Report generation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Quick phrase pill insert
  const handleInsertPhrase = (phrase: string) => {
    setCurrentAnswer(prev => (prev ? `${prev} ${phrase}` : phrase));
  };

  // Export full transcript as Markdown
  const handleDownloadTranscript = () => {
    if (!session) return;

    let md = `# Technical Bioinformatics Mock Interview Report\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Candidate Background:** B.Tech Computer Science & Engineering\n`;
    md += `**Target Role:** ${session.targetRole}\n`;
    md += `**Target Lab:** ${session.targetLab}\n`;
    md += `**Interviewer:** ${session.interviewerPersona.name} (${session.interviewerPersona.title}, ${session.interviewerPersona.organization})\n\n`;

    if (session.finalReport) {
      md += `## 🏆 Final Performance Summary\n\n`;
      md += `- **Overall Score:** ${session.finalReport.overallScore}/100\n`;
      md += `- **Hiring Recommendation:** ${session.finalReport.hiringDecision}\n`;
      md += `- **Algorithmic CS Intuition:** ${session.finalReport.algorithmicIntuitionScore}%\n`;
      md += `- **Biological Accuracy:** ${session.finalReport.biologicalDomainAccuracyScore}%\n`;
      md += `- **CS-to-Bio Translation:** ${session.finalReport.csTranslationScore}%\n\n`;
      md += `### Committee Assessment\n${session.finalReport.interviewerSummary}\n\n`;
      
      md += `### Top Strengths Observed\n`;
      session.finalReport.topStrengthsObserved.forEach(s => { md += `- ${s}\n`; });
      md += `\n### Priority Growth Areas\n`;
      session.finalReport.priorityImprovementAreas.forEach(a => { md += `- ${a}\n`; });
      md += `\n---\n\n`;
    }

    md += `## 📝 Full Interview Transcript\n\n`;
    session.turns.forEach((turn, idx) => {
      md += `### Question ${idx + 1}: ${turn.question}\n`;
      md += `*Category:* ${turn.category} | *Concept:* ${turn.conceptTested}\n\n`;
      md += `**Your Answer:**\n${turn.userAnswer || '_No answer recorded_'}\n\n`;
      if (turn.feedback) {
        md += `**Score:** ${turn.feedback.score}/10 — **${turn.feedback.verdict}**\n`;
        md += `**CS Translation Win:** ${turn.feedback.csTranslationWin}\n\n`;
        md += `**Model Gold-Standard Answer:**\n${turn.feedback.idealModelAnswer}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bioinfo_Interview_Report_${session.targetLab.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTranscript = () => {
    if (!session) return;
    const text = session.turns.map((t, i) => `Q${i+1}: ${t.question}\nYour Answer: ${t.userAnswer || ''}\nScore: ${t.feedback?.score || 'N/A'}/10\n`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const currentTurn = session?.turns[session.currentQuestionIndex];
  const previousTurnWithFeedback = session?.turns[session.currentQuestionIndex - 1]?.feedback 
    ? session.turns[session.currentQuestionIndex - 1] 
    : (session?.isCompleted && session.turns[session.turns.length - 1]?.feedback ? session.turns[session.turns.length - 1] : null);

  return (
    <div className="space-y-6">
      {/* Header Banner with Sub-Nav */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              Interactive Gemini AI Mock Interviewer
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Bioinformatics Technical Interview Simulator
            </h2>
            <p className="mt-1.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Role-play live technical screening interviews with simulated Principal Investigators from India's top computational genomics institutes (CSIR-IGIB, CCMB, NCBS, Strand). Test your CS-to-Bio translation, receive instant scoring, and practice with model answers.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center shrink-0">
            <button
              onClick={() => setActiveMode('roleplay')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'roleplay'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Live AI Role-Play</span>
            </button>
            <button
              onClick={() => setActiveMode('bank')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'bank'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Question Bank & Cheats</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: LIVE AI ROLE-PLAY INTERVIEW */}
      {/* ========================================================================= */}
      {activeMode === 'roleplay' && (
        <div className="space-y-6">
          {/* SETUP SCREEN (If no active session) */}
          {!session && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Configure Your Mock Interview Simulation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your target institution in India, specialization role, and interview difficulty.
                  </p>
                </div>
              </div>

              {/* Lab Selector Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Choose Target Research Lab / Enterprise
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INDIAN_BIOINFO_LABS.map(lab => (
                    <div
                      key={lab.id}
                      onClick={() => setSelectedLab(lab)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedLab.id === lab.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-slate-900 line-clamp-1">{lab.name}</div>
                          {selectedLab.id === lab.id && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {lab.specialty}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {lab.focusTags.map((tag, idx) => (
                          <span key={idx} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Role & Difficulty Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    2. Target Bioinformatics Role
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {TARGET_BIOINFO_ROLES.map(role => (
                      <option key={role.id} value={role.title}>{role.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    3. Candidate Experience Tier
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Fresher / Project Trainee">Fresher / Project Trainee (CS Transitioner)</option>
                    <option value="Junior Bio-Pipeline Engineer">Junior Bio-Pipeline Engineer (1-2 yrs)</option>
                    <option value="Research Fellow / Specialist">Research Fellow / Specialist (Advanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    4. Question Round Length
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={3}>Quick Screen (3 Questions)</option>
                    <option value={4}>Standard Round (4 Questions - Recommended)</option>
                    <option value={5}>In-Depth Technical (5 Questions)</option>
                  </select>
                </div>
              </div>

              {/* Start Action */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Gemini dynamically customizes questions based on your CS strengths and target lab.
                </div>

                <button
                  onClick={handleStartInterview}
                  disabled={isStartingSession}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {isStartingSession ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Initializing PI Interviewer...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Start Mock Interview Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE INTERVIEW IN-PROGRESS */}
          {session && !session.isCompleted && currentTurn && (
            <div className="space-y-6">
              {/* Interview Progress & Controls Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm">
                    PI
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{session.interviewerPersona.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                        Interviewer
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {session.interviewerPersona.organization} • {session.targetRole}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speech Toggle */}
                  <button
                    onClick={() => {
                      const next = !isSpeechEnabled;
                      setIsSpeechEnabled(next);
                      if (!next) stopSpeech();
                      else if (currentTurn?.question) speakText(currentTurn.question);
                    }}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isSpeechEnabled
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={isSpeechEnabled ? 'Disable Question Audio' : 'Enable Voice Readout'}
                  >
                    {isSpeechEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4" />}
                    <span className="text-[11px] hidden sm:inline">{isSpeechEnabled ? 'Voice On' : 'Voice Off'}</span>
                  </button>

                  {/* Question Progress Indicator */}
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">
                      Question {currentTurn.questionNumber} of {session.totalQuestions}
                    </div>
                    <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-300"
                        style={{ width: `${(currentTurn.questionNumber / session.totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to end this interview and start over?')) {
                        stopSpeech();
                        setSession(null);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs cursor-pointer"
                    title="Restart Interview"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PREVIOUS QUESTION FEEDBACK (If available) */}
              {previousTurnWithFeedback && previousTurnWithFeedback.feedback && (
                <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-5 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                        ✓
                      </span>
                      <span className="font-bold text-xs text-slate-900">
                        PI Evaluation on Question {previousTurnWithFeedback.questionNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                        Score: {previousTurnWithFeedback.feedback.score} / 10
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {previousTurnWithFeedback.feedback.verdict}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-900 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-700" /> CS Translation Win:
                      </div>
                      <p className="text-emerald-950 leading-relaxed font-medium">
                        {previousTurnWithFeedback.feedback.csTranslationWin}
                      </p>
                    </div>

                    {previousTurnWithFeedback.feedback.blindspotsOrMistakes?.length > 0 && (
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1">
                        <div className="font-bold text-amber-900 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Nuance / Blindspot:
                        </div>
                        <ul className="text-amber-950 list-disc list-inside leading-relaxed">
                          {previousTurnWithFeedback.feedback.blindspotsOrMistakes.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CURRENT ACTIVE QUESTION CARD */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[11px]">
                        {currentTurn.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Concept: <strong className="text-slate-700">{currentTurn.conceptTested}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => speakText(currentTurn.question)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Replay Voice</span>
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    "{currentTurn.question}"
                  </h3>
                </div>

                {/* CS Student Tactical Hint Toggle */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>{showHint ? 'Hide CS Translation Hint' : '💡 Need a hint? Show CS concept translation'}</span>
                  </button>

                  {showHint && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium animate-fadeIn">
                      <strong className="text-emerald-900">CS Intuition Guide:</strong> {currentTurn.hintForCS}
                    </div>
                  )}
                </div>

                {/* Candidate Answer Textarea */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      Your Technical Answer:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleSpeechRecognition}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                          isListening
                            ? 'bg-red-100 text-red-700 animate-pulse border border-red-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isListening ? <MicOff className="w-3.5 h-3.5 text-red-600" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">
                        {currentAnswer.length} characters
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        handleSubmitAnswer();
                      }
                    }}
                    placeholder="Type your explanation here. Feel free to explain algorithmic time/space complexity, data structures (hash tables, matrices, trees, DAGs), or exact biological software tools (DESeq2, BWA-MEM, Nextflow, Seurat)..."
                    rows={6}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Quick Phrase Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Insert CS Terms:</span>
                  {[
                    'Space-Time Complexity: O(M)',
                    'Negative Binomial Overdispersion',
                    'BWT + FM-Index Suffix Array',
                    'Dynamic Programming Alignment',
                    'Multiple Testing FDR (Benjamini-Hochberg)',
                    'Docker Containerized DAG'
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleInsertPhrase(phrase)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>

                {/* Submit / Advance Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono text-[10px]">Ctrl</kbd> + 
                    <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono text-[10px]">Enter</kbd> to submit
                  </div>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!currentAnswer.trim() || isEvaluating}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>PI is Evaluating Answer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{currentTurn.questionNumber >= session.totalQuestions ? 'Submit & Finalize Interview' : 'Submit Answer & Get Next Question'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FINAL EVALUATION & PERFORMANCE REPORT CARD */}
          {session && session.isCompleted && session.finalReport && (
            <div className="space-y-6 animate-fadeIn">
              {/* Report Header Card */}
              <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-6 sm:p-7 shadow-md space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 mb-2">
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      Interview Performance Assessment Report
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      Hiring Committee Verdict: {session.finalReport.hiringDecision}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Evaluated for <strong>{session.targetRole}</strong> at <strong>{session.targetLab}</strong>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyTranscript}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTranscript ? 'Copied!' : 'Copy Transcript'}</span>
                    </button>

                    <button
                      onClick={handleDownloadTranscript}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Report (.md)</span>
                    </button>
                  </div>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col justify-between">
                    <div className="text-[11px] text-slate-300 font-semibold">Overall Match Score</div>
                    <div className="text-3xl font-black text-emerald-400 my-1">
                      {session.finalReport.overallScore}<span className="text-sm font-normal text-slate-400">/100</span>
                    </div>
                    <div className="text-[10px] text-emerald-300">Top Quartile Candidate</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="text-[11px] text-slate-500 font-semibold">Algorithmic CS Rigor</div>
                    <div className="text-2xl font-black text-indigo-700 my-1">
                      {session.finalReport.algorithmicIntuitionScore}%
                    </div>
                    <div className="text-[10px] text-slate-600">Complexity & Data Structures</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="text-[11px] text-slate-500 font-semibold">Biological Precision</div>
                    <div className="text-2xl font-black text-emerald-700 my-1">
                      {session.finalReport.biologicalDomainAccuracyScore}%
                    </div>
                    <div className="text-[10px] text-slate-600">Genomics / Molecular Context</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="text-[11px] text-slate-500 font-semibold">CS-to-Bio Translation</div>
                    <div className="text-2xl font-black text-purple-700 my-1">
                      {session.finalReport.csTranslationScore}%
                    </div>
                    <div className="text-[10px] text-slate-600">Intuition Bridge Mastery</div>
                  </div>
                </div>

                {/* Narrative Assessment */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Interviewer's Executive Feedback
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {session.finalReport.interviewerSummary}
                  </p>
                </div>

                {/* Strengths & Growth Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Key Strengths Observed
                    </div>
                    <ul className="space-y-1.5 text-emerald-950">
                      {session.finalReport.topStrengthsObserved.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" /> Priority Study Areas
                    </div>
                    <ul className="space-y-1.5 text-amber-950">
                      {session.finalReport.priorityImprovementAreas.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Lab Matches */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Recommended Lab Opportunities for Your Profile
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {session.finalReport.recommendedLabMatches.map((lab, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="font-bold text-slate-900">{lab}</div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-1">High Profile Affinity</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restart or Practice Next Round */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      stopSpeech();
                      setSession(null);
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Another Role / Lab</span>
                  </button>

                  {onNavigateToEmailGenerator && (
                    <button
                      onClick={onNavigateToEmailGenerator}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Draft Cold Email to PI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* DETAILED QUESTION-BY-QUESTION BREAKDOWN */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Full Transcript & Model Answer Breakdown
                </h4>

                <div className="space-y-4">
                  {session.turns.map((turn, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-black shrink-0">
                            {idx + 1}
                          </span>
                          <span>{turn.question}</span>
                        </div>
                        {turn.feedback && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-xs">
                            Score: {turn.feedback.score} / 10
                          </span>
                        )}
                      </div>

                      <div className="pl-7 space-y-2">
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <div className="font-semibold text-slate-500 text-[11px] mb-1">Your Answer:</div>
                          <div className="text-slate-800 font-mono text-xs whitespace-pre-wrap">
                            {turn.userAnswer || '_No answer provided_'}
                          </div>
                        </div>

                        {turn.feedback && (
                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="font-bold text-emerald-900 text-[11px] mb-1">🏆 Model Gold-Standard Answer:</div>
                            <div className="text-emerald-950 font-medium leading-relaxed">
                              {turn.feedback.idealModelAnswer}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CURATED QUESTION BANK & MODEL CHEATS */}
      {/* ========================================================================= */}
      {activeMode === 'bank' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                Frequently Asked Technical Questions in Indian Lab Screenings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Master these foundational algorithms, statistical principles, and pipeline concepts before your interviews.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {STATIC_QUESTION_BANK.map((item, idx) => {
              const isExpanded = expandedBankId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedBankId(isExpanded ? null : item.id)}
                    className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Asked at: <strong className="text-slate-700">{item.lab}</strong>
                        </span>
                      </div>
                      <div className="font-bold text-sm text-slate-900">
                        {idx + 1}. {item.question}
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-200 space-y-3 text-xs bg-white">
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                        <strong className="text-emerald-900">💡 CS Intuition Angle:</strong>{' '}
                        <span className="text-emerald-950 font-medium">{item.csTip}</span>
                      </div>

                      <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1 font-mono text-xs">
                        <div className="font-bold text-emerald-400 text-[11px]">Gold-Standard Model Answer:</div>
                        <p className="leading-relaxed text-slate-300">
                          {item.modelAnswer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
