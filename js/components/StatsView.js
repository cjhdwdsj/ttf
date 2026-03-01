// StatsView component — player collection overview and pull statistics.

const { defineComponent, computed } = Vue;
import { PLAYERS, RARITY_META } from '../data/players.js';

export default defineComponent({
  name: 'StatsView',
  props: {
    history:    { type: Array,  required: true },
    collection: { type: Object, required: true },
    tickets:    { type: Number, required: true },
  },
  emits: ['add-tickets', 'reset'],
  setup(props) {
    const totalPulls = computed(() => props.history.length);

    const byStar = computed(() => {
      const counts = { legendary: 0, epic: 0, rare: 0, normal: 0 };
      for (const r of props.history) counts[r.tier]++;
      return counts;
    });

    const uniqueOwned = computed(() => Object.keys(props.collection).length);

    const bestPlayers = computed(() =>
      PLAYERS
        .filter(p => props.collection[p.id])
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 12)
    );

    function copies(id) { return props.collection[id] ?? 0; }

    return { totalPulls, byStar, uniqueOwned, bestPlayers, copies, RARITY_META };
  },
  template: `
    <div class="stats-view">
      <h3 class="section-title">球员图鉴 &amp; 统计</h3>

      <!-- Summary row -->
      <div class="stats-summary">
        <div class="stat-card">
          <div class="stat-val">{{ totalPulls }}</div>
          <div class="stat-label">总抽数</div>
        </div>
        <div class="stat-card legendary">
          <div class="stat-val">{{ byStar.legendary }}</div>
          <div class="stat-label">传奇</div>
        </div>
        <div class="stat-card epic">
          <div class="stat-val">{{ byStar.epic }}</div>
          <div class="stat-label">史诗</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ uniqueOwned }}</div>
          <div class="stat-label">已获球员</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ tickets }}</div>
          <div class="stat-label">剩余券</div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="stats-actions">
        <button class="action-btn" @click="$emit('add-tickets', 100)">+100 招募券</button>
        <button class="action-btn" @click="$emit('add-tickets', 1000)">+1000 招募券</button>
        <button class="action-btn danger" @click="$emit('reset')">重置所有数据</button>
      </div>

      <!-- Collection grid -->
      <div v-if="bestPlayers.length" class="collection-grid">
        <div
          v-for="p in bestPlayers"
          :key="p.id"
          :class="['col-card', p.rarity]"
          :style="{ '--rc': RARITY_META[p.rarity].color, '--rg': RARITY_META[p.rarity].glow }"
        >
          <div class="col-stars">
            <span v-for="s in RARITY_META[p.rarity].stars" :key="s">★</span>
          </div>
          <div class="col-ovr">{{ p.overall }}</div>
          <div class="col-name">{{ p.name }}</div>
          <div class="col-pos">{{ p.pos }}</div>
          <div v-if="copies(p.id) > 1" class="col-copies">×{{ copies(p.id) }}</div>
        </div>
      </div>
      <p v-else class="collection-empty">图鉴为空，开始抽卡获取球员！</p>
    </div>
  `,
});
