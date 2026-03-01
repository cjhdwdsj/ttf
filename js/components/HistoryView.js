// HistoryView component — shows a chronological log of past pulls.

const { defineComponent, computed, ref } = Vue;
import { RARITY_META } from '../data/players.js';

export default defineComponent({
  name: 'HistoryView',
  props: {
    history: { type: Array, required: true },
  },
  setup(props) {
    const filter = ref('all');

    const filtered = computed(() => {
      const h = [...props.history].reverse(); // newest first
      if (filter.value === 'all') return h;
      return h.filter(r => r.tier === filter.value);
    });

    function rarityMeta(r) { return RARITY_META[r]; }

    return { filter, filtered, rarityMeta, RARITY_META };
  },
  template: `
    <div class="history-view">
      <div class="history-header">
        <h3 class="section-title">抽卡记录</h3>
        <div class="history-filters">
          <button :class="['hf-btn', { active: filter === 'all' }]"       @click="filter = 'all'">全部</button>
          <button :class="['hf-btn legendary', { active: filter === 'legendary' }]" @click="filter = 'legendary'">传奇</button>
          <button :class="['hf-btn epic',      { active: filter === 'epic'      }]" @click="filter = 'epic'">史诗</button>
          <button :class="['hf-btn rare',      { active: filter === 'rare'      }]" @click="filter = 'rare'">稀有</button>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="history-empty">
        暂无记录，快去抽卡吧！
      </div>

      <div v-else class="history-list">
        <div
          v-for="(r, i) in filtered"
          :key="i"
          :class="['history-item', r.tier]"
          :style="{ '--rc': RARITY_META[r.tier].color }"
        >
          <span class="hi-stars">
            <span v-for="s in RARITY_META[r.tier].stars" :key="s">★</span>
          </span>
          <span class="hi-pos">{{ r.player.pos }}</span>
          <span class="hi-name">{{ r.player.name }}</span>
          <span class="hi-club">{{ r.player.club }}</span>
          <span class="hi-ovr">OVR {{ r.player.overall }}</span>
          <span v-if="r.featured" class="hi-up">UP</span>
          <span class="hi-rarity" :style="{ color: RARITY_META[r.tier].color }">{{ RARITY_META[r.tier].label }}</span>
        </div>
      </div>
    </div>
  `,
});
