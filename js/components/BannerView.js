// BannerView component — displays the list of available banners
// and lets the user switch the active one.

const { defineComponent, computed } = Vue;
import { BANNERS } from '../data/banners.js';
import { PLAYERS, RARITY_META } from '../data/players.js';

export default defineComponent({
  name: 'BannerView',
  props: {
    activeBannerId: { type: String, required: true },
    tickets:        { type: Number, required: true },
    pityMap:        { type: Object, required: true },
  },
  emits: ['select', 'pull1', 'pull10'],
  setup(props, { emit }) {
    const banners = BANNERS;

    const activeBanner = computed(() => BANNERS.find(b => b.id === props.activeBannerId) ?? BANNERS[0]);

    const pity = computed(() => {
      const p = props.pityMap[props.activeBannerId] ?? { count: 0, epicStreak: 0 };
      return p;
    });

    const featuredPlayers = computed(() =>
      activeBanner.value.featured.map(id => PLAYERS.find(p => p.id === id)).filter(Boolean)
    );

    function rarityMeta(rarity) {
      return RARITY_META[rarity];
    }

    function pityProgress() {
      const hard = activeBanner.value.pity.hard;
      // Defensively handle invalid or zero `hard` values and clamp percentage to [0, 100]
      if (!Number.isFinite(hard) || hard <= 0) {
        return 0;
      }
      const rawPercent = Math.round((pity.value.count / hard) * 100);
      return Math.max(0, Math.min(100, rawPercent));
    }

    return { banners, activeBanner, pity, featuredPlayers, rarityMeta, pityProgress, RARITY_META };
  },
  template: `
    <div class="banner-view">
      <!-- Tab bar -->
      <div class="banner-tabs">
        <button
          v-for="b in banners"
          :key="b.id"
          :class="['banner-tab', b.theme, { active: b.id === activeBannerId }]"
          @click="$emit('select', b.id)"
        >{{ b.name }}</button>
      </div>

      <!-- Active banner spotlight -->
      <div :class="['banner-spotlight', activeBanner.theme]">
        <div class="banner-info">
          <h2 class="banner-title">{{ activeBanner.name }}</h2>
          <p class="banner-subtitle">{{ activeBanner.subtitle }}</p>

          <!-- Featured players -->
          <div class="featured-players">
            <div
              v-for="p in featuredPlayers"
              :key="p.id"
              class="featured-player-chip"
              :style="{ borderColor: RARITY_META[p.rarity].color }"
            >
              <span class="chip-pos">{{ p.pos }}</span>
              <span class="chip-name">{{ p.name }}</span>
              <span class="chip-ovr">{{ p.overall }}</span>
            </div>
          </div>

          <!-- Rate summary -->
          <div class="rate-summary">
            <span class="rate-item legendary">
              传奇 {{ (activeBanner.rates.featured_legendary + activeBanner.rates.legendary).toFixed(1) }}%
            </span>
            <span class="rate-item epic">史诗 {{ activeBanner.rates.epic }}%</span>
            <span class="rate-item rare">稀有 {{ activeBanner.rates.rare }}%</span>
          </div>
        </div>

        <!-- Pity meter -->
        <div class="pity-panel">
          <div class="pity-label">
            <span>保底进度</span>
            <span class="pity-count">{{ pity.count }} / {{ activeBanner.pity.hard }}</span>
          </div>
          <div class="pity-bar-bg">
            <div class="pity-bar-fill" :style="{ width: pityProgress() + '%' }"></div>
          </div>
          <p class="pity-hint">
            距下次史诗保底还需
            <b>{{ activeBanner.pity.epicGuarantee - (pity.epicStreak % activeBanner.pity.epicGuarantee) }}</b> 抽
          </p>
        </div>

        <!-- Pull buttons -->
        <div class="pull-buttons">
          <button class="pull-btn pull1" @click="$emit('pull1')" :disabled="tickets < 1">
            <span class="pull-btn-icon">⚽</span>
            <span class="pull-btn-label">单抽 × 1</span>
            <span class="pull-btn-cost">
              <img src="img/ticket.svg" class="ticket-icon" alt="" aria-hidden="true"/> × {{ activeBanner.cost }}
            </span>
          </button>
          <button class="pull-btn pull10" @click="$emit('pull10')" :disabled="tickets < 10">
            <span class="pull-btn-icon">🌟</span>
            <span class="pull-btn-label">十连抽 × 10</span>
            <span class="pull-btn-cost">
              <img src="img/ticket.svg" class="ticket-icon" alt="" aria-hidden="true"/> × {{ activeBanner.cost * 10 }}
            </span>
          </button>
        </div>

        <p class="tickets-display">
          <img src="img/ticket.svg" class="ticket-icon" alt="" aria-hidden="true"/> 招募券：<b>{{ tickets }}</b>
        </p>
      </div>
    </div>
  `,
});
