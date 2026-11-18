/* ============================================================================
 * 30-Day Challenge — domain schema
 * Content types (authored, static) · Persisted state (user data, versioned)
 * Derived stats (computed, never persisted)
 * ========================================================================== */

/** Local calendar date, `YYYY-MM-DD`. */
export type ISODate = string;
/** Full ISO-8601 timestamp. */
export type ISODateTime = string;

export type DayNumber = number;
export type ChapterId = 1 | 2 | 3 | 4;

/* ----------------------------------------------------------------------------
 * Enumerations (runtime arrays so validators and UI can iterate them)
 * -------------------------------------------------------------------------- */

export const ATTRIBUTE_KEYS = ['initiative', 'empathy', 'presence', 'storytelling', 'resilience'] as const;
export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];

/**
 * Each tap is logged under exactly one counter, except `conversations`, which is
 * tapped in addition when an interaction grows into a real back-and-forth.
 */
export const COUNTER_KEYS = ['approaches', 'conversations', 'kindnesses', 'courageReps'] as const;
export type CounterKey = (typeof COUNTER_KEYS)[number];

export const MOOD_TAGS = [
  'nervous',
  'brave',
  'awkward',
  'proud',
  'curious',
  'energized',
  'calm',
  'connected',
  'drained',
  'surprised',
  'frustrated',
  'grateful',
] as const;
export type MoodTag = (typeof MOOD_TAGS)[number];

export const SOCIAL_CONTEXTS = [
  'coffeeShop',
  'transit',
  'campus',
  'workplace',
  'socialEvent',
  'neighborhood',
  'store',
  'gym',
] as const;
export type SocialContext = (typeof SOCIAL_CONTEXTS)[number];

export type AccentColor = 'emerald' | 'amber' | 'indigo' | 'rose';

/** Curated subset of lucide-react icon names used by content. */
export type IconKey =
  | 'Sunrise'
  | 'Brain'
  | 'Eye'
  | 'Unlock'
  | 'Smile'
  | 'MessageCircle'
  | 'MessagesSquare'
  | 'Triangle'
  | 'Heart'
  | 'HeartHandshake'
  | 'Sparkles'
  | 'Gift'
  | 'Wind'
  | 'Ear'
  | 'Shield'
  | 'Flame'
  | 'Tag'
  | 'DoorOpen'
  | 'Layers'
  | 'TrendingDown'
  | 'Coffee'
  | 'GitBranch'
  | 'Repeat'
  | 'Route'
  | 'Timer'
  | 'Users'
  | 'Trophy'
  | 'Star'
  | 'BookOpen'
  | 'PenLine'
  | 'Feather'
  | 'ScrollText'
  | 'Zap'
  | 'Mountain'
  | 'Crown'
  | 'Medal'
  | 'Footprints'
  | 'Lightbulb'
  | 'Compass'
  | 'Target'
  | 'Award'
  | 'Snowflake'
  | 'Rocket'
  | 'Hand';

export type AttributeRewards = Partial<Record<AttributeKey, number>>;
export type AttributeScores = Record<AttributeKey, number>;
export type CounterTotals = Record<CounterKey, number>;

/* ============================================================================
 * CONTENT
 * ========================================================================== */

/** Card `body`/`reality`/`finding` strings support `**bold**` only. */
export type BriefingCard =
  | HookCard
  | ConceptCard
  | MythBusterCard
  | ScriptCard
  | ScienceCard
  | QuizCard
  | ScenarioCard
  | TakeawayCard;

interface CardBase {
  /** Stable across content edits — persisted quiz results reference it. */
  id: string;
  icon?: IconKey;
}

export interface HookCard extends CardBase {
  kind: 'hook';
  title: string;
  body: string;
}

export interface ConceptCard extends CardBase {
  kind: 'concept';
  title: string;
  body: string;
}

/** Rendered as a flip card: myth on the front, reality on the back. */
export interface MythBusterCard extends CardBase {
  kind: 'mythBuster';
  myth: string;
  reality: string;
}

export interface ScriptCard extends CardBase {
  kind: 'script';
  title: string;
  lines: string[];
  note?: string;
}

export interface ScienceCard extends CardBase {
  kind: 'science';
  title: string;
  finding: string;
  source: string;
}

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
  /** Shown when this option is picked; falls back to the card explanation. */
  feedback?: string;
}

export interface QuizCard extends CardBase {
  kind: 'quiz';
  question: string;
  options: QuizOption[];
  explanation: string;
}

