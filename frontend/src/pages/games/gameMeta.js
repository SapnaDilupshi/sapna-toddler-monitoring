export const GAME_META = {
  cognitive: {
    key: 'cognitive',
    label: 'Cognitive',
    title: 'Color Rack Match',
    eyebrow: 'Attention Puzzle',
    shellClass: 'game-page-cognitive',
    glowClass: 'game-glow-cognitive',
    accentClass: 'game-accent-cognitive',
    bannerClass: 'game-banner-cognitive',
    icon: '🌟',
    ribbon: 'Match the Example',
    routeLabel: 'Cognitive',
    description: 'Swap the colored balls until the live rack matches the example above.',
    summary: 'A visual attention puzzle with a target rack, live board, and automatic logging on completion.',
    skills: ['Visual attention', 'Pattern matching', 'Working memory']
  },
  motor: {
    key: 'motor',
    label: 'Motor',
    title: 'Trail Chase',
    eyebrow: 'Movement Reaction',
    shellClass: 'game-page-motor',
    glowClass: 'game-glow-motor',
    accentClass: 'game-accent-motor',
    bannerClass: 'game-banner-motor',
    icon: '🏃',
    ribbon: 'Follow the Light',
    routeLabel: 'Motor',
    description: 'Tap the glowing step before it moves on to the next stop.',
    summary: 'A reaction-based movement game with a lighted lane and a fast, physical tap flow.',
    skills: ['Timing', 'Coordination', 'Motor planning']
  },
  language: {
    key: 'language',
    label: 'Language',
    title: 'Picture Word Match',
    eyebrow: 'Word Clues',
    shellClass: 'game-page-language',
    glowClass: 'game-glow-language',
    accentClass: 'game-accent-language',
    bannerClass: 'game-banner-language',
    icon: '📚',
    ribbon: 'Choose the Match',
    routeLabel: 'Language',
    description: 'Choose the picture that matches the spoken word clue.',
    summary: 'A picture-word matching game with visual prompts and clean category cards.',
    skills: ['Naming', 'Word recognition', 'Vocabulary']
  },
  social_emotional: {
    key: 'social_emotional',
    label: 'Social-emotional',
    title: 'Helping Hands Stage',
    eyebrow: 'Kind Choices',
    shellClass: 'game-page-social',
    glowClass: 'game-glow-social',
    accentClass: 'game-accent-social',
    bannerClass: 'game-banner-social',
    icon: '💛',
    ribbon: 'Choose the Helpful Response',
    routeLabel: 'Social-emotional',
    description: 'Read the scene and pick the response that helps the moment.',
    summary: 'A social scenario game with helper choices and gentle feedback.',
    skills: ['Emotion labeling', 'Empathy', 'Calm choices']
  }
};

export function buildGameHref({ gameKey, childId, childName, childAge, activityId }) {
  const params = new URLSearchParams();
  if (childId) params.set('childId', childId);
  if (childName) params.set('childName', childName);
  if (childAge) params.set('childAge', String(childAge));
  if (activityId) params.set('activityId', activityId);
  return `/games/${gameKey}?${params.toString()}`;
}
