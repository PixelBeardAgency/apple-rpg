// RPG Title Generator
// Generates mythical, RPG-themed titles for users

const RPG_PREFIXES = [
  'the Brave',
  'the Wise',
  'the Great',
  'the Mighty',
  'the Swift',
  'the Bold',
  'the Fearless',
  'the Valiant',
  'the Noble',
  'the Just',
  'the Fierce',
  'the Cunning',
  'the Legendary',
  'the Mysterious',
  'the Ancient',
  'the Eternal',
  'the Divine',
  'the Radiant',
  'the Shadow',
  'the Storm',
  'the Dragon',
  'the Phoenix',
  'the Ranger',
  'the Wanderer',
  'the Protector'
];

const RPG_SUFFIXES = [
  'Slayer of Procrastination',
  'Destroyer of Deadlines',
  'Master of Tasks',
  'Champion of Productivity',
  'Keeper of Lists',
  'Vanquisher of Chaos',
  'Guardian of Goals',
  'Conqueror of To-Dos',
  'Wielder of Checkmarks',
  'Bringer of Order',
  'Seeker of Achievement',
  'Hero of the Realm',
  'Defender of Progress',
  'Slayer of Dragons',
  'Bearer of Quests',
  'Hunter of XP',
  'Collector of Achievements',
  'Lord/Lady of Lists',
  'Taskmaster Supreme',
  'Champion of Completion'
];

/**
 * Generate a random RPG title
 * @returns {string} A mythical RPG title
 */
export function generateRPGTitle() {
  const usePrefix = Math.random() > 0.5;
  
  if (usePrefix) {
    const prefix = RPG_PREFIXES[Math.floor(Math.random() * RPG_PREFIXES.length)];
    return prefix;
  } else {
    const suffix = RPG_SUFFIXES[Math.floor(Math.random() * RPG_SUFFIXES.length)];
    return suffix;
  }
}

/**
 * Format username with RPG title for display
 * @param {string} username - The user's username
 * @param {string} rpgTitle - The user's RPG title
 * @returns {string} Formatted display name
 */
export function formatRPGName(username, rpgTitle) {
  if (!rpgTitle) return username;
  
  // Check if it's a prefix (starts with "the") or suffix
  if (rpgTitle.startsWith('the ')) {
    return `${username} ${rpgTitle}`;
  } else {
    return `${username}, ${rpgTitle}`;
  }
}