export type ScenarioRating = 'great' | 'okay' | 'avoid';

export interface ScenarioOption {
  id: string;
  text: string;
  rating: ScenarioRating;
  feedback: string;
}

export interface ScenarioCard extends CardBase {
  kind: 'scenario';
  situation: string;
  prompt: string;
  options: ScenarioOption[];
}

export interface TakeawayCard extends CardBase {
  kind: 'takeaway';
  title: string;
  points: string[];
}

export interface RepTarget {
  counter: CounterKey;
  /** Absolute total for the day across all taps, not additional to another tier. */
  target: number;
  label: string;
}

export interface MissionTier {
  title: string;
  brief: string;
  steps: string[];
  targets: RepTarget[];
  /** Self-certified items the counters can't capture; all must be checked to complete. */
  checklist?: string[];
}

export interface FieldMission {
  codename: string;
  objective: string;
  contexts: SocialContext[];
  standard: MissionTier;
  hardcore: MissionTier;
  timer?: { seconds: number; label: string };
  tips: string[];
  /** Ethical boundary shown on the mission card. */
  guardrail: string;
}

export interface LogPrompt {
  id: string;
  question: string;
  placeholder: string;
}

export interface DayRewards {
  xp: number;
  hardcoreXp: number;
  attributes: AttributeRewards;
  hardcoreAttributes: AttributeRewards;
}

export interface DayContent {
  day: DayNumber;
  chapter: ChapterId;
  slug: string;
  title: string;
  tagline: string;
  estReadMinutes: number;
  isMilestone: boolean;
  briefing: BriefingCard[];
  mission: FieldMission;
  logbook: LogPrompt[];
  rewards: DayRewards;
}

export interface Chapter {
  id: ChapterId;
  title: string;
  subtitle: string;
  firstDay: DayNumber;
  lastDay: DayNumber;
  accent: AccentColor;
  icon: IconKey;
  chest: { title: string; xp: number };
}

export interface CounterMeta {
  key: CounterKey;
  label: string;
  shortLabel: string;
  description: string;
  icon: IconKey;
}

export interface AttributeMeta {
  key: AttributeKey;
  label: string;
  /** Fits a radar-chart axis label. */
  shortLabel: string;
  description: string;
  icon: IconKey;
}

export interface MoodMeta {
  tag: MoodTag;
  label: string;
  emoji: string;
  valence: -1 | 0 | 1;
}

/* ============================================================================
 * GAMIFICATION DEFINITIONS
 * ========================================================================== */

export type RankId = 'observer' | 'icebreaker' | 'conversationalist' | 'connector' | 'catalyst' | 'luminary';

export interface Rank {
  id: RankId;
  title: string;
  minLevel: number;
  description: string;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold';
export type BadgeCategory = 'action' | 'consistency' | 'logbook' | 'mastery' | 'journey';

export type BadgeCriterion =
  | { type: 'counter'; counter: CounterKey; threshold: number }
  | { type: 'totalInteractions'; threshold: number }
  | { type: 'longestStreak'; threshold: number }
  | { type: 'logEntries'; threshold: number }
  | { type: 'words'; threshold: number }
  | { type: 'hardcore'; threshold: number }
  | { type: 'daysCompleted'; threshold: number }
  | { type: 'daysMastered'; threshold: number }
  | { type: 'chapterCompleted'; chapter: ChapterId }
  | { type: 'level'; threshold: number }
  | { type: 'attribute'; attribute: AttributeKey; threshold: number }
  | { type: 'confidenceDelta'; threshold: number };

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconKey;
  tier: BadgeTier;
  category: BadgeCategory;
  criterion: BadgeCriterion;
}

export interface BadgeProgress {
  current: number;
  target: number;
  /** Value at a fresh start (1 for level), so progress bars begin empty. */
  start: number;
  unlocked: boolean;
}

/* ============================================================================
 * PERSISTED STATE (IndexedDB, versioned, exported as JSON backup)
 * ========================================================================== */

export const SCHEMA_VERSION = 1;

export interface RepEvent {
  id: string;
  counter: CounterKey;
  at: ISODateTime;
  /** `null` = free practice logged outside a curriculum day. */
  day: DayNumber | null;
}

export type XpSource =
  | 'briefing'
  | 'quiz'
  | 'scenario'
  | 'mission'
  | 'hardcore'
  | 'rep'
  | 'logEntry'
  | 'streakBonus'
  | 'chapterChest';

