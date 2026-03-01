// Banner (招募活动) configuration
// Each banner has its own rate table and featured player list.

export const BANNERS = [
  {
    id: 'dream_stars',
    name: '梦幻之星招募',
    subtitle: '限时精选 · 传奇球员概率UP',
    theme: 'gold',
    // featured player ids (shown on banner art)
    featured: [1, 2],
    // Pull rates — values are percentage-weights that sum to 100.
    // weightedRandom in gacha.js normalises them, so they behave as exact percentages.
    rates: {
      featured_legendary: 1.0,   // 1 % for a featured legendary
      legendary:          2.0,   // 2 % for any other legendary
      epic:               7.0,   // 7 % for epic
      rare:              20.0,   // 20 % for rare
      normal:            70.0,   // 70 % for normal
    },
    // Pity settings
    pity: {
      hard: 50,          // guaranteed featured legendary at this pull count
      epicGuarantee: 10, // every N pulls guarantees at least 1 epic+
    },
    // Cost per single pull
    cost: 1,             // 1 招募券
    active: true,
  },
  {
    id: 'classic',
    name: '经典球员招募',
    subtitle: '经典阵容 · 随时可抽',
    theme: 'blue',
    featured: [3, 4, 5, 6],
    rates: {
      featured_legendary: 0.5,
      legendary:          2.5,
      epic:               7.0,
      rare:              22.0,
      normal:            68.0,
    },
    pity: {
      hard: 100,
      epicGuarantee: 10,
    },
    cost: 1,
    active: true,
  },
  {
    id: 'position_cf',
    name: '前锋精选招募',
    subtitle: '前场攻击手 · 高概率前锋',
    theme: 'red',
    featured: [1, 4, 7],
    rates: {
      featured_legendary: 1.5,
      legendary:          1.5,
      epic:               8.0,
      rare:              22.0,
      normal:            67.0,
    },
    pity: {
      hard: 60,
      epicGuarantee: 10,
    },
    cost: 1,
    active: true,
  },
];

export function getBanner(id) {
  return BANNERS.find(b => b.id === id) ?? BANNERS[0];
}
