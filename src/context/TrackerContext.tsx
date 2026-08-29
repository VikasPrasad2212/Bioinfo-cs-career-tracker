import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  InternshipOpportunity, 
  TrackedApplication, 
  ApplicationStatus, 
  AppNotification, 
  NotificationSettings, 
  OrgCategory 
} from '../types';
import { INITIAL_INTERNSHIPS } from '../data/internships';

interface TrackerContextType {
  opportunities: InternshipOpportunity[];
  applications: TrackedApplication[];
  notifications: AppNotification[];
  unreadCount: number;
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  addToTracker: (opportunity: InternshipOpportunity, initialStatus?: ApplicationStatus) => void;
  createCustomApplication: (app: Omit<TrackedApplication, 'id' | 'updatedAt'>) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  updateApplication: (id: string, updates: Partial<TrackedApplication>) => void;
  deleteApplication: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  triggerSimulatedAlert: () => void;
  requestBrowserNotifications: () => Promise<boolean>;
  toggleTaskCompletion: (appId: string, taskId: string) => void;
  addTaskToApplication: (appId: string, label: string) => void;
  deleteTaskFromApplication: (appId: string, taskId: string) => void;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  browserNotificationsEnabled: false,
  emailAlerts: true,
  deadlineThresholdDays: 5,
  subscribedCategories: ['gov_research', 'top_enterprise', 'biotech_startup', 'fellowship'],
  soundEnabled: true,
};