/** Append-only ledger: XP is awarded under the rules active at the time and never recomputed. */
export interface XpEvent {
  id: string;
  at: ISODateTime;
  amount: number;
  source: XpSource;
  day: DayNumber | null;
  /** Links to the RepEvent / card id that produced it, so undo can remove both. */
  refId?: string;
}

export interface CardResult {
  /** Quiz: first pick was correct. Scenario: first pick was rated `great`. */
  firstTryCorrect: boolean;
  answeredAt: ISODateTime;
}

export interface DayProgress {
  day: DayNumber;
  unlockedAt: ISODateTime;
  briefingCompletedAt?: ISODateTime;
  cardResults: Record<string, CardResult>;
  standardChecklist: boolean[];
  hardcoreChecklist: boolean[];
  missionCompletedAt?: ISODateTime;
  hardcoreCompletedAt?: ISODateTime;
  /** Set when briefing + standard mission + logbook entry are all done. */
  completedAt?: ISODateTime;
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface LogEntry {
  id: string;
  day: DayNumber;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  answers: Record<string, string>;
  confidence: Rating;
  energy?: Rating;
  moods: MoodTag[];
  /** Cached on save; recomputed on import. */
  wordCount: number;
}

export type LogDraft = Pick<LogEntry, 'answers' | 'confidence' | 'energy' | 'moods'>;

export type ThemePreference = 'light' | 'dark' | 'system';
export type MotionPreference = 'system' | 'reduced' | 'full';
/** `daily` unlocks the next node at local midnight after completion; `free` unlocks immediately. */
export type PacingMode = 'daily' | 'free';

export interface Settings {
  theme: ThemePreference;
  sound: boolean;
  haptics: boolean;
  motion: MotionPreference;
  pacing: PacingMode;
}

export interface Profile {
  displayName: string;
  createdAt: ISODateTime;
}

export interface PersistedState {
  schemaVersion: typeof SCHEMA_VERSION;
  profile: Profile;
  settings: Settings;
  days: Record<DayNumber, DayProgress>;
  logEntries: Record<DayNumber, LogEntry>;
  repEvents: RepEvent[];
  xpEvents: XpEvent[];
  openedChests: ChapterId[];
  unlockedBadges: Record<string, ISODateTime>;
}

export interface BackupFile {
  app: '30day-challenge';
  schemaVersion: number;
  exportedAt: ISODateTime;
  state: PersistedState;
}

/** Shape written by the original CRA build under `social-challenge-progress`. */
export interface LegacyProgressV0 {
  completedDays: number[];
  lastCompletionTime: number | null;
}

/* ============================================================================
 * DERIVED (computed from PersistedState + content; never persisted)
 * ========================================================================== */

export type NodeState = 'locked' | 'cooldown' | 'current' | 'completed' | 'mastered';

export interface LevelProgress {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  /** 0–1 within the current level. */
  progress: number;
  rank: Rank;
}

export interface DailyActivity {
  date: ISODate;
  xp: number;
  reps: number;
  completedDay: DayNumber | null;
  frozen: boolean;
}

export interface UserStats {
  totalXp: number;
  level: LevelProgress;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  daysCompleted: number;
  daysMastered: number;
  chaptersCompleted: ChapterId[];

  counters: CounterTotals;
  /** approaches + kindnesses + courageReps (conversations overlap these). */
  totalInteractions: number;
  hardcoreCompleted: number;

  logEntries: number;
  totalWords: number;
  avgConfidence: number | null;
  /** Mean of the latest 3 entries after Day 7 minus mean of Days 1–7 entries. */
  confidenceDelta: number | null;
  topMood: MoodTag | null;
  confidenceSeries: Array<{ day: DayNumber; confidence: Rating }>;

  attributes: AttributeScores;
  activity: Record<ISODate, DailyActivity>;
}

export type StatDeltaKind = 'xp' | 'level' | 'streak' | 'counter' | 'attribute' | 'badge';

/** One line in the day-completion celebration ("+2 Initiative"). */
export interface StatDelta {
  kind: StatDeltaKind;
  key: string;
  label: string;
  before: number;
  after: number;
  delta: number;
}

export interface CompletionSummary {
  day: DayNumber;
  mastered: boolean;
  deltas: StatDelta[];
  badges: BadgeDefinition[];
  levelUp: { from: number; to: number; rank: Rank } | null;
}
