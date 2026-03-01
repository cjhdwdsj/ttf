// Player database for eFootball China Gacha Simulator
// Rarity: legendary(5★) | epic(4★) | rare(3★) | normal(2★)
// Position: CF ST LW RW CAM CM CDM LB RB CB GK

export const PLAYERS = [
  // ─── Legendary (传奇 5★) ───────────────────────────────────────────
  { id: 1,  name: '梅西',       club: '迈阿密国际', nation: '阿根廷', pos: 'CF',  rarity: 'legendary', overall: 97, featured: true  },
  { id: 2,  name: 'C罗',        club: '利雅得新月', nation: '葡萄牙', pos: 'ST',  rarity: 'legendary', overall: 96, featured: true  },
  { id: 3,  name: '姆巴佩',     club: '皇家马德里', nation: '法国',   pos: 'LW',  rarity: 'legendary', overall: 95, featured: false },
  { id: 4,  name: '哈兰德',     club: '曼城',       nation: '挪威',   pos: 'ST',  rarity: 'legendary', overall: 95, featured: false },
  { id: 5,  name: '维尼修斯',   club: '皇家马德里', nation: '巴西',   pos: 'LW',  rarity: 'legendary', overall: 93, featured: false },
  { id: 6,  name: '贝林厄姆',   club: '皇家马德里', nation: '英格兰', pos: 'CAM', rarity: 'legendary', overall: 92, featured: false },
  { id: 7,  name: '德布劳内',   club: '曼城',       nation: '比利时', pos: 'CM',  rarity: 'legendary', overall: 91, featured: false },
  { id: 8,  name: '萨拉赫',     club: '利物浦',     nation: '埃及',   pos: 'RW',  rarity: 'legendary', overall: 91, featured: false },

  // ─── Epic (史诗 4★) ──────────────────────────────────────────────
  { id: 20, name: '拉什福德',   club: '曼联',       nation: '英格兰', pos: 'LW',  rarity: 'epic', overall: 85 },
  { id: 21, name: '穆雷',       club: '阿斯顿维拉', nation: '英格兰', pos: 'CF',  rarity: 'epic', overall: 84 },
  { id: 22, name: '佩德里',     club: '巴塞罗那',   nation: '西班牙', pos: 'CM',  rarity: 'epic', overall: 86 },
  { id: 23, name: '亚马尔',     club: '巴塞罗那',   nation: '西班牙', pos: 'RW',  rarity: 'epic', overall: 85 },
  { id: 24, name: '菲利克斯',   club: '巴塞罗那',   nation: '葡萄牙', pos: 'LW',  rarity: 'epic', overall: 83 },
  { id: 25, name: '卡马文加',   club: '皇家马德里', nation: '法国',   pos: 'CM',  rarity: 'epic', overall: 84 },
  { id: 26, name: '科巴西奇',   club: '切尔西',     nation: '克罗地亚',pos:'CM',  rarity: 'epic', overall: 85 },
  { id: 27, name: '道格拉斯',   club: '巴塞罗那',   nation: '巴西',   pos: 'CAM', rarity: 'epic', overall: 83 },
  { id: 28, name: '穆西亚拉',   club: '拜仁',       nation: '德国',   pos: 'CAM', rarity: 'epic', overall: 87 },
  { id: 29, name: '格拉利什',   club: '曼城',       nation: '英格兰', pos: 'LW',  rarity: 'epic', overall: 84 },
  { id: 30, name: '恩佐',       club: '切尔西',     nation: '阿根廷', pos: 'CM',  rarity: 'epic', overall: 83 },
  { id: 31, name: '罗德里',     club: '曼城',       nation: '西班牙', pos: 'CDM', rarity: 'epic', overall: 88 },
  { id: 32, name: '帕尔默',     club: '切尔西',     nation: '英格兰', pos: 'CAM', rarity: 'epic', overall: 86 },
  { id: 33, name: '西蒙斯',     club: '巴黎圣日耳曼',nation:'荷兰',   pos: 'CM',  rarity: 'epic', overall: 84 },
  { id: 34, name: '特尔斯特根', club: '巴塞罗那',   nation: '德国',   pos: 'GK',  rarity: 'epic', overall: 89 },
  { id: 35, name: '科雷亚',     club: '马竞',       nation: '阿根廷', pos: 'ST',  rarity: 'epic', overall: 82 },

  // ─── Rare (稀有 3★) ──────────────────────────────────────────────
  { id: 50, name: '本特科',     club: '皇家贝蒂斯', nation: '西班牙', pos: 'CM',  rarity: 'rare', overall: 78 },
  { id: 51, name: '福法纳',     club: '切尔西',     nation: '法国',   pos: 'CDM', rarity: 'rare', overall: 78 },
  { id: 52, name: '加里森',     club: '巴黎圣日耳曼',nation:'法国',   pos: 'CB',  rarity: 'rare', overall: 77 },
  { id: 53, name: '科尔穆特',   club: '拜仁',       nation: '德国',   pos: 'LB',  rarity: 'rare', overall: 79 },
  { id: 54, name: '朱利亚努',   club: '弗拉门戈',   nation: '巴西',   pos: 'RW',  rarity: 'rare', overall: 77 },
  { id: 55, name: '基利安',     club: '利物浦',     nation: '法国',   pos: 'LB',  rarity: 'rare', overall: 78 },
  { id: 56, name: '祖马',       club: '博尔顿',     nation: '法国',   pos: 'CB',  rarity: 'rare', overall: 76 },
  { id: 57, name: '奥尔塔',     club: '比利亚雷亚', nation: '西班牙', pos: 'RW',  rarity: 'rare', overall: 77 },
  { id: 58, name: '卡尔瓦哈尔', club: '皇家马德里', nation: '西班牙', pos: 'RB',  rarity: 'rare', overall: 80 },
  { id: 59, name: '卡纳莱斯',   club: '皇家贝蒂斯', nation: '西班牙', pos: 'LW',  rarity: 'rare', overall: 76 },
  { id: 60, name: '蒂诺',       club: '西汉姆',     nation: '英格兰', pos: 'CDM', rarity: 'rare', overall: 75 },
  { id: 61, name: '塔利亚菲科', club: '巴塞罗那',   nation: '阿根廷', pos: 'LB',  rarity: 'rare', overall: 77 },

  // ─── Normal (普通 2★) ────────────────────────────────────────────
  { id: 80, name: '奥利维尔',   club: '尼斯',       nation: '法国',   pos: 'ST',  rarity: 'normal', overall: 72 },
  { id: 81, name: '拉菲尼亚',   club: '巴塞罗那',   nation: '巴西',   pos: 'RW',  rarity: 'normal', overall: 71 },
  { id: 82, name: '阿尔特塔',   club: '阿森纳',     nation: '西班牙', pos: 'CM',  rarity: 'normal', overall: 70 },
  { id: 83, name: '博格巴',     club: '尤文图斯',   nation: '法国',   pos: 'CM',  rarity: 'normal', overall: 70 },
  { id: 84, name: '杰拉德',     club: '阿斯顿维拉', nation: '英格兰', pos: 'CDM', rarity: 'normal', overall: 69 },
  { id: 85, name: '伊戈尔',     club: '弗洛里亚诺', nation: '巴西',   pos: 'LB',  rarity: 'normal', overall: 68 },
  { id: 86, name: '鲁本斯',     club: '帕尔马',     nation: '巴西',   pos: 'CF',  rarity: 'normal', overall: 67 },
  { id: 87, name: '卡斯蒂略',   club: '赫雷斯',     nation: '西班牙', pos: 'CB',  rarity: 'normal', overall: 66 },
  { id: 88, name: '阿隆索',     club: '皇家社会',   nation: '西班牙', pos: 'CM',  rarity: 'normal', overall: 70 },
  { id: 89, name: '阿古埃罗',   club: '巴塞罗那',   nation: '阿根廷', pos: 'ST',  rarity: 'normal', overall: 69 },
  { id: 90, name: '马科斯',     club: '巴黎圣日耳曼',nation:'巴西',   pos: 'LB',  rarity: 'normal', overall: 68 },
  { id: 91, name: '迪亚斯',     club: '曼城',       nation: '葡萄牙', pos: 'CB',  rarity: 'normal', overall: 71 },
];

export const RARITY_META = {
  legendary: { label: '传奇',  stars: 5, color: '#FFD700', glow: '#FFA500', tier: 4 },
  epic:      { label: '史诗',  stars: 4, color: '#C0A0FF', glow: '#8060FF', tier: 3 },
  rare:      { label: '稀有',  stars: 3, color: '#60C0FF', glow: '#2090E0', tier: 2 },
  normal:    { label: '普通',  stars: 2, color: '#A8B8C0', glow: '#687888', tier: 1 },
};

// Helpers
export function byRarity(rarity) {
  return PLAYERS.filter(p => p.rarity === rarity);
}
export function featuredLegendaries() {
  return PLAYERS.filter(p => p.rarity === 'legendary' && p.featured);
}
