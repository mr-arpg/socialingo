import type { AttributeMeta, Chapter, CounterMeta, MoodMeta, SocialContext } from '../types';

export const CONTEXT_LABELS: Record<SocialContext, string> = {
  coffeeShop: 'Coffee shop',
  transit: 'Transit',
  campus: 'Campus',
  workplace: 'Workplace',
  socialEvent: 'Social event',
  neighborhood: 'Neighborhood',
  store: 'Store',
  gym: 'Gym',
};

export const CHAPTERS: readonly Chapter[] = [
  {
    id: 1,
    title: 'Breaking Inertia & Warm Presence',
    subtitle: 'Get out of your head and into the world.',
    firstDay: 1,
    lastDay: 7,
    accent: 'emerald',
    icon: 'Footprints',
    chest: { title: 'Inertia Breaker Chest', xp: 100 },
  },
  {
    id: 2,
    title: 'Active Listening & Conversational Flow',
    subtitle: 'Be the most interested person in the room.',
    firstDay: 8,
    lastDay: 15,
    accent: 'amber',
    icon: 'Ear',
    chest: { title: 'Active Listener Chest', xp: 100 },
  },
  {
    id: 3,
    title: 'Group Dynamics & Storytelling',
    subtitle: 'Join a circle, hold a room, tell your story.',
    firstDay: 16,
    lastDay: 23,
    accent: 'indigo',
    icon: 'BookOpen',
    chest: { title: 'Storyteller Chest', xp: 100 },
  },
  {
    id: 4,
    title: 'Social Leadership & Authentic Connection',
    subtitle: 'Bring people together and make friends who stay.',
    firstDay: 24,
    lastDay: 30,
    accent: 'rose',
    icon: 'Crown',
    chest: { title: 'Connector Chest', xp: 100 },
  },
];

export function chapterForDay(day: number): Chapter {
  const chapter = CHAPTERS.find((c) => day >= c.firstDay && day <= c.lastDay);
  if (!chapter) throw new Error(`Day ${day} is outside the 30-day curriculum`);
  return chapter;
}

export const COUNTER_META: Record<CounterMeta['key'], CounterMeta> = {
  approaches: {
    key: 'approaches',
    label: 'People Approached',
    shortLabel: 'Approach',
    description: 'Any greeting, comment, question, or introduction you started.',
    icon: 'Hand',
  },
  conversations: {
    key: 'conversations',
    label: 'Meaningful Conversations',
    shortLabel: 'Conversation',
    description: 'A real back-and-forth: at least three turns each, or about a minute. Tap it in addition to the opener.',
    icon: 'MessagesSquare',
  },
  kindnesses: {
    key: 'kindnesses',
    label: 'Compliments & Kindnesses',
    shortLabel: 'Kindness',
    description: 'A sincere, specific compliment or small act of kindness.',
    icon: 'Heart',
  },
  courageReps: {
    key: 'courageReps',
    label: 'Courage Reps',
    shortLabel: 'Courage',
    description: 'A "no", a brush-off, an awkward silence, or a request that could have been declined. Worth the most XP.',
    icon: 'Flame',
  },
};

export const ATTRIBUTE_META: Record<AttributeMeta['key'], AttributeMeta> = {
  initiative: {
    key: 'initiative',
    label: 'Initiative',
    shortLabel: 'Initiative',
    description: 'Starting interactions instead of waiting for them.',
    icon: 'Zap',
  },
  empathy: {
    key: 'empathy',
    label: 'Empathy',
    shortLabel: 'Empathy',
    description: 'Noticing, listening, and making people feel understood.',
    icon: 'HeartHandshake',
  },
  presence: {
    key: 'presence',
    label: 'Presence',
    shortLabel: 'Presence',
    description: 'Calm body language, steady voice, attention in the moment.',
    icon: 'Eye',
  },
  storytelling: {
    key: 'storytelling',
    label: 'Storytelling',
    shortLabel: 'Storytelling',
    description: 'Sharing your experiences in a way that invites others in.',
    icon: 'BookOpen',
  },
  resilience: {
    key: 'resilience',
    label: 'Rejection Resilience',
    shortLabel: 'Resilience',
    description: 'Bouncing back from noes and awkward moments without losing momentum.',
    icon: 'Shield',
  },
};

/** Index 0 = rating 1. */
export const CONFIDENCE_LABELS = ['Shaky', 'Uneasy', 'Okay', 'Confident', 'Unstoppable'] as const;
export const ENERGY_LABELS = ['Drained', 'Low', 'Steady', 'Energized', 'Buzzing'] as const;

export const MOOD_META: Record<MoodMeta['tag'], MoodMeta> = {
  nervous: { tag: 'nervous', label: 'Nervous', emoji: '😬', valence: -1 },
  brave: { tag: 'brave', label: 'Brave', emoji: '🦁', valence: 1 },
  awkward: { tag: 'awkward', label: 'Awkward', emoji: '🙈', valence: -1 },
  proud: { tag: 'proud', label: 'Proud', emoji: '🏅', valence: 1 },
  curious: { tag: 'curious', label: 'Curious', emoji: '🧐', valence: 1 },
  energized: { tag: 'energized', label: 'Energized', emoji: '⚡', valence: 1 },
  calm: { tag: 'calm', label: 'Calm', emoji: '🌿', valence: 1 },
  connected: { tag: 'connected', label: 'Connected', emoji: '🤝', valence: 1 },
  drained: { tag: 'drained', label: 'Drained', emoji: '🪫', valence: -1 },
  surprised: { tag: 'surprised', label: 'Surprised', emoji: '😮', valence: 0 },
  frustrated: { tag: 'frustrated', label: 'Frustrated', emoji: '😤', valence: -1 },
  grateful: { tag: 'grateful', label: 'Grateful', emoji: '🙏', valence: 1 },
};
