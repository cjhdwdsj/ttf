// Gacha pull logic
// Pure functions — no side effects, easy to unit-test.

import { PLAYERS, byRarity } from '../data/players.js';

/**
 * Weighted random pick from an array.
 * @param {Array<{item: *, weight: number}>} weighted
 */
function weightedRandom(weighted) {
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.item;
  }
  return weighted[weighted.length - 1].item;
}

/**
 * Pick a random player from a filtered subset.
 */
function pickFrom(players) {
  return players[Math.floor(Math.random() * players.length)];
}

/**
 * Perform a single pull given the banner config and current pity state.
 *
 * @param {object} banner   - Banner config from banners.js
 * @param {object} pityState - { count: number, epicStreak: number }
 * @param {boolean} forceEpicPlus - force at least epic (for 10× guarantee)
 * @returns {{ player: *, tier: string, featured: boolean }}
 */
export function singlePull(banner, pityState, forceEpicPlus = false) {
  const { rates, pity } = banner;
  const featuredPool = PLAYERS.filter(p => p.rarity === 'legendary' && banner.featured.includes(p.id));
  const legendaryPool = PLAYERS.filter(p => p.rarity === 'legendary' && !banner.featured.includes(p.id));
  const epicPool      = byRarity('epic');
  const rarePool      = byRarity('rare');
  const normalPool    = byRarity('normal');

  // Hard pity: featured legendary guaranteed when this pull *would be* the Nth
  if (pityState.count + 1 >= pity.hard) {
    const player = pickFrom(featuredPool.length ? featuredPool : legendaryPool);
    return { player, tier: 'legendary', featured: true };
  }

  // Epic guarantee every N pulls
  const epicForced = forceEpicPlus || ((pityState.epicStreak + 1) % pity.epicGuarantee === 0);

  // Build weighted table
  const table = [];

  if (!epicForced) {
    table.push({ item: 'featured_legendary', weight: rates.featured_legendary });
    table.push({ item: 'legendary',          weight: rates.legendary });
    table.push({ item: 'epic',               weight: rates.epic });
    table.push({ item: 'rare',               weight: rates.rare });
    table.push({ item: 'normal',             weight: rates.normal });
  } else {
    // Only epic and above
    table.push({ item: 'featured_legendary', weight: rates.featured_legendary });
    table.push({ item: 'legendary',          weight: rates.legendary });
    table.push({ item: 'epic',               weight: rates.epic });
  }

  const result = weightedRandom(table);

  let player, tier, featured;
  switch (result) {
    case 'featured_legendary':
      player  = pickFrom(featuredPool.length ? featuredPool : legendaryPool);
      tier    = 'legendary';
      featured = true;
      break;
    case 'legendary':
      player  = pickFrom(legendaryPool.length ? legendaryPool : featuredPool);
      tier    = 'legendary';
      featured = false;
      break;
    case 'epic':
      player  = pickFrom(epicPool);
      tier    = 'epic';
      featured = false;
      break;
    case 'rare':
      player  = pickFrom(rarePool);
      tier    = 'rare';
      featured = false;
      break;
    default:
      player  = pickFrom(normalPool);
      tier    = 'normal';
      featured = false;
  }

  return { player, tier, featured };
}

/**
 * Perform a 10-pull.
 * Rule: at least 1 epic+ among the 10 results.
 *
 * @param {object} banner
 * @param {object} pityState
 * @returns {Array<pull result>}
 */
export function tenPull(banner, pityState) {
  const results = [];
  let tempPity = { ...pityState };
  let hasEpicPlus = false;

  for (let i = 0; i < 10; i++) {
    const forceOnLast = i === 9 && !hasEpicPlus;
    const result = singlePull(banner, tempPity, forceOnLast);
    if (result.tier === 'epic' || result.tier === 'legendary') hasEpicPlus = true;

    // Advance temp pity counters
    tempPity.count++;
    if (result.tier === 'epic' || result.tier === 'legendary') {
      tempPity.epicStreak = 0;
    } else {
      tempPity.epicStreak++;
    }
    // Reset hard pity counter if legendary obtained
    if (result.tier === 'legendary') tempPity.count = 0;

    results.push(result);
  }

  return results;
}

/**
 * Update pity state after a batch of results.
 */
export function updatePity(pityState, results) {
  let { count, epicStreak } = pityState;
  for (const r of results) {
    if (r.tier === 'legendary') {
      count = 0;
      epicStreak = 0;
    } else if (r.tier === 'epic') {
      count++;
      epicStreak = 0;
    } else {
      count++;
      epicStreak++;
    }
  }
  return { count, epicStreak };
}
