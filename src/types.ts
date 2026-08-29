export type OrgCategory = 'gov_research' | 'top_enterprise' | 'biotech_startup' | 'fellowship';

export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export interface InternshipOpportunity {
  id: string;
  title: string;
  organization: string;
  category: OrgCategory;
  location: string;
  workMode: WorkMode;
  stipend: string;
  duration: string;
  deadline: string;
  status: 'Open' | 'Upcoming' | 'Rolling';
  csSkills: string[];
  bioFocus: string[];
  description: string;
  csCandidateAdvantage: string;
  applicationProcedure: string;
  applicationUrl: string;
  contactEmail?: string;
  isVerified: boolean;
  postedDate: string;
  featured?: boolean;
}

export type ApplicationStatus = 
  | 'wishlist' 
  | 'applied' 
  | 'assessment' 
  | 'interview' 
  | 'offer' 
  | 'rejected';

export interface TrackerTask {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string;
}

export interface TrackedApplication {
  id: string;
  opportunityId?: string;
  title: string;
  organization: string;
  category: OrgCategory;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  deadlineDate?: string;
  interviewDate?: string;
  stipend?: string;
  contactPerson?: string;
  contactEmail?: string;
  notes: string;
  priority: 'high' | 'medium' | 'low';
  tasks: TrackerTask[];
  updatedAt: string;
}

export type NotificationType = 'deadline' | 'new_opening' | 'interview_reminder' | 'tip' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
  relatedId?: string;
  actionUrl?: string;
  priority?: 'urgent' | 'normal';
}

export interface NotificationSettings {
  browserNotificationsEnabled: boolean;
  emailAlerts: boolean;
  deadlineThresholdDays: number; // e.g., 3 days before
  subscribedCategories: OrgCategory[];
  soundEnabled: boolean;
}

export interface SkillGapItem {
  skill: string;
  category: 'Critical' | 'Recommended' | 'Bonus';
  whyItMatters: string;
  estimatedTimeToMaster: string;
  csAnalog?: string;
}

export interface RoadmapMiniProject {
  title: string;
  description: string;
  suggestedDataset: string;
  githubDeliverable: string;
}

export interface RoadmapLearningResource {
  title: string;
  type: string;
  urlDescription: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: string;
  goal: string;
  topicsToLearn: string[];
  recommendedToolsAndLibraries: string[];
  actionableMiniProject: RoadmapMiniProject;
  recommendedFreeResources: RoadmapLearningResource[];
}

export interface InterviewPrepQuestion {
  question: string;
  conceptTested: string;
  tipForCSStudent: string;
}

export interface MatchingRoleRecommendation {
  roleTitle: string;
  exampleOrganizations: string[];
  whyGoodFit: string;
}

export interface SkillGapAnalysisResult {
  overallFitScore: number;
  readinessLevel: string;
  targetRole: string;
  executiveSummary: string;
  strengthsIdentified: string[];
  criticalGaps: SkillGapItem[];
  personalizedRoadmap: RoadmapPhase[];
  interviewQuestionsToExpect: InterviewPrepQuestion[];
  topMatchingRolesInIndia: MatchingRoleRecommendation[];
  generatedAt: string;
}

export interface MockInterviewTurn {
  id: string;
  questionNumber: number;
  question: string;
  category: 'Algorithms & String Search' | 'NGS Pipelines & HPC' | 'R / Statistical Genomics' | 'AI & Structural Biology' | 'Databases & Cloud Genomics' | 'General CS-to-Bio Motivation';
  conceptTested: string;
  hintForCS: string;
  userAnswer?: string;
  feedback?: {
    score: number; // 1-10
    verdict: string;
    strengths: string[];
    csTranslationWin: string;
    blindspotsOrMistakes: string[];
    idealModelAnswer: string;
  };
  timestamp: string;
}

export interface InterviewSessionReport {
  overallScore: number; // 1-100
  hiringDecision: 'Strong Hire / Project Fellow' | 'Hire / High Potential Trainee' | 'Promising with Minor Gaps' | 'Needs More Preparation';
  interviewerSummary: string;
  algorithmicIntuitionScore: number;
  biologicalDomainAccuracyScore: number;
  csTranslationScore: number;
  topStrengthsObserved: string[];
  priorityImprovementAreas: string[];
  recommendedLabMatches: string[];
  recommendedNextSteps: string[];
}

export interface InterviewSessionState {
  sessionId: string;
  targetRole: string;
  targetLab: string;
  interviewerPersona: {
    name: string;
    title: string;
    organization: string;
  };
  difficulty: 'Fresher / Project Trainee' | 'Junior Bio-Pipeline Engineer' | 'Research Fellow / Specialist';
  totalQuestions: number;
  currentQuestionIndex: number;
  turns: MockInterviewTurn[];
  isCompleted: boolean;
  finalReport?: InterviewSessionReport;
}

