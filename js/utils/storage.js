// LocalStorage persistence helpers

// Shared constants
export const DEFAULT_TICKETS = 3000;

const KEY_TICKETS  = 'gacha_tickets';
const KEY_PITY     = 'gacha_pity';
const KEY_HISTORY  = 'gacha_history';
const KEY_COLLECT  = 'gacha_collection';

export function loadState() {
  return {
    tickets:    parseInt(localStorage.getItem(KEY_TICKETS)  ?? String(DEFAULT_TICKETS), 10),
    pity:       JSON.parse(localStorage.getItem(KEY_PITY)   ?? '{}'),
    history:    JSON.parse(localStorage.getItem(KEY_HISTORY) ?? '[]'),
    collection: JSON.parse(localStorage.getItem(KEY_COLLECT) ?? '{}'),
  };
}

export function saveTickets(n) {
  localStorage.setItem(KEY_TICKETS, String(n));
}

export function savePity(bannerId, pityObj) {
  const all = JSON.parse(localStorage.getItem(KEY_PITY) ?? '{}');
  all[bannerId] = pityObj;
  localStorage.setItem(KEY_PITY, JSON.stringify(all));
}

export function saveHistory(history) {
  // keep latest 500 entries
  localStorage.setItem(KEY_HISTORY, JSON.stringify(history.slice(-500)));
}

export function saveCollection(collection) {
  localStorage.setItem(KEY_COLLECT, JSON.stringify(collection));
}

export function resetAll() {
  localStorage.removeItem(KEY_TICKETS);
  localStorage.removeItem(KEY_PITY);
  localStorage.removeItem(KEY_HISTORY);
  localStorage.removeItem(KEY_COLLECT);
}