const DEFAULT_INITIAL_APPLICATIONS: TrackedApplication[] = [
  {
    id: 'app-sample-1',
    opportunityId: 'igib-trainee-2026',
    title: 'Genomics Data Science & Pipeline Project Trainee',
    organization: 'CSIR-IGIB',
    category: 'gov_research',
    location: 'New Delhi',
    status: 'interview',
    appliedDate: '2026-08-15',
    deadlineDate: '2026-10-15',
    interviewDate: '2026-09-05',
    stipend: '₹22,000 / month',
    contactPerson: 'Dr. Vinod Scaria (Genomics Division)',
    contactEmail: 'vinod.s@igib.res.in',
    notes: 'Submitted customized SOP highlighting Python Nextflow pipeline projects and variant calling benchmark on simulated chromosome 21 data.',
    priority: 'high',
    tasks: [
      { id: 't1', label: 'Revise GATK & Nextflow DAG concepts for tech round', completed: true },
      { id: 't2', label: 'Review past paper on IndiGen variant frequencies', completed: false, dueDate: '2026-09-02' },
      { id: 't3', label: 'Setup demo GitHub repo with Snakemake pipeline', completed: true }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-sample-2',
    opportunityId: 'strand-life-sciences-intern',
    title: 'Bioinformatics Software Engineering Intern',
    organization: 'Strand Life Sciences',
    category: 'top_enterprise',
    location: 'Bengaluru',
    status: 'assessment',
    appliedDate: '2026-08-22',
    deadlineDate: '2026-09-10',
    stipend: '₹35,000 / month',
    contactPerson: 'Recruiting Team',
    contactEmail: 'careers@strandls.com',
    notes: 'Cleared initial resume screening. Received HackerRank link (Data Structures, Algorithms in Python, and SQL optimization).',
    priority: 'high',
    tasks: [
      { id: 't4', label: 'Complete 90-min online coding test on HackerRank', completed: false, dueDate: '2026-09-01' },
      { id: 't5', label: 'Practice LeetCode medium graph algorithms (BFS/DFS)', completed: true }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-sample-3',
    opportunityId: 'iasc-srfp-2026',
    title: 'IASc-INSA-NASI Summer Research Fellowship',
    organization: 'Indian Academy of Sciences',
    category: 'fellowship',
    location: 'Pan-India',
    status: 'wishlist',
    appliedDate: '',
    deadlineDate: '2026-11-30',
    stipend: '₹12,500 / month + Stay',
    notes: 'Need 2 professor recommendation letters from College CS HOD and Mathematics professor.',
    priority: 'medium',
    tasks: [
      { id: 't6', label: 'Request LOR from CS Dept Head', completed: false },
      { id: 't7', label: 'Draft 200-word research interest in protein folding simulations', completed: false }
    ],
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🎙️ Upcoming Interview in 7 Days',
    message: 'CSIR-IGIB Genomics Data Science Trainee interview scheduled for Sep 05, 2026. Prepare your GitHub pipeline walkthrough!',
    timestamp: '10 minutes ago',
    type: 'interview_reminder',
    read: false,
    priority: 'urgent',
    relatedId: 'app-sample-1'
  },
  {
    id: 'notif-2',
    title: '🚀 New Opening: AstraZeneca Biomedical AI Hub',
    message: 'AstraZeneca Bengaluru opened fresh CS graduate intake for Biomedical Data Science & AI Intern (₹40,000-50,000/mo).',
    timestamp: '2 hours ago',
    type: 'new_opening',
    read: false,
    priority: 'normal',
    actionUrl: 'https://careers.astrazeneca.com/india'
  },
  {
    id: 'notif-3',
    title: '⏳ Approaching Coding Assessment Deadline',
    message: 'Strand Life Sciences HackerRank assessment is due in 3 days. Ensure stable internet and Python 3.10 environment.',
    timestamp: 'Yesterday',
    type: 'deadline',
    read: true,
    relatedId: 'app-sample-2'
  },
  {
    id: 'notif-4',
    title: '💡 CS BioTip: GNNs for Molecules',
    message: 'Highlight PyTorch Geometric and RDKit in your resume to stand out for AI Drug Discovery positions at Bugworks and IIIT-H.',
    timestamp: '2 days ago',
    type: 'tip',
    read: true
  }
];

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [opportunities] = useState<InternshipOpportunity[]>(INITIAL_INTERNSHIPS);
  
  const [applications, setApplications] = useState<TrackedApplication[]>(() => {
    const saved = localStorage.getItem('bioinfo_tracked_apps_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tracked apps', e);
      }
    }
    return DEFAULT_INITIAL_APPLICATIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('bioinfo_notifications_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('bioinfo_settings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('bioinfo_tracked_apps_v1', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('bioinfo_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bioinfo_settings_v1', JSON.stringify(settings));
  }, [settings]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const playNotificationSound = () => {
    if (!settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Ignore audio failure if not interacted
    }
  };

  const showSystemNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png'
        });
      } catch {
        // Fallback silently if blocked
      }
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const requestBrowserNotifications = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      const isGranted = permission === 'granted';
      setSettings(prev => ({ ...prev, browserNotificationsEnabled: isGranted }));
      if (isGranted) {
        showSystemNotification('BioInfo Tracker Alerts Enabled', 'You will now receive live alerts for bioinformatics internships and upcoming deadlines!');
      }
      return isGranted;
    } catch {
      return false;
    }
  };

  const addToTracker = (opportunity: InternshipOpportunity, initialStatus: ApplicationStatus = 'wishlist') => {
    // Check if already in tracker
    const existing = applications.find(a => a.opportunityId === opportunity.id);
    if (existing) {
      updateApplicationStatus(existing.id, initialStatus);
      return;
    }

    const newApp: TrackedApplication = {
      id: 'app-' + Date.now(),
      opportunityId: opportunity.id,
      title: opportunity.title,
      organization: opportunity.organization,
      category: opportunity.category,
      location: opportunity.location,
      status: initialStatus,
      appliedDate: initialStatus === 'wishlist' ? '' : new Date().toISOString().split('T')[0],
      deadlineDate: opportunity.deadline.includes('Nov') ? '2026-11-15' : opportunity.deadline.includes('Oct') ? '2026-10-30' : undefined,
      stipend: opportunity.stipend,
      contactEmail: opportunity.contactEmail,
      notes: `Added from directory. Advantage for CS: ${opportunity.csCandidateAdvantage}`,
      priority: opportunity.featured ? 'high' : 'medium',
      tasks: [
        { id: 't_' + Date.now() + '_1', label: 'Tailor resume with relevant CS & Bio keywords', completed: false },
        { id: 't_' + Date.now() + '_2', label: 'Submit application via official portal/email', completed: initialStatus !== 'wishlist' },
      ],
      updatedAt: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);

    // Send notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: `Added to Tracker: ${opportunity.organization}`,
      message: `Now tracking "${opportunity.title}" under ${initialStatus.toUpperCase()}. Check your Kanban board.`,
      timestamp: 'Just now',
      type: 'system',
      read: false,
      relatedId: newApp.id
    };

    setNotifications(prev => [newNotif, ...prev]);
    playNotificationSound();
  };

  const createCustomApplication = (appData: Omit<TrackedApplication, 'id' | 'updatedAt'>) => {
    const newApp: TrackedApplication = {
      ...appData,
      id: 'custom-app-' + Date.now(),
      updatedAt: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);

    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: `Custom Application Added`,
      message: `Tracking ${newApp.title} at ${newApp.organization}.`,
      timestamp: 'Just now',
      type: 'system',
      read: false,
      relatedId: newApp.id
    };

    setNotifications(prev => [newNotif, ...prev]);
    playNotificationSound();
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        const wasOffer = app.status !== 'offer' && status === 'offer';
        if (wasOffer) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#3B82F6', '#6366F1', '#EC4899', '#F59E0B']
          });
        }
        return {
          ...app,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));

    // Find the app to send notification
    const target = applications.find(a => a.id === id);
    if (target) {
      const statusLabels: Record<ApplicationStatus, string> = {
        wishlist: 'Wishlist',
        applied: 'Applied',
        assessment: 'Coding Assessment',
        interview: 'Interview Scheduled',
        offer: '🎉 Offer Received!',
        rejected: 'Rejected / Closed'
      };

      const notif: AppNotification = {
        id: 'notif-' + Date.now(),
        title: `Status Updated: ${target.organization}`,
        message: `Application for "${target.title}" moved to ${statusLabels[status]}.`,
        timestamp: 'Just now',
        type: status === 'offer' ? 'tip' : status === 'interview' ? 'interview_reminder' : 'system',
        read: false,
        priority: status === 'offer' || status === 'interview' ? 'urgent' : 'normal',
        relatedId: id
      };
      setNotifications(prev => [notif, ...prev]);
      playNotificationSound();
    }
  };

  const updateApplication = (id: string, updates: Partial<TrackedApplication>) => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleTaskCompletion = (appId: string, taskId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          tasks: app.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t),
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const addTaskToApplication = (appId: string, label: string) => {
    if (!label.trim()) return;
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          tasks: [...app.tasks, { id: 'task-' + Date.now(), label: label.trim(), completed: false }],
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const deleteTaskFromApplication = (appId: string, taskId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          tasks: app.tasks.filter(t => t.id !== taskId),
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const triggerSimulatedAlert = () => {
    const simulatedAlerts = [
      {
        title: '⚡ Fresh Opening: MedGenome NGS Cloud Trainee',
        message: 'MedGenome has just posted 4 new positions in Bengaluru for CS candidates with Python and Nextflow skills (₹30,000/mo).',
        type: 'new_opening' as const,
        priority: 'urgent' as const,
      },
      {
        title: '⏰ Deadline Alert: IASc-INSA-NASI Fellowship',
        message: 'Only 14 days remaining to finalize your LORs and 200-word statement of purpose for the national summer fellowship.',
        type: 'deadline' as const,
        priority: 'urgent' as const,
      },
      {
        title: '💼 Hiring Wave: Persistent Systems Life Sciences',
        message: 'Persistent Systems started their off-campus recruitment drive for Computational Biology & Software Engineers in Pune.',
        type: 'new_opening' as const,
        priority: 'normal' as const,
      },
      {
        title: '💡 Interview Tip for CS Candidates',
        message: 'Expect questions on string matching algorithms (KMP, Boyer-Moore) and how they adapt to DNA sequence alignment.',
        type: 'tip' as const,
        priority: 'normal' as const,
      }
    ];

    const randomAlert = simulatedAlerts[Math.floor(Math.random() * simulatedAlerts.length)];
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: randomAlert.title,
      message: randomAlert.message,
      timestamp: 'Just now',
      type: randomAlert.type,
      read: false,
      priority: randomAlert.priority,
    };

    setNotifications(prev => [newNotif, ...prev]);
    playNotificationSound();
    showSystemNotification(randomAlert.title, randomAlert.message);
  };

  return (
    <TrackerContext.Provider
      value={{
        opportunities,
        applications,
        notifications,
        unreadCount,
        settings,
        updateSettings,
        addToTracker,
        createCustomApplication,
        updateApplicationStatus,
        updateApplication,
        deleteApplication,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        triggerSimulatedAlert,
        requestBrowserNotifications,
        toggleTaskCompletion,
        addTaskToApplication,
        deleteTaskFromApplication,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
