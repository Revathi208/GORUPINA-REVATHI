
export enum TaskCategory {
  STUDY = 'Study',
  RESEARCH = 'Research',
  CODING = 'Coding',
  WRITING = 'Writing',
  DISTRACTION = 'Distraction'
}

export interface FocusSession {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number; // in seconds
  category: TaskCategory;
  taskName: string;
  distractions: number; // count of times tab was hidden
}

export interface DailyReport {
  date: string;
  totalStudyTime: number;
  totalDistractionTime: number;
  sessions: FocusSession[];
  aiInsight?: string;
}

export interface ProductivitySummary {
  score: number;
  focusTrend: number[];
  categoryDistribution: { name: string; value: number }[];
}
