export interface ItemData {
  points: number;
  available: boolean;
  toggle?: string;
  minAmount?: number;
}

export interface EventData {
  title: string;
  items: Record<string, ItemData>;
  troops: Record<number, number>;
  toggles: { id: string; label: string; tooltip: string }[];
  specialCalculations?: Record<string, { label: string; points: number; stamina: number }>;
}

export interface Events {
  [key: string]: EventData;
}

export interface ItemCounts {
  [key: string]: number;
}

export interface ToggleStates {
  [key: string]: boolean;
}

export interface CustomEvents {
  [key: string]: EventData;
}

export interface PointsHistoryEntry {
  event: string;
  points: number;
  date: string;
}

export interface AccessibilitySettings {
  largeText: boolean;
  extraLargeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface UserStats {
  totalEvents: number;
  totalPoints: number;
  sessionsThisMonth: number;
  firstUse: string | null;
  lastUse: string | null;
  bestEfficiency: number;
  eventsMastered: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface Achievements {
  [key: string]: Achievement;
}

export type Section = 'calculator' | 'analytics' | 'optimizer' | 'achievements';
export type EventKey = 'koi' | 'officer-essence' | 'officer-charm' | 'armament-tomes' | 'armament-design' | 'svs' | 'custom';
export type BudgetStrategy = 'efficient' | 'quick' | 'balanced' | 'premium';
