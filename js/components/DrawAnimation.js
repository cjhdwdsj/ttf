// DrawAnimation.js
// Full-screen 3D gacha draw animation — stadium scene → ball rise → explosion → card reveal.
// Replaces PullResult as the pull result overlay.

const { defineComponent, ref, computed, onMounted, onUnmounted } = Vue;
import { RARITY_META } from '../data/players.js';

// Rarity ranking (lower index = higher tier)
const TIER_ORDER = ['legendary', 'epic', 'rare', 'normal'];

// Fraction of particles rendered as star shapes (the rest are circles)
const STAR_RATIO = 0.38;

export default defineComponent({
  name: 'DrawAnimation',
  props: {
    results: { type: Array, required: true },
  },
  emits: ['close'],

  setup(props, { emit }) {
    // ── State ─────────────────────────────────────────────────────────
    const phase   = ref(0); // 0=stadium 1=ball 2=charge 3=explode 4=cards
    const particles  = ref([]);
    const rainDrops  = ref([]);
    const spinning   = ref(false);

    const timers = [];
    function sched(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers.length = 0; }

    // ── Computed rarity info ──────────────────────────────────────────
    const bestTier = computed(() =>
      props.results.reduce(
        (best, r) => TIER_ORDER.indexOf(r.tier) < TIER_ORDER.indexOf(best) ? r.tier : best,
        'normal'
      )
    );
    const isLegendary = computed(() => bestTier.value === 'legendary');
    const isEpic      = computed(() => bestTier.value === 'epic');
    const tierColor   = computed(() => RARITY_META[bestTier.value].color);
    const tierGlow    = computed(() => RARITY_META[bestTier.value].glow);

    // ── Particle burst on explosion ───────────────────────────────────
    function buildParticles() {
      const count = isLegendary.value ? 130 : isEpic.value ? 75 : 45;
      const goldPalette  = ['#FFD700', '#FFA500', '#FFE066', '#FFCC00', '#ffffff'];
      const tierPalette  = [tierColor.value, tierGlow.value, '#ffffff'];
      const palette      = isLegendary.value ? goldPalette : tierPalette;

      particles.value = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = 180 + Math.random() * 420;
        const color = palette[Math.floor(Math.random() * palette.length)];
        const size  = Math.random() * 13 + 3;
        return {
          id: i,
          tx: Math.cos(angle) * speed,
          ty: Math.sin(angle) * speed - 90,   // bias upward
          color,
          size,
          dur:   Math.round(Math.random() * 900 + 700),
          del:   Math.round(Math.random() * 380),
          rot:   Math.round(Math.random() * 720),
          shape: Math.random() < STAR_RATIO ? 'star' : 'circle',
        };
      });
    }

    // ── Golden rain for legendary card reveal ─────────────────────────
    function buildRain() {
      rainDrops.value = Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left:  Math.random() * 100,
        rw:    Math.random() * 5 + 3,
        color: ['#FFD700', '#FFA500', '#FFE066', '#FFCC00'][Math.floor(Math.random() * 4)],
        dur:   Math.round(Math.random() * 1200 + 900),
        del:   Math.round(Math.random() * 2000),
        rx:    (Math.random() - 0.5) * 40,
      }));
    }

    // ── Animation timeline ────────────────────────────────────────────
    function startAnim() {
      phase.value    = 0;
      spinning.value = false;

      const leg  = isLegendary.value;
      const epic = isEpic.value;

      // Phase 1: ball materialises
      sched(() => { phase.value = 1; spinning.value = true; }, 1300);

      // Phase 2: ball rises and charges
      sched(() => { phase.value = 2; }, leg ? 3600 : epic ? 3100 : 2900);

      // Phase 3: explosion
      const explodeAt = leg ? 8200 : epic ? 6200 : 5400;
      sched(() => {
        phase.value = 3;
        buildParticles();
      }, explodeAt);

      // Phase 4: card reveal
      const cardsAt = explodeAt + 820;
      sched(() => {
        phase.value = 4;
        if (leg) buildRain();
      }, cardsAt);

      // Auto-close after cards are shown (generous window)
      sched(() => { emit('close'); }, leg ? 23000 : 18000);
    }

    // ── Skip / confirm ────────────────────────────────────────────────
    function skip() {
      clearTimers();
      if (phase.value < 4) {
        // Briefly show explosion (phase 3) so built particles are visible,
        // then fast-forward to card reveal (phase 4).
        phase.value = 3;
        buildParticles();
        if (isLegendary.value) buildRain();
        // Allow a short explosion window before revealing cards.
        sched(() => {
          phase.value = 4;
        }, 400);
        sched(() => { emit('close'); }, 9000);
      } else {
        emit('close');
      }
    }

    onMounted(startAnim);
    onUnmounted(clearTimers);

    return {
      phase, particles, rainDrops, spinning,
      bestTier, isLegendary, isEpic,
      tierColor, tierGlow,
      skip, RARITY_META,
    };
  },

  template: `
    <div
      class="da-root"
      :class="['da-phase-' + phase, 'da-tier-' + bestTier]"
      :style="{ '--tc': tierColor, '--tg': tierGlow }"
    >

      <!-- ── Stadium scene (phases 0-3) ──────────────────────────────── -->
      <div v-show="phase <= 3" class="da-stadium">
        <div class="da-sky"></div>
        <div class="da-crowd"></div>

        <!-- 3-D field perspective wrapper -->
        <div class="da-field-wrap">
          <div class="da-field">
            <div class="da-field-center-circle"></div>
            <div class="da-field-halfway"></div>
            <div class="da-field-penalty da-penalty-l"></div>
            <div class="da-field-penalty da-penalty-r"></div>
          </div>
        </div>

        <!-- Stadium lights -->
        <div class="da-lights">
          <div class="da-beam da-beam-1"></div>
          <div class="da-beam da-beam-2"></div>
          <div class="da-beam da-beam-3"></div>
          <div class="da-beam da-beam-4"></div>
        </div>

        <!-- Rarity atmosphere glow -->
        <div class="da-atmosphere"></div>

        <!-- Ball -->
        <div class="da-ball-wrap">
          <div class="da-ball">
            <div class="da-ball-pattern" :class="{ 'da-spin': spinning }"></div>
            <div class="da-ball-shine"></div>
          </div>
          <div class="da-ball-shadow"></div>
          <div class="da-energy-ring da-er-1"></div>
          <div class="da-energy-ring da-er-2"></div>
          <div class="da-energy-ring da-er-3"></div>
        </div>

        <!-- Epic / legendary tier announcement -->
        <div v-if="(isLegendary || isEpic) && phase >= 2" class="da-tier-label">
          <template v-if="isLegendary">✦ 传奇球员降临 ✦</template>
          <template v-else>◆ 史诗球员登场 ◆</template>
        </div>
      </div>

      <!-- ── Particles (phase 3) ──────────────────────────────────────── -->
      <div v-if="phase === 3" class="da-particles">
        <div
          v-for="p in particles"
          :key="p.id"
          class="da-particle"
          :class="{ 'da-p-star': p.shape === 'star' }"
          :style="{
            '--tx':     p.tx    + 'px',
            '--ty':     p.ty    + 'px',
            '--pc':     p.color,
            '--ps':     p.size  + 'px',
            '--pd':     p.dur   + 'ms',
            '--pdelay': p.del   + 'ms',
            '--pr':     p.rot   + 'deg',
          }"
        ></div>
      </div>

      <!-- ── Flash overlay (phase 3) ─────────────────────────────────── -->
      <div class="da-flash" :class="{ 'da-flash-active': phase === 3 }"></div>

      <!-- ── Card reveal (phase 4) ───────────────────────────────────── -->
      <div v-if="phase >= 4" class="da-cards-stage">

        <!-- Legendary golden rain -->
        <div v-if="isLegendary" class="da-golden-rain">
          <div
            v-for="d in rainDrops"
            :key="d.id"
            class="da-rain-drop"
            :style="{
              left:      d.left + '%',
              '--rw':    d.rw   + 'px',
              '--rc':    d.color,
              '--rd':    d.dur  + 'ms',
              '--rdelay':d.del  + 'ms',
              '--rx':    d.rx   + 'px',
            }"
          ></div>
        </div>

        <!-- Card grid -->
        <div class="da-cards-grid" :class="{ 'da-single': results.length === 1 }">
          <div
            v-for="(r, i) in results"
            :key="i"
            class="da-card"
            :class="[r.tier, { featured: r.featured }]"
            :style="{
              '--rc': RARITY_META[r.tier].color,
              '--rg': RARITY_META[r.tier].glow,
              '--ci': i,
            }"
          >
            <div class="da-card-shine"></div>
            <div v-if="r.featured" class="da-featured-badge">精选UP</div>
            <div class="da-card-stars">
              <span v-for="s in RARITY_META[r.tier].stars" :key="s">★</span>
            </div>
            <div class="da-card-pos">{{ r.player.pos }}</div>
            <div class="da-card-name">{{ r.player.name }}</div>
            <div class="da-card-club">{{ r.player.club }}</div>
            <div class="da-card-ovr">{{ r.player.overall }}</div>
            <div class="da-card-nation">{{ r.player.nation }}</div>
            <div class="da-card-tier" :style="{ color: RARITY_META[r.tier].color }">
              {{ RARITY_META[r.tier].label }}
            </div>
          </div>
        </div>

        <div class="da-confirm-wrap">
          <button class="da-confirm-btn" @click="skip">确认</button>
        </div>
      </div>

      <!-- ── Skip button (visible during animation phases) ───────────── -->
      <button v-if="phase < 4" class="da-skip-btn" @click="skip">跳过</button>

    </div>
  `,
});
