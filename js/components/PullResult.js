// PullResult component — animated card-reveal overlay shown after a pull.

const { defineComponent, ref, computed, nextTick } = Vue;
import { RARITY_META } from '../data/players.js';

export default defineComponent({
  name: 'PullResult',
  props: {
    results: { type: Array, required: true }, // array of pull result objects
  },
  emits: ['close'],
  setup(props, { emit }) {
    // Reveal state: -1 = nothing revealed yet, index = revealed so far
    const revealed    = ref(-1);
    const allRevealed = ref(false);
    const skipAnim    = ref(false);

    function revealAll() {
      revealed.value    = props.results.length - 1;
      allRevealed.value = true;
      skipAnim.value    = true;
    }

    function revealNext() {
      if (revealed.value < props.results.length - 1) {
        revealed.value++;
      }
      if (revealed.value === props.results.length - 1) {
        allRevealed.value = true;
      }
    }

    function close() {
      revealed.value    = -1;
      allRevealed.value = false;
      skipAnim.value    = false;
      emit('close');
    }

    // Auto-start: reveal first card when component mounts
    function start() {
      revealed.value    = -1;
      allRevealed.value = false;
      skipAnim.value    = false;
      nextTick(() => { revealed.value = 0; });
    }

    function rarityMeta(r) { return RARITY_META[r]; }

    function cardClass(idx, r) {
      return [
        'result-card',
        r.tier,
        { 'revealed':  idx <= revealed.value || skipAnim.value },
        { 'featured':  r.featured },
        { 'is-single': props.results.length === 1 },
      ];
    }

    const highlightBest = computed(() => {
      const order = ['legendary', 'epic', 'rare', 'normal'];
      return props.results.slice().sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier))[0];
    });

    return {
      revealed, allRevealed, skipAnim,
      revealAll, revealNext, close, start,
      rarityMeta, cardClass, highlightBest,
      RARITY_META,
    };
  },
  template: `
    <div class="pull-overlay" @click.self="allRevealed ? close() : revealAll()">

      <div class="pull-result-container" :class="{ single: results.length === 1 }">

        <div
          v-for="(r, i) in results"
          :key="i"
          :class="cardClass(i, r)"
          @click.stop="allRevealed ? null : (i === revealed + 1 ? revealNext() : revealAll())"
          :style="{ '--rarity-color': RARITY_META[r.tier].color, '--rarity-glow': RARITY_META[r.tier].glow }"
        >
          <!-- Card back -->
          <div class="card-face card-back">
            <div class="card-back-pattern"></div>
            <span class="card-back-logo">⚽</span>
          </div>

          <!-- Card front -->
          <div class="card-face card-front">
            <div class="card-shine"></div>
            <div v-if="r.featured" class="featured-badge">精选UP</div>
            <div class="card-rarity-stars">
              <span v-for="s in RARITY_META[r.tier].stars" :key="s">★</span>
            </div>
            <div class="card-pos-badge">{{ r.player.pos }}</div>
            <div class="card-player-name">{{ r.player.name }}</div>
            <div class="card-player-sub">{{ r.player.club }}</div>
            <div class="card-ovr">{{ r.player.overall }}</div>
            <div class="card-nation">{{ r.player.nation }}</div>
            <div class="card-rarity-label" :style="{ color: RARITY_META[r.tier].color }">
              {{ RARITY_META[r.tier].label }}
            </div>
          </div>
        </div>

      </div>

      <!-- Controls -->
      <div class="pull-controls">
        <button v-if="!allRevealed" class="ctrl-btn" @click="revealAll">全部揭示</button>
        <button v-if="allRevealed"  class="ctrl-btn confirm-btn" @click="close">确认</button>
      </div>

      <!-- Hint -->
      <p v-if="!allRevealed" class="pull-hint">点击卡牌逐张揭示，或点击空白处全部揭示</p>
    </div>
  `,
  mounted() { this.start(); },
  watch: {
    results() { this.start(); },
  },
});
