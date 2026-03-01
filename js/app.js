// Main Vue 3 application entry point
// Uses Composition API + CDN Vue (no build step required)

import BannerView  from './components/BannerView.js';
import DrawAnimation from './components/DrawAnimation.js';
import HistoryView from './components/HistoryView.js';
import StatsView   from './components/StatsView.js';

import { getBanner }           from './data/banners.js';
import { singlePull, tenPull, updatePity } from './utils/gacha.js';
import {
  loadState, saveTickets, savePity,
  saveHistory, saveCollection, resetAll,
  DEFAULT_TICKETS,
} from './utils/storage.js';

const { createApp, ref, computed, reactive } = Vue;

const App = {
  components: { BannerView, DrawAnimation, HistoryView, StatsView },

  setup() {
    // ── Persistent state ──────────────────────────────────────────
    const saved = loadState();

    const tickets    = ref(saved.tickets);
    const pityMap    = reactive(saved.pity);     // { [bannerId]: { count, epicStreak } }
    const history    = ref(saved.history);       // flat array of pull results
    const collection = reactive(saved.collection); // { [playerId]: copies }

    // ── UI state ──────────────────────────────────────────────────
    const activeBannerId = ref('dream_stars');
    const currentTab     = ref('banner');        // 'banner' | 'history' | 'stats'
    const pullResults    = ref(null);            // null = no overlay shown

    // ── Helpers ───────────────────────────────────────────────────
    function getPity(bannerId) {
      if (!pityMap[bannerId]) pityMap[bannerId] = { count: 0, epicStreak: 0 };
      return pityMap[bannerId];
    }

    function recordResults(results) {
      for (const r of results) {
        history.value.push(r);
        collection[r.player.id] = (collection[r.player.id] ?? 0) + 1;
      }
      saveHistory(history.value);
      saveCollection(collection);
    }

    // ── Pull actions ─────────────────────────────────────────────
    function doPull1() {
      if (tickets.value < 1) return;
      const banner = getBanner(activeBannerId.value);
      const pity   = getPity(banner.id);
      const result = singlePull(banner, pity);
      const updated = updatePity(pity, [result]);
      Object.assign(pity, updated);
      savePity(banner.id, pity);

      tickets.value -= banner.cost;
      saveTickets(tickets.value);

      recordResults([result]);
      pullResults.value = [result];
    }

    function doPull10() {
      const banner = getBanner(activeBannerId.value);
      const totalCost = banner.cost * 10;
      if (tickets.value < totalCost) return;
      const pity    = getPity(banner.id);
      const results = tenPull(banner, pity);
      const updated = updatePity(pity, results);
      Object.assign(pity, updated);
      savePity(banner.id, pity);

      tickets.value -= totalCost;
      saveTickets(tickets.value);

      recordResults(results);
      pullResults.value = results;
    }

    function closePullResult() { pullResults.value = null; }

    // ── Stats panel actions ───────────────────────────────────────
    function addTickets(n) {
      tickets.value += n;
      saveTickets(tickets.value);
    }

    function resetData() {
      if (!confirm('确定要重置所有数据吗？')) return;
      resetAll();
      tickets.value = DEFAULT_TICKETS;
      history.value = [];
      Object.keys(pityMap).forEach(k => delete pityMap[k]);
      Object.keys(collection).forEach(k => delete collection[k]);
    }

    return {
      tickets, pityMap, history, collection,
      activeBannerId, currentTab, pullResults,
      doPull1, doPull10, closePullResult,
      addTickets, resetData,
    };
  },

  template: `
    <div id="app-root">
      <!-- Header -->
      <header class="app-header">
        <div class="header-brand">
          <span class="brand-icon">⚽</span>
          <span class="brand-name">实况足球 · 招募模拟器</span>
        </div>
        <div class="header-tickets">
          <img src="img/ticket.svg" class="ticket-icon" alt="" aria-hidden="true"/>
          <span>{{ tickets }}</span>
        </div>
      </header>

      <!-- Tab nav -->
      <nav class="tab-nav">
        <button :class="['tab-btn', { active: currentTab === 'banner'  }]" @click="currentTab = 'banner'">招募</button>
        <button :class="['tab-btn', { active: currentTab === 'history' }]" @click="currentTab = 'history'">记录</button>
        <button :class="['tab-btn', { active: currentTab === 'stats'   }]" @click="currentTab = 'stats'">图鉴</button>
      </nav>

      <!-- Main content -->
      <main class="app-main">
        <BannerView
          v-if="currentTab === 'banner'"
          :activeBannerId="activeBannerId"
          :tickets="tickets"
          :pityMap="pityMap"
          @select="id => activeBannerId = id"
          @pull1="doPull1"
          @pull10="doPull10"
        />
        <HistoryView
          v-if="currentTab === 'history'"
          :history="history"
        />
        <StatsView
          v-if="currentTab === 'stats'"
          :history="history"
          :collection="collection"
          :tickets="tickets"
          @add-tickets="addTickets"
          @reset="resetData"
        />
      </main>

      <!-- Pull / draw animation overlay -->
      <DrawAnimation
        v-if="pullResults"
        :results="pullResults"
        @close="closePullResult"
      />
    </div>
  `,
};

createApp(App).mount('#app');
