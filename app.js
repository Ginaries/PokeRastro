const API_ROOT = "https://pokeapi.co/api/v2";
const MAX_POKEMON_ID = 1025;
const SHINY_RATE = 1 / 90;
const MAX_LEVEL = 100;
const SAVE_KEY = "pokerastro-save-v3";
const OLD_SAVE_KEYS = ["pokerastro-save-v2", "pokerastro-save-v1"];

const LEGENDARY_IDS = new Set([
  144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384,
  480, 481, 482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 643, 644, 645,
  646, 716, 717, 718, 772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 888, 889,
  890, 891, 892, 894, 895, 896, 897, 898, 905, 1001, 1002, 1003, 1004, 1007, 1008, 1024
]);
const MYTHICAL_IDS = new Set([
  151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801,
  802, 807, 808, 809, 893, 1009, 1010, 1025
]);

const BALLS = [
  { id: "pokeBall", name: "Poke Ball", cost: 40, mod: 1, note: "Basica y barata." },
  { id: "greatBall", name: "Great Ball", cost: 95, mod: 1.55, note: "Mejor rate general." },
  { id: "ultraBall", name: "Ultra Ball", cost: 190, mod: 2.25, note: "Fuerte contra casi todo." },
  { id: "masterBall", name: "Master Ball", cost: 5000, mod: 999, note: "Captura garantizada." },
  { id: "premierBall", name: "Premier Ball", cost: 60, mod: 1.15, note: "Ligero bonus elegante." },
  { id: "healBall", name: "Heal Ball", cost: 70, mod: 1.1, note: "Captura y cura al nuevo." },
  { id: "netBall", name: "Net Ball", cost: 150, mod: 1, note: "Mejor contra agua o bicho." },
  { id: "nestBall", name: "Nest Ball", cost: 135, mod: 1, note: "Mejor contra niveles bajos." },
  { id: "repeatBall", name: "Repeat Ball", cost: 165, mod: 1, note: "Mejor si ya lo tenias." },
  { id: "timerBall", name: "Timer Ball", cost: 180, mod: 1, note: "Sube con turnos." },
  { id: "quickBall", name: "Quick Ball", cost: 210, mod: 1, note: "Muy fuerte al inicio." },
  { id: "duskBall", name: "Dusk Ball", cost: 170, mod: 2.05, note: "Buena en esta ruta boscosa." },
  { id: "diveBall", name: "Dive Ball", cost: 150, mod: 1, note: "Mejor contra agua." },
  { id: "luxuryBall", name: "Luxury Ball", cost: 220, mod: 1.25, note: "Mas oro al capturar." },
  { id: "levelBall", name: "Level Ball", cost: 190, mod: 1, note: "Escala si le superas nivel." },
  { id: "lureBall", name: "Lure Ball", cost: 160, mod: 1, note: "Mejor contra agua." },
  { id: "moonBall", name: "Moon Ball", cost: 180, mod: 1.75, note: "Buen bonus mistico." },
  { id: "friendBall", name: "Friend Ball", cost: 170, mod: 1.2, note: "Buen trato al capturado." },
  { id: "loveBall", name: "Love Ball", cost: 170, mod: 1.55, note: "Bonus estable." },
  { id: "heavyBall", name: "Heavy Ball", cost: 190, mod: 1, note: "Mejor contra pesos pesados." },
  { id: "fastBall", name: "Fast Ball", cost: 180, mod: 1, note: "Mejor contra veloces." },
  { id: "dreamBall", name: "Dream Ball", cost: 240, mod: 2.35, note: "Muy buena contra raros." },
  { id: "beastBall", name: "Beast Ball", cost: 300, mod: 1.05, note: "Dificil, pero sube contra legendarios." },
  { id: "safariBall", name: "Safari Ball", cost: 130, mod: 1.5, note: "Solida para la ruta." },
  { id: "sportBall", name: "Sport Ball", cost: 150, mod: 1.5, note: "Mejor contra bicho." },
  { id: "cherishBall", name: "Cherish Ball", cost: 650, mod: 2.8, note: "Cara y potente." }
];

const POTIONS = [
  { id: "potion", name: "Pocion", cost: 65, heal: 30, note: "Cura 30 PS." },
  { id: "superPotion", name: "Super Pocion", cost: 135, heal: 70, note: "Cura 70 PS." },
  { id: "hyperPotion", name: "Hiper Pocion", cost: 280, heal: 150, note: "Cura 150 PS." },
  { id: "maxPotion", name: "Max Pocion", cost: 520, heal: "full", note: "Cura todos los PS." },
  { id: "fullRestore", name: "Restaurar Todo", cost: 760, heal: "full", note: "Cura completo." },
  { id: "freshWater", name: "Agua Fresca", cost: 90, heal: 50, note: "Cura 50 PS." },
  { id: "sodaPop", name: "Refresco", cost: 120, heal: 60, note: "Cura 60 PS." },
  { id: "lemonade", name: "Limonada", cost: 160, heal: 80, note: "Cura 80 PS." },
  { id: "moomooMilk", name: "Leche Mumu", cost: 210, heal: 100, note: "Cura 100 PS." }
];

const ITEM_SLUGS = {
  pokeBall: "poke-ball",
  greatBall: "great-ball",
  ultraBall: "ultra-ball",
  masterBall: "master-ball",
  premierBall: "premier-ball",
  healBall: "heal-ball",
  netBall: "net-ball",
  nestBall: "nest-ball",
  repeatBall: "repeat-ball",
  timerBall: "timer-ball",
  quickBall: "quick-ball",
  duskBall: "dusk-ball",
  diveBall: "dive-ball",
  luxuryBall: "luxury-ball",
  levelBall: "level-ball",
  lureBall: "lure-ball",
  moonBall: "moon-ball",
  friendBall: "friend-ball",
  loveBall: "love-ball",
  heavyBall: "heavy-ball",
  fastBall: "fast-ball",
  dreamBall: "dream-ball",
  beastBall: "beast-ball",
  safariBall: "safari-ball",
  sportBall: "sport-ball",
  cherishBall: "cherish-ball",
  potion: "potion",
  superPotion: "super-potion",
  hyperPotion: "hyper-potion",
  maxPotion: "max-potion",
  fullRestore: "full-restore",
  freshWater: "fresh-water",
  sodaPop: "soda-pop",
  lemonade: "lemonade",
  moomooMilk: "moomoo-milk"
};

const ACHIEVEMENTS = [
  { id: "capture-1", title: "Primer registro", description: "Captura 1 Pokemon.", goal: 1, progress: () => state.stats.captures, rewards: { gold: 120, items: { greatBall: 2 } } },
  { id: "capture-10", title: "Coleccion inicial", description: "Captura 10 Pokemon.", goal: 10, progress: () => state.stats.captures, rewards: { gold: 450, items: { ultraBall: 2, superPotion: 2 } } },
  { id: "capture-25", title: "Caja en marcha", description: "Captura 25 Pokemon.", goal: 25, progress: () => state.stats.captures, rewards: { gold: 1100, items: { quickBall: 2, duskBall: 2 } } },
  { id: "defeat-15", title: "Entrenador firme", description: "Derrota 15 Pokemon salvajes.", goal: 15, progress: () => state.stats.defeats, rewards: { gold: 700, items: { hyperPotion: 2 } } },
  { id: "legendary-1", title: "Pulso legendario", description: "Captura 1 Pokemon legendario.", goal: 1, progress: () => state.stats.legendaryCaptures, rewards: { gold: 1600, items: { masterBall: 1 } } },
  { id: "legendary-3", title: "Archivo legendario", description: "Captura 3 Pokemon legendarios.", goal: 3, progress: () => state.stats.legendaryCaptures, rewards: { gold: 3200, items: { cherishBall: 2, maxPotion: 2 } } },
  { id: "shiny-1", title: "Destello raro", description: "Captura 1 Pokemon variocolor.", goal: 1, progress: () => state.stats.shinyCaptures, rewards: { gold: 1800, items: { dreamBall: 2 } } }
];

const MISSION_BLUEPRINTS = [
  { type: "steps", title: "Patrulla de ruta", verb: "Camina", stat: () => state.steps, range: [6, 16], rewards: (goal) => ({ gold: 80 + goal * 12, items: { pokeBall: 2 } }) },
  { type: "captures", title: "Registro de campo", verb: "Captura", stat: () => state.stats.captures, range: [1, 4], rewards: (goal) => ({ gold: 130 + goal * 90, items: { greatBall: Math.max(1, goal) } }) },
  { type: "defeats", title: "Entrenamiento salvaje", verb: "Derrota", stat: () => state.stats.defeats, range: [2, 6], rewards: (goal) => ({ gold: 110 + goal * 55, items: { superPotion: 1 } }) },
  { type: "ballsThrown", title: "Practica de lanzamiento", verb: "Usa", noun: "Balls", stat: () => state.stats.ballsThrown, range: [2, 6], rewards: (goal) => ({ gold: 90 + goal * 30, items: { pokeBall: goal + 1 } }) },
  { type: "potionsUsed", title: "Cuidado del equipo", verb: "Usa", noun: "curas", stat: () => state.stats.potionsUsed, range: [1, 3], rewards: (goal) => ({ gold: 120 + goal * 55, items: { lemonade: 1 } }) },
  { type: "shopPurchases", title: "Reabastecimiento", verb: "Compra", noun: "articulos", stat: () => state.stats.shopPurchases, range: [1, 4], rewards: (goal) => ({ gold: 90 + goal * 40, items: { premierBall: 1 } }) },
  { type: "centerHeals", title: "Equipo sano", verb: "Cura el equipo", noun: "veces", stat: () => state.stats.centerHeals, range: [1, 2], rewards: (goal) => ({ gold: 130 + goal * 80, items: { sodaPop: 1 } }) },
  { type: "rareCaptures", title: "Informe raro", verb: "Captura", noun: "legendario o mitico", stat: () => state.stats.legendaryCaptures + state.stats.mythicalCaptures, range: [1, 1], rewards: () => ({ gold: 1100, items: { ultraBall: 3, hyperPotion: 1 } }) },
  { type: "shinyCaptures", title: "Destello especial", verb: "Captura", noun: "variocolor", stat: () => state.stats.shinyCaptures, range: [1, 1], rewards: () => ({ gold: 1400, items: { dreamBall: 1 } }) }
];

const fallbackPokemon = [
  fallback(1, "bulbasaur", 45, 49, 49, 65, 65, 45, "grass"),
  fallback(4, "charmander", 39, 52, 43, 60, 50, 65, "fire"),
  fallback(7, "squirtle", 44, 48, 65, 50, 64, 43, "water"),
  fallback(25, "pikachu", 35, 55, 40, 50, 50, 90, "electric")
];

const els = {
  gold: $("#gold"),
  steps: $("#steps"),
  caughtCount: $("#caughtCount"),
  inventory: $("#inventory"),
  shopInventory: $("#shopInventory"),
  encounterHint: $("#encounterHint"),
  battleMessage: $("#battleMessage"),
  wildSlot: $("#wildSlot"),
  fieldWildSprite: $("#fieldWildSprite"),
  fieldWildName: $("#fieldWildName"),
  fieldWildLevel: $("#fieldWildLevel"),
  fieldWildTags: $("#fieldWildTags"),
  wildHpBar: $("#wildHpBar"),
  wildDamagePop: $("#wildDamagePop"),
  fieldActiveSprite: $("#fieldActiveSprite"),
  fieldActiveName: $("#fieldActiveName"),
  fieldActiveLevel: $("#fieldActiveLevel"),
  fieldActiveTags: $("#fieldActiveTags"),
  activeHpBar: $("#activeHpBar"),
  activeDamagePop: $("#activeDamagePop"),
  activeName: $("#activeName"),
  activeMeta: $("#activeMeta"),
  activeSprite: $("#activeSprite"),
  activeLevel: $("#activeLevel"),
  activeXp: $("#activeXp"),
  battleLog: $("#battleLog"),
  collectionList: $("#collectionList"),
  template: $("#collectionTemplate"),
  walkBtn: $("#walkBtn"),
  attackBtn: $("#attackBtn"),
  ballBtn: $("#ballBtn"),
  potionBtn: $("#potionBtn"),
  collectionBtn: $("#collectionBtn"),
  shopBtn: $("#shopBtn"),
  centerBtn: $("#centerBtn"),
  achievementsBtn: $("#achievementsBtn"),
  missionsBtn: $("#missionsBtn"),
  logBtn: $("#logBtn"),
  sortBtn: $("#sortBtn"),
  ballShopList: $("#ballShopList"),
  potionShopList: $("#potionShopList"),
  ballBagList: $("#ballBagList"),
  potionBagList: $("#potionBagList"),
  capturePreview: $("#capturePreview"),
  healPreview: $("#healPreview"),
  statsKind: $("#statsKind"),
  statsName: $("#statsName"),
  statsMeta: $("#statsMeta"),
  statsDescription: $("#statsDescription"),
  statsSprite: $("#statsSprite"),
  statsGrid: $("#statsGrid"),
  statsActions: $("#statsActions"),
  centerText: $("#centerText"),
  centerHealBtn: $("#centerHealBtn"),
  resultTitle: $("#resultTitle"),
  resultKind: $("#resultKind"),
  resultName: $("#resultName"),
  resultText: $("#resultText"),
  resultSprite: $("#resultSprite"),
  rewardList: $("#rewardList"),
  resultCenterBtn: $("#resultCenterBtn"),
  resultCloseBtn: $("#resultCloseBtn"),
  achievementList: $("#achievementList"),
  missionList: $("#missionList")
};

const state = upgradeState(loadState());
let busy = false;

boot();

async function boot() {
  bindEvents();
  renderShop();
  if (!state.collection.length) {
    const starter = await fetchPokemon([1, 4, 7, 25][randomInt(0, 3)]);
    const mon = createOwnedPokemon(starter, 5, false);
    state.collection.push(mon);
    state.activeId = mon.uid;
    log(`Tu aventura empieza con ${mon.displayName}.`);
  }
  ensureActiveMissions();
  render();
  save();
}

function bindEvents() {
  els.walkBtn.addEventListener("click", walk);
  els.attackBtn.addEventListener("click", attack);
  els.ballBtn.addEventListener("click", openBallBag);
  els.potionBtn.addEventListener("click", openPotionBag);
  els.fieldActiveSprite.addEventListener("click", () => showPokemonStats(getActive(), "capturado"));
  els.fieldActiveName.addEventListener("click", () => showPokemonStats(getActive(), "capturado"));
  els.fieldWildSprite.addEventListener("click", () => showPokemonStats(state.wild, "salvaje"));
  els.fieldWildName.addEventListener("click", () => showPokemonStats(state.wild, "salvaje"));
  els.collectionBtn.addEventListener("click", () => openModal("collectionModal"));
  els.shopBtn.addEventListener("click", () => openModal("shopModal"));
  els.centerBtn.addEventListener("click", openCenterForManualHeal);
  els.achievementsBtn.addEventListener("click", () => {
    renderAchievements();
    openModal("achievementsModal");
  });
  els.missionsBtn.addEventListener("click", () => {
    renderMissions();
    openModal("missionsModal");
  });
  els.logBtn.addEventListener("click", () => openModal("logModal"));
  els.centerHealBtn.addEventListener("click", healTeamAtCenter);
  els.resultCenterBtn.addEventListener("click", () => {
    closeModal("resultModal");
    openCenterForManualHeal();
  });
  els.sortBtn.addEventListener("click", () => {
    state.collection.sort((a, b) => powerScore(b) - powerScore(a));
    render();
    save();
  });
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
  });
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal && modal.id !== "walkModal") closeModal(modal.id);
    });
  });
}

async function walk() {
  if (busy) return;
  setBusy(true);
  openModal("walkModal");
  await wait(520);
  state.steps += 1;
  state.gold += 8 + Math.floor(Math.random() * 9);
  log("Caminaste por la hierba alta. +oro");

  if (state.wild) {
    log(`${state.wild.displayName} sigue frente a ti.`);
    setMessage(`${state.wild.displayName} sigue en combate.`);
  } else {
    await spawnWild();
  }

  closeModal("walkModal");
  setBusy(false);
  render();
  save();
}

async function spawnWild() {
  const pick = pickEncounterId();
  const data = await fetchPokemon(pick.id);
  const active = getActive();
  const spread = Math.max(4, Math.floor((active?.level || 5) * 0.22));
  const levelBoost = pick.rarity === "legendary" ? randomInt(3, 8) : pick.rarity === "mythical" ? randomInt(6, 12) : 0;
  const level = clamp((active?.level || 5) + randomInt(-spread, spread + 3) + levelBoost, 2, MAX_LEVEL);
  state.wild = createBattlePokemon(data, level, Math.random() < SHINY_RATE, pick.rarity);
  state.wild.turns = 1;
  if (!state.wild.sprite) state.wild.sprite = spriteUrl(state.wild.apiId);
  if (!state.wild.shinySprite) state.wild.shinySprite = shinySpriteUrl(state.wild.apiId);
  log(`Aparecio ${state.wild.displayName} Nv. ${state.wild.level}${rarityText(state.wild)}.`);
  setMessage(`Aparecio ${state.wild.displayName}.`);
}

function pickEncounterId() {
  const roll = Math.random();
  if (roll < 0.006) return { id: sample([...MYTHICAL_IDS]), rarity: "mythical" };
  if (roll < 0.026) return { id: sample([...LEGENDARY_IDS]), rarity: "legendary" };
  let id = randomInt(1, MAX_POKEMON_ID);
  while (LEGENDARY_IDS.has(id) || MYTHICAL_IDS.has(id)) id = randomInt(1, MAX_POKEMON_ID);
  return { id, rarity: "normal" };
}

async function fetchPokemon(id) {
  try {
    const response = await fetch(`${API_ROOT}/pokemon/${id}`);
    if (!response.ok) throw new Error("Pokemon no disponible");
    const data = await response.json();
    if (!findSprite(data.sprites)) throw new Error("Sprite no disponible");
    data.speciesData = await fetchPokemonSpecies(data.id);
    return data;
  } catch {
    return fallbackPokemon[randomInt(0, fallbackPokemon.length - 1)];
  }
}

async function fetchPokemonSpecies(id) {
  try {
    const response = await fetch(`${API_ROOT}/pokemon-species/${id}`);
    if (!response.ok) throw new Error("Species no disponible");
    return await response.json();
  } catch {
    return null;
  }
}

function attack() {
  const active = getActive();
  const wild = state.wild;
  if (!active || !wild) return;

  const playerDamage = calcDamage(active, wild);
  wild.currentHp = clamp(wild.currentHp - playerDamage, 0, wild.maxHp);
  animate(els.fieldActiveSprite, "lunge");
  animate(els.fieldWildSprite, "hit");
  showDamage(els.wildDamagePop, playerDamage);
  log(`${active.displayName} golpeo por ${playerDamage}.`);

  if (wild.currentHp <= 0) {
    defeatWild();
  } else {
    wild.turns += 1;
    const enemyDamage = calcDamage(wild, active);
    active.currentHp = clamp(active.currentHp - enemyDamage, 0, active.maxHp);
    animate(els.fieldWildSprite, "lunge");
    animate(els.fieldActiveSprite, "hit");
    showDamage(els.activeDamagePop, enemyDamage);
    log(`${wild.displayName} contraataco por ${enemyDamage}.`);
    if (active.currentHp <= 0) {
      sendToPokemonCenter(`${active.displayName} se debilito. Pierdes la chance de capturarlo.`);
    } else {
      setMessage(`${active.displayName} golpeo. ${wild.displayName} contraataco.`);
    }
  }
  render();
  save();
}

function openBallBag() {
  if (!state.wild) return;
  renderBallBag();
  openModal("ballBagModal");
}

function openPotionBag() {
  renderPotionBag();
  openModal("potionBagModal");
}

function throwBall(ballId) {
  const ball = BALLS.find((item) => item.id === ballId);
  const wild = state.wild;
  const active = getActive();
  if (!ball || !wild || !active || getItem(ball.id) <= 0) return;

  addItem(ball.id, -1);
  state.stats.ballsThrown += 1;
  closeModal("ballBagModal");
  animate(els.fieldWildSprite, "catch");

  const chance = captureChance(ball, wild, active);
  if (ball.id === "masterBall" || Math.random() < chance) {
    captureWild(ball);
  } else {
    log(`${wild.displayName} escapo de la ${ball.name}.`);
    wild.turns += 1;
    const damage = calcDamage(wild, active);
    active.currentHp = clamp(active.currentHp - damage, 0, active.maxHp);
    animate(els.fieldWildSprite, "lunge");
    animate(els.fieldActiveSprite, "hit");
    showDamage(els.activeDamagePop, damage);
    setMessage(`${wild.displayName} escapo y contraataco.`);
    if (active.currentHp <= 0) {
      sendToPokemonCenter(`${active.displayName} no resistio el contraataque.`);
    }
  }
  render();
  save();
}

function usePotion(itemId) {
  const item = POTIONS.find((potion) => potion.id === itemId);
  const active = getActive();
  if (!item || !active || getItem(item.id) <= 0 || active.currentHp >= active.maxHp) return;

  addItem(item.id, -1);
  state.stats.potionsUsed += 1;
  closeModal("potionBagModal");
  const heal = item.heal === "full" ? active.maxHp - active.currentHp : item.heal;
  active.currentHp = clamp(active.currentHp + heal, 0, active.maxHp);
  log(`${active.displayName} recupero ${heal} PS con ${item.name}.`);
  setMessage(`${active.displayName} recupero PS.`);
  render();
  save();
}

function captureWild(ball) {
  const wild = state.wild;
  const owned = { ...wild, xp: 0, currentHp: wild.maxHp };
  if (ball.id === "healBall" || ball.id === "friendBall") owned.currentHp = owned.maxHp;
  const duplicate = findWeakestDuplicate(owned);
  const goldReward = captureReward(owned, ball);
  const rewards = [
    { label: "Oro", value: `+${goldReward}` },
    { label: "Captura", value: `${owned.displayName} Nv. ${owned.level}` }
  ];
  state.collection.push(owned);
  state.caught += 1;
  state.stats.captures += 1;
  if (owned.shiny) state.stats.shinyCaptures += 1;
  if (owned.rarity === "legendary") state.stats.legendaryCaptures += 1;
  if (owned.rarity === "mythical") state.stats.mythicalCaptures += 1;
  state.gold += goldReward;

  if (!state.activeId || powerScore(owned) > powerScore(getActive())) {
    state.activeId = owned.uid;
    log(`${owned.displayName} se une al equipo activo.`);
    rewards.push({ label: "Equipo", value: "Nuevo Pokemon activo" });
  } else {
    log(`Capturaste a ${owned.displayName} con ${ball.name}.`);
  }

  if (duplicate && powerScore(owned) > powerScore(duplicate)) {
    releaseById(duplicate.uid, false);
    state.gold += 35;
    rewards.push({ label: "Duplicado liberado", value: "+35 oro" });
    log(`Liberaste al duplicado mas debil de ${owned.displayName}. +35 oro`);
  }
  setMessage(`${owned.displayName} fue capturado.`);
  state.wild = null;
  showResultModal({
    title: "Captura lograda",
    kind: `${ball.name} - ${rarityLabel(owned)}${owned.shiny ? " variocolor" : ""}`,
    name: owned.displayName,
    text: `${owned.displayName} se agrego a tu coleccion.`,
    sprite: owned.shiny ? owned.shinySprite : owned.sprite,
    rewards
  });
}

function defeatWild() {
  const wild = state.wild;
  const active = getActive();
  const gold = 20 + wild.level * 3 + (wild.shiny ? 180 : 0) + (wild.rarity === "legendary" ? 260 : wild.rarity === "mythical" ? 420 : 0);
  const xp = 18 + wild.level * 4 + (wild.shiny ? 120 : 0) + (wild.rarity !== "normal" ? 160 : 0);
  state.gold += gold;
  state.stats.defeats += 1;
  gainXp(active, xp);
  log(`Venciste a ${wild.displayName}. +${gold} oro.`);
  setMessage(`Venciste a ${wild.displayName}.`);
  state.wild = null;
  showResultModal({
    title: "Victoria",
    kind: `${rarityLabel(wild)} derrotado`,
    name: wild.displayName,
    text: `${active.displayName} gano el combate.`,
    sprite: wild.shiny ? wild.shinySprite : wild.sprite,
    rewards: [
      { label: "Oro", value: `+${gold}` },
      { label: "Experiencia", value: `+${xp} XP` },
      { label: "Derrotas", value: `${state.stats.defeats}` }
    ]
  });
}

function sendToPokemonCenter(reason) {
  const active = getActive();
  const defeatedSprite = active ? (active.shiny ? active.shinySprite : active.sprite) : itemIconUrl("potion");
  const abandoned = state.wild?.displayName || "el Pokemon salvaje";
  state.gold = Math.max(0, state.gold - 35);
  state.wild = null;
  state.collection.forEach((mon) => {
    mon.currentHp = mon.maxHp;
  });
  state.stats.centerHeals += 1;
  els.centerText.textContent = `${reason} La enfermera restauro todo tu equipo. El encuentro se perdio y pagaste 35 oro.`;
  els.centerHealBtn.textContent = "Equipo curado";
  els.centerHealBtn.disabled = true;
  log(`${reason} Centro Pokemon: equipo curado. -35 oro`);
  setMessage("Tu equipo fue curado en el Centro Pokemon.");
  showResultModal({
    title: "DERROTADO",
    kind: "Centro Pokemon",
    name: active?.displayName || "Equipo debilitado",
    text: `${reason} Tu equipo fue enviado al Centro Pokemon y ${abandoned} escapo.`,
    sprite: defeatedSprite,
    rewards: [
      { label: "Penalizacion", value: "-35 oro" },
      { label: "Encuentro", value: "Perdido" },
      { label: "Equipo", value: "Curado completo" }
    ],
    variant: "danger",
    showCenterButton: false
  });
}

function openCenterForManualHeal() {
  const needsHeal = state.collection.some((mon) => mon.currentHp < mon.maxHp);
  const hasEncounter = Boolean(state.wild);
  els.centerText.textContent = needsHeal
    ? hasEncounter
      ? "La enfermera puede curar todo tu equipo gratis. Si curas ahora, abandonas el encuentro activo."
      : "La enfermera puede curar todo tu equipo gratis."
    : hasEncounter
      ? "Tu equipo esta completo, pero volver al Centro Pokemon abandona el encuentro activo."
      : "Tu equipo ya esta con todos los PS al maximo.";
  els.centerHealBtn.textContent = needsHeal || hasEncounter ? "Ir al Centro Pokemon" : "Equipo curado";
  els.centerHealBtn.disabled = !needsHeal && !hasEncounter;
  openModal("centerModal");
}

function healTeamAtCenter() {
  const abandoned = state.wild?.displayName || null;
  state.wild = null;
  state.collection.forEach((mon) => {
    mon.currentHp = mon.maxHp;
  });
  state.stats.centerHeals += 1;
  els.centerText.textContent = abandoned
    ? `Todo tu equipo recupero sus PS. ${abandoned} ya no esta en la ruta.`
    : "Todo tu equipo recupero sus PS.";
  els.centerHealBtn.textContent = "Equipo curado";
  els.centerHealBtn.disabled = true;
  log(abandoned ? `Centro Pokemon: equipo curado. ${abandoned} fue abandonado.` : "Centro Pokemon: equipo curado.");
  setMessage("Tu equipo fue curado en el Centro Pokemon.");
  render();
  save();
}

function buyItem(itemId, cost, name) {
  if (state.gold < cost) {
    log(`Te falta oro para comprar ${name}.`);
    setMessage(`No alcanza el oro para ${name}.`);
    return;
  }
  state.gold -= cost;
  addItem(itemId, 1);
  state.stats.shopPurchases += 1;
  log(`Compraste 1 ${name}.`);
  render();
  save();
}

function render() {
  const active = getActive();
  const inventoryText = `${totalBalls()} Balls - ${totalHealingItems()} curas`;
  els.gold.textContent = state.gold;
  els.steps.textContent = state.steps;
  els.caughtCount.textContent = state.caught;
  els.inventory.textContent = inventoryText;
  els.shopInventory.textContent = inventoryText;
  renderActive(active);
  renderWild();
  renderCollection();
  renderLog();
  renderPotionBag();
  renderBallBag();
  renderAchievements();
  renderMissions();
  els.attackBtn.disabled = !state.wild;
  els.ballBtn.disabled = !state.wild || totalBalls() <= 0;
  els.potionBtn.disabled = !active || active.currentHp >= active.maxHp || totalHealingItems() <= 0;
}

function renderActive(active) {
  if (!active) return;
  const sprite = active.shiny ? active.shinySprite : active.sprite;
  els.activeName.textContent = `${active.displayName}${active.shiny ? " variocolor" : ""}`;
  els.activeMeta.textContent = `${active.types.join(" / ")} - poder ${powerScore(active)}`;
  els.activeSprite.src = sprite;
  els.activeSprite.onerror = () => setFallbackSprite(els.activeSprite, active);
  els.activeSprite.alt = active.displayName;
  els.fieldActiveSprite.src = sprite;
  els.fieldActiveSprite.onerror = () => setFallbackSprite(els.fieldActiveSprite, active);
  els.fieldActiveSprite.alt = active.displayName;
  els.fieldActiveName.textContent = active.displayName;
  els.fieldActiveLevel.textContent = `Nv. ${active.level}`;
  els.fieldActiveTags.textContent = `${active.types.join(" / ")} - PS ${active.currentHp}/${active.maxHp}`;
  els.activeHpBar.style.width = `${hpPercent(active)}%`;
  els.activeLevel.textContent = `Nv. ${active.level}`;
  els.activeXp.textContent = active.level >= MAX_LEVEL ? "Nivel maximo" : `${active.xp} / ${xpNeeded(active.level)} XP`;
}

function renderWild() {
  const wild = state.wild;
  els.wildSlot.classList.toggle("empty", !wild);
  if (!wild) {
    els.fieldWildSprite.removeAttribute("src");
    els.fieldWildSprite.alt = "";
    els.fieldWildName.textContent = "Sin encuentro";
    els.fieldWildLevel.textContent = "Nv. --";
    els.fieldWildTags.textContent = "Camina para buscar un Pokemon.";
    els.wildHpBar.style.width = "0%";
    els.encounterHint.textContent = "Caminar ahora siempre trae un encuentro si no hay combate activo.";
    return;
  }
  els.fieldWildSprite.src = wild.shiny ? wild.shinySprite : wild.sprite;
  els.fieldWildSprite.onerror = () => setFallbackSprite(els.fieldWildSprite, wild);
  els.fieldWildSprite.alt = wild.displayName;
  els.fieldWildName.textContent = wild.displayName;
  els.fieldWildLevel.textContent = `Nv. ${wild.level}`;
  els.fieldWildTags.textContent = `${rarityLabel(wild)}${wild.shiny ? " variocolor - " : " - "}${wild.types.join(" / ")} - PS ${wild.currentHp}/${wild.maxHp}`;
  els.wildHpBar.style.width = `${hpPercent(wild)}%`;
  els.encounterHint.textContent = `${rarityLabel(wild)}: captura estimada con Poke Ball ${Math.round(captureChance(BALLS[0], wild, getActive()) * 100)}%.`;
}

function renderShop() {
  els.ballShopList.innerHTML = "";
  els.potionShopList.innerHTML = "";
  BALLS.forEach((ball) => els.ballShopList.appendChild(shopButton(ball)));
  POTIONS.forEach((potion) => els.potionShopList.appendChild(shopButton(potion)));
}

function shopButton(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.innerHTML = `${itemIconMarkup(item)}<span>${item.name}</span><strong>${item.cost} oro</strong><small>${item.note}</small>`;
  button.addEventListener("click", () => buyItem(item.id, item.cost, item.name));
  return button;
}

function renderBallBag() {
  els.ballBagList.innerHTML = "";
  const wild = state.wild;
  if (!wild) {
    els.capturePreview.textContent = "Sin encuentro activo.";
    return;
  }
  els.capturePreview.textContent = `${wild.displayName}: PS ${wild.currentHp}/${wild.maxHp}. Legendarios y miticos resisten mas.`;
  BALLS.forEach((ball) => {
    const owned = getItem(ball.id);
    if (owned <= 0) return;
    const button = document.createElement("button");
    button.type = "button";
    const chance = ball.id === "masterBall" ? 100 : Math.round(captureChance(ball, wild, getActive()) * 100);
    button.innerHTML = `${itemIconMarkup(ball)}<span>${ball.name} x${owned}</span><strong>${chance}% captura</strong><small>${ball.note}</small>`;
    button.addEventListener("click", () => throwBall(ball.id));
    els.ballBagList.appendChild(button);
  });
  if (!els.ballBagList.children.length) {
    els.ballBagList.innerHTML = "<p>No tienes Balls. Compra en la tienda.</p>";
  }
}

function renderPotionBag() {
  els.potionBagList.innerHTML = "";
  const active = getActive();
  if (!active) return;
  els.healPreview.textContent = `${active.displayName}: PS ${active.currentHp}/${active.maxHp}`;
  POTIONS.forEach((potion) => {
    const owned = getItem(potion.id);
    if (owned <= 0) return;
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = active.currentHp >= active.maxHp;
    button.innerHTML = `${itemIconMarkup(potion)}<span>${potion.name} x${owned}</span><strong>${potion.heal === "full" ? "Full" : `+${potion.heal} PS`}</strong><small>${potion.note}</small>`;
    button.addEventListener("click", () => usePotion(potion.id));
    els.potionBagList.appendChild(button);
  });
  if (!els.potionBagList.children.length) {
    els.potionBagList.innerHTML = "<p>No tienes curas. Compra en la tienda.</p>";
  }
}

function renderCollection() {
  els.collectionList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  state.collection.forEach((mon) => {
    const node = els.template.content.firstElementChild.cloneNode(true);
    const teamButton = node.querySelector(".team-button");
    const releaseButton = node.querySelector(".release-button");
    const image = node.querySelector("img");
    const name = node.querySelector("strong");
    const meta = node.querySelector("small");
    teamButton.classList.toggle("active", mon.uid === state.activeId);
    image.src = mon.shiny ? mon.shinySprite : mon.sprite;
    image.alt = mon.displayName;
    name.textContent = `${mon.displayName}${mon.shiny ? " *" : ""}`;
    meta.textContent = `Nv. ${mon.level} - ${rarityLabel(mon)} - poder ${powerScore(mon)}`;
    teamButton.addEventListener("click", () => showPokemonStats(mon, "capturado"));
    releaseButton.addEventListener("click", () => releaseById(mon.uid));
    fragment.appendChild(node);
  });
  els.collectionList.appendChild(fragment);
}

function renderAchievements() {
  renderProgressList(ACHIEVEMENTS, els.achievementList, "achievementsClaimed", "achievement");
}

function renderMissions() {
  ensureActiveMissions();
  renderMissionList();
}

function ensureActiveMissions() {
  state.activeMissions = Array.isArray(state.activeMissions) ? state.activeMissions.filter(isValidMission) : [];
  while (state.activeMissions.length < 3) {
    state.activeMissions.push(generateMission(state.activeMissions.map((mission) => mission.type)));
  }
  if (state.activeMissions.length > 3) state.activeMissions = state.activeMissions.slice(0, 3);
}

function generateMission(usedTypes = []) {
  const available = MISSION_BLUEPRINTS.filter((blueprint) => missionIsAvailable(blueprint) && !usedTypes.includes(blueprint.type));
  const pool = available.length ? available : MISSION_BLUEPRINTS.filter(missionIsAvailable);
  const blueprint = sample(pool.length ? pool : MISSION_BLUEPRINTS);
  const goal = randomInt(blueprint.range[0], blueprint.range[1]);
  return {
    id: `${blueprint.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: blueprint.type,
    title: blueprint.title,
    description: missionDescription(blueprint, goal),
    start: blueprint.stat(),
    goal,
    rewards: blueprint.rewards(goal),
    generatedAt: Date.now()
  };
}

function missionIsAvailable(blueprint) {
  if (blueprint.type === "rareCaptures") return state.stats.captures >= 5 || state.stats.defeats >= 8;
  if (blueprint.type === "shinyCaptures") return state.stats.captures >= 12;
  return true;
}

function missionDescription(blueprint, goal) {
  if (blueprint.type === "steps") return `${blueprint.verb} ${goal} pasos.`;
  if (blueprint.type === "captures") return `${blueprint.verb} ${goal} Pokemon.`;
  if (blueprint.type === "defeats") return `${blueprint.verb} ${goal} Pokemon salvajes.`;
  return `${blueprint.verb} ${goal} ${blueprint.noun || "veces"}.`;
}

function isValidMission(mission) {
  return mission && MISSION_BLUEPRINTS.some((blueprint) => blueprint.type === mission.type) && Number.isFinite(mission.start) && Number.isFinite(mission.goal);
}

function missionProgress(mission) {
  return Math.min(Math.max(0, missionCurrentValue(mission.type) - mission.start), mission.goal);
}

function missionCurrentValue(type) {
  const blueprint = MISSION_BLUEPRINTS.find((item) => item.type === type);
  return blueprint ? blueprint.stat() : 0;
}

function renderMissionList() {
  els.missionList.innerHTML = "";
  state.activeMissions.forEach((mission) => {
    const progress = missionProgress(mission);
    const percent = Math.round((progress / mission.goal) * 100);
    const ready = progress >= mission.goal;
    const card = document.createElement("article");
    card.className = "progress-card";
    card.innerHTML = `
      <header>
        <div>
          <strong>${mission.title}</strong>
          <p>${mission.description}</p>
        </div>
        <span>${progress}/${mission.goal}</span>
      </header>
      <div class="progress-bar"><span style="width: ${Math.min(percent, 100)}%"></span></div>
      <div class="progress-reward">${rewardSummary(mission.rewards)}</div>
    `;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = ready ? "Reclamar" : "Pendiente";
    button.disabled = !ready;
    button.addEventListener("click", () => claimMissionReward(mission.id));
    card.appendChild(button);
    els.missionList.appendChild(card);
  });
}

function renderProgressList(entries, container, claimedKey, type) {
  container.innerHTML = "";
  entries.forEach((entry) => {
    const progress = Math.min(entry.progress(), entry.goal);
    const percent = Math.round((progress / entry.goal) * 100);
    const claimed = state[claimedKey].includes(entry.id);
    const ready = progress >= entry.goal;
    const card = document.createElement("article");
    card.className = `progress-card${claimed ? " claimed" : ""}`;
    card.innerHTML = `
      <header>
        <div>
          <strong>${entry.title}</strong>
          <p>${entry.description}</p>
        </div>
        <span>${progress}/${entry.goal}</span>
      </header>
      <div class="progress-bar"><span style="width: ${percent}%"></span></div>
      <div class="progress-reward">${rewardSummary(entry.rewards)}</div>
    `;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = claimed ? "Reclamado" : ready ? "Reclamar" : "Pendiente";
    button.disabled = claimed || !ready;
    button.addEventListener("click", () => claimProgressReward(entry, claimedKey, type));
    card.appendChild(button);
    container.appendChild(card);
  });
}

function claimProgressReward(entry, claimedKey, type) {
  if (state[claimedKey].includes(entry.id) || entry.progress() < entry.goal) return;
  state[claimedKey].push(entry.id);
  const rewards = applyRewards(entry.rewards);
  log(`Reclamaste ${entry.title}.`);
  setMessage(`Recompensa reclamada: ${entry.title}.`);
  closeModal("achievementsModal");
  showResultModal({
    title: "Logro desbloqueado",
    kind: entry.title,
    name: entry.title,
    text: entry.description,
    sprite: rewards.sprite,
    rewards: rewards.lines,
    showCenterButton: false,
    closeText: "Aceptar"
  });
  render();
  save();
}

function claimMissionReward(missionId) {
  const index = state.activeMissions.findIndex((mission) => mission.id === missionId);
  if (index === -1) return;
  const mission = state.activeMissions[index];
  if (missionProgress(mission) < mission.goal) return;
  state.stats.missionsCompleted += 1;
  const rewards = applyRewards(mission.rewards);
  log(`Mision completada: ${mission.title}.`);
  setMessage(`Mision completada: ${mission.title}.`);
  state.activeMissions[index] = generateMission(state.activeMissions.map((item) => item.type));
  showResultModal({
    title: "Mision completada",
    kind: mission.title,
    name: mission.title,
    text: "Recompensa recibida. Se genero una nueva mision aleatoria.",
    sprite: rewards.sprite,
    rewards: rewards.lines,
    showCenterButton: false,
    closeText: "Aceptar"
  });
  render();
  save();
}

async function showPokemonStats(mon, kind) {
  if (!mon) return;
  if (!mon.description || mon.description.startsWith("Todavia no hay")) {
    await hydratePokemonSpecies(mon);
  }
  els.statsKind.textContent = kind === "salvaje" ? "Encuentro salvaje" : "Pokemon capturado";
  els.statsName.textContent = `${mon.displayName}${mon.shiny ? " variocolor" : ""}`;
  els.statsMeta.textContent = `Nv. ${mon.level} - ${rarityLabel(mon)} - ${mon.genus || "Pokemon"} - ${mon.types.join(" / ")} - PS ${mon.currentHp}/${mon.maxHp}`;
  els.statsDescription.textContent = `${mon.description || "Todavia no hay descripcion de Pokedex para este Pokemon."} Habitat: ${mon.habitat || "desconocido"} - captura base: ${mon.captureRate || "?"} - crecimiento: ${mon.growthRate || "desconocido"}.`;
  els.statsSprite.src = mon.shiny ? mon.shinySprite : mon.sprite;
  els.statsSprite.onerror = () => setFallbackSprite(els.statsSprite, mon);
  els.statsSprite.alt = mon.displayName;
  els.statsGrid.innerHTML = statMarkup(mon.stats);
  els.statsActions.innerHTML = "";

  if (kind !== "salvaje") {
    const activate = document.createElement("button");
    activate.type = "button";
    activate.textContent = mon.uid === state.activeId ? "Ya es activo" : "Hacer activo";
    activate.disabled = mon.uid === state.activeId;
    activate.addEventListener("click", () => {
      state.activeId = mon.uid;
      log(`${mon.displayName} ahora lidera el equipo.`);
      setMessage(`${mon.displayName} ahora lidera el equipo.`);
      render();
      save();
      closeModal("statsModal");
      closeModal("collectionModal");
    });

    const release = document.createElement("button");
    release.type = "button";
    release.textContent = "Liberar";
    release.className = "release-button";
    release.addEventListener("click", () => {
      releaseById(mon.uid);
      closeModal("statsModal");
    });
    els.statsActions.append(activate, release);
  }
  openModal("statsModal");
}

function captureChance(ball, wild, active) {
  if (!wild || !active) return 0;
  if (ball.id === "masterBall") return 1;
  const hpFactor = 1 - wild.currentHp / wild.maxHp;
  const levelPenalty = Math.max(0, wild.level - active.level) * 0.006;
  const rarityPenalty = wild.rarity === "legendary" ? 0.18 : wild.rarity === "mythical" ? 0.24 : 0;
  const shinyPenalty = wild.shiny ? 0.06 : 0;
  const base = 0.36 + hpFactor * 0.48 - levelPenalty - rarityPenalty - shinyPenalty;
  const modifier = ballModifier(ball, wild, active);
  return clamp(base * modifier, wild.rarity === "normal" ? 0.12 : 0.04, wild.rarity === "normal" ? 0.92 : 0.74);
}

function ballModifier(ball, wild, active) {
  let mod = ball.mod;
  if (ball.id === "quickBall") mod = wild.turns <= 1 ? 3.6 : 1.15;
  if (ball.id === "timerBall") mod = Math.min(4, 1 + wild.turns * 0.36);
  if (ball.id === "netBall" && hasAnyType(wild, ["water", "bug"])) mod = 3.2;
  if (ball.id === "diveBall" && hasAnyType(wild, ["water"])) mod = 3.0;
  if (ball.id === "lureBall" && hasAnyType(wild, ["water"])) mod = 3.0;
  if (ball.id === "sportBall" && hasAnyType(wild, ["bug"])) mod = 3.0;
  if (ball.id === "nestBall") mod = wild.level < 20 ? 3.2 : wild.level < 35 ? 2.2 : 1.1;
  if (ball.id === "repeatBall" && state.collection.some((mon) => mon.apiId === wild.apiId)) mod = 3.4;
  if (ball.id === "levelBall") {
    const ratio = active.level / Math.max(1, wild.level);
    mod = ratio >= 4 ? 4 : ratio >= 2 ? 3 : ratio > 1 ? 2 : 1;
  }
  if (ball.id === "heavyBall") mod = wild.weight >= 2000 ? 3.3 : wild.weight >= 1000 ? 2.2 : 1.1;
  if (ball.id === "fastBall") mod = wild.baseStats.speed >= 100 ? 3.2 : 1.1;
  if (ball.id === "beastBall" && wild.rarity !== "normal") mod = 4.2;
  if (ball.id === "dreamBall" && wild.rarity !== "normal") mod = 3.2;
  return mod;
}

function createBattlePokemon(data, level, shiny, forcedRarity = null) {
  const base = normalizePokemon(data);
  const stats = scaleStats(base.baseStats, level, base.rarity);
  return {
    ...base,
    rarity: forcedRarity || base.rarity,
    uid: uid(),
    level,
    shiny,
    stats,
    currentHp: stats.hp,
    maxHp: stats.hp,
    turns: 1
  };
}

function createOwnedPokemon(data, level, shiny) {
  return { ...createBattlePokemon(data, level, shiny), xp: 0 };
}

function normalizePokemon(data) {
  const baseStats = {};
  data.stats.forEach((item) => {
    baseStats[statKey(item.stat.name)] = item.base_stat;
  });
  const species = data.speciesData || {};
  const rarity = species.is_mythical || MYTHICAL_IDS.has(data.id) ? "mythical" : species.is_legendary || LEGENDARY_IDS.has(data.id) ? "legendary" : "normal";
  return {
    apiId: data.id,
    name: data.name,
    displayName: title(data.name),
    types: data.types.map((item) => item.type.name),
    sprite: findSprite(data.sprites) || spriteUrl(data.id),
    shinySprite: findSprite(data.sprites, true) || findSprite(data.sprites) || shinySpriteUrl(data.id),
    baseStats,
    weight: data.weight || 0,
    description: speciesDescription(species),
    genus: localizedEntry(species.genera, "genus") || "Pokemon",
    habitat: species.habitat?.name || "desconocido",
    captureRate: species.capture_rate || null,
    growthRate: species.growth_rate?.name || "desconocido",
    rarity
  };
}

function findSprite(sprites, shiny = false) {
  if (!sprites) return "";
  if (shiny) {
    return sprites.front_shiny || sprites.other?.home?.front_shiny || sprites.other?.["official-artwork"]?.front_shiny || "";
  }
  return sprites.front_default || sprites.other?.home?.front_default || sprites.other?.["official-artwork"]?.front_default || "";
}

function speciesDescription(species) {
  const text = localizedEntry(species.flavor_text_entries, "flavor_text");
  return text ? cleanFlavorText(text) : "Todavia no hay descripcion de Pokedex para este Pokemon.";
}

function localizedEntry(entries = [], key) {
  return entries.find((entry) => entry.language?.name === "es")?.[key]
    || entries.find((entry) => entry.language?.name === "en")?.[key]
    || "";
}

function cleanFlavorText(text) {
  return text.replace(/\f/g, " ").replace(/\s+/g, " ").trim();
}

async function hydratePokemonSpecies(mon) {
  if (!mon?.apiId) return;
  const species = await fetchPokemonSpecies(mon.apiId);
  if (!species) return;
  mon.description = speciesDescription(species);
  mon.genus = localizedEntry(species.genera, "genus") || mon.genus || "Pokemon";
  mon.habitat = species.habitat?.name || mon.habitat || "desconocido";
  mon.captureRate = species.capture_rate || mon.captureRate || null;
  mon.growthRate = species.growth_rate?.name || mon.growthRate || "desconocido";
  mon.rarity = species.is_mythical ? "mythical" : species.is_legendary ? "legendary" : mon.rarity;
  save();
}

function scaleStats(base, level, rarity = "normal") {
  const scale = 0.55 + level / 55;
  const rarityBoost = rarity === "mythical" ? 1.14 : rarity === "legendary" ? 1.1 : 1;
  return {
    hp: Math.floor(((base.hp * scale) + level * 2 + 18) * rarityBoost),
    attack: Math.floor((base.attack * scale + level) * rarityBoost),
    defense: Math.floor((base.defense * scale + level) * rarityBoost),
    spAtk: Math.floor((base.spAtk * scale + level) * rarityBoost),
    spDef: Math.floor((base.spDef * scale + level) * rarityBoost),
    speed: Math.floor((base.speed * scale + level) * rarityBoost)
  };
}

function calcDamage(attacker, defender) {
  const offense = Math.max(attacker.stats.attack, attacker.stats.spAtk);
  const defense = Math.max(8, Math.floor((defender.stats.defense + defender.stats.spDef) / 2));
  const base = 8 + attacker.level * 1.35 + offense * 0.4 - defense * 0.18;
  return Math.max(3, Math.floor(base * (0.84 + Math.random() * 0.32)));
}

function gainXp(mon, amount) {
  if (!mon || mon.level >= MAX_LEVEL) return;
  mon.xp += amount;
  while (mon.level < MAX_LEVEL && mon.xp >= xpNeeded(mon.level)) {
    mon.xp -= xpNeeded(mon.level);
    mon.level += 1;
    mon.stats = scaleStats(mon.baseStats, mon.level, mon.rarity);
    mon.maxHp = mon.stats.hp;
    mon.currentHp = mon.maxHp;
    log(`${mon.displayName} subio a Nv. ${mon.level}.`);
  }
  if (mon.level >= MAX_LEVEL) mon.xp = 0;
}

function xpNeeded(level) {
  return 30 + level * 12 + Math.floor(level ** 1.6);
}

function releaseById(uid, announce = true) {
  if (state.collection.length <= 1) {
    log("No puedes liberar a tu ultimo Pokemon.");
    return;
  }
  const mon = state.collection.find((item) => item.uid === uid);
  state.collection = state.collection.filter((item) => item.uid !== uid);
  if (state.activeId === uid) {
    state.activeId = [...state.collection].sort((a, b) => powerScore(b) - powerScore(a))[0].uid;
  }
  if (announce && mon) {
    state.gold += 20;
    log(`Liberaste a ${mon.displayName}. +20 oro`);
  }
  render();
  save();
}

function findWeakestDuplicate(candidate) {
  const duplicates = state.collection.filter((mon) => mon.apiId === candidate.apiId);
  return duplicates.length ? duplicates.sort((a, b) => powerScore(a) - powerScore(b))[0] : null;
}

function powerScore(mon) {
  return Object.values(mon.stats).reduce((sum, value) => sum + value, 0) + mon.level * 14 + (mon.shiny ? 450 : 0) + (mon.rarity === "legendary" ? 800 : mon.rarity === "mythical" ? 1100 : 0);
}

function captureReward(mon, ball) {
  let reward = mon.shiny ? 120 : 35;
  if (mon.rarity === "legendary") reward += 300;
  if (mon.rarity === "mythical") reward += 480;
  if (ball.id === "luxuryBall") reward += 80;
  return reward;
}

function showResultModal({ title, kind, name, text, sprite, rewards, variant = "normal", showCenterButton = true, closeText = "Seguir en la ruta" }) {
  document.querySelector("#resultModal").classList.toggle("danger-result", variant === "danger");
  els.resultCenterBtn.hidden = !showCenterButton;
  els.resultCloseBtn.textContent = closeText;
  els.resultTitle.textContent = title;
  els.resultKind.textContent = kind;
  els.resultName.textContent = name;
  els.resultText.textContent = text;
  els.resultSprite.src = sprite || itemIconUrl("pokeBall");
  els.resultSprite.onerror = () => {
    els.resultSprite.onerror = null;
    els.resultSprite.src = itemIconUrl("pokeBall");
  };
  els.rewardList.innerHTML = "";
  rewards.forEach((reward) => {
    const item = document.createElement("div");
    item.className = "reward-item";
    item.innerHTML = `${reward.icon ? `<img class="item-icon" src="${reward.icon}" alt="">` : ""}<span>${reward.label}</span><strong>${reward.value}</strong>`;
    els.rewardList.appendChild(item);
  });
  openModal("resultModal");
}

function applyRewards(rewards) {
  const lines = [];
  let sprite = itemIconUrl("pokeBall");
  if (rewards.gold) {
    state.gold += rewards.gold;
    lines.push({ label: "Oro", value: `+${rewards.gold}` });
  }
  Object.entries(rewards.items || {}).forEach(([id, amount], index) => {
    addItem(id, amount);
    const item = findItem(id);
    const icon = itemIconUrl(id);
    if (index === 0) sprite = icon;
    lines.push({ label: item?.name || id, value: `x${amount}`, icon });
  });
  return { lines, sprite };
}

function rewardSummary(rewards) {
  const parts = [];
  if (rewards.gold) parts.push(`${rewards.gold} oro`);
  Object.entries(rewards.items || {}).forEach(([id, amount]) => {
    const item = findItem(id);
    parts.push(`${item?.name || id} x${amount}`);
  });
  return parts.join(" - ");
}

function findItem(id) {
  return BALLS.find((item) => item.id === id) || POTIONS.find((item) => item.id === id);
}

function getActive() {
  return state.collection.find((mon) => mon.uid === state.activeId) || state.collection[0];
}

function statMarkup(stats) {
  const labels = { hp: "PS", attack: "Ataque", defense: "Defensa", spAtk: "At. esp.", spDef: "Def. esp.", speed: "Velocidad" };
  return Object.entries(labels).map(([key, label]) => `<span>${label}<strong>${stats[key]}</strong></span>`).join("");
}

function renderLog() {
  els.battleLog.innerHTML = state.log.map((item) => `<p>${item}</p>`).join("");
}

function loadState() {
  const base = {
    gold: 120,
    steps: 0,
    caught: 0,
    activeId: null,
    wild: null,
    collection: [],
    items: defaultItems(),
    stats: defaultStats(),
    achievementsClaimed: [],
    missionsClaimed: [],
    activeMissions: [],
    log: []
  };
  try {
    const savedKey = [SAVE_KEY, ...OLD_SAVE_KEYS].find((key) => localStorage.getItem(key));
    const saved = savedKey ? JSON.parse(localStorage.getItem(savedKey)) : null;
    return saved ? { ...base, ...saved } : base;
  } catch {
    return base;
  }
}

function upgradeState(raw) {
  const upgraded = { ...raw, items: { ...defaultItems(), ...(raw.items || {}) } };
  if (typeof raw.balls === "number") upgraded.items.pokeBall = raw.balls;
  if (typeof raw.potions === "number") upgraded.items.potion = raw.potions;
  upgraded.collection = (upgraded.collection || []).map(upgradePokemon);
  upgraded.wild = upgraded.wild ? upgradePokemon(upgraded.wild) : null;
  upgraded.stats = { ...defaultStats(), ...(raw.stats || {}) };
  upgraded.stats.captures = Math.max(upgraded.stats.captures, upgraded.caught || 0);
  upgraded.stats.legendaryCaptures = Math.max(upgraded.stats.legendaryCaptures, upgraded.collection.filter((mon) => mon.rarity === "legendary").length);
  upgraded.stats.mythicalCaptures = Math.max(upgraded.stats.mythicalCaptures, upgraded.collection.filter((mon) => mon.rarity === "mythical").length);
  upgraded.stats.shinyCaptures = Math.max(upgraded.stats.shinyCaptures, upgraded.collection.filter((mon) => mon.shiny).length);
  upgraded.achievementsClaimed = raw.achievementsClaimed || [];
  upgraded.missionsClaimed = raw.missionsClaimed || [];
  upgraded.activeMissions = raw.activeMissions || [];
  return upgraded;
}

function upgradePokemon(mon) {
  const rarity = mon.rarity || (MYTHICAL_IDS.has(mon.apiId) ? "mythical" : LEGENDARY_IDS.has(mon.apiId) ? "legendary" : "normal");
  const baseStats = mon.baseStats || mon.stats || { hp: 45, attack: 45, defense: 45, spAtk: 45, spDef: 45, speed: 45 };
  const stats = mon.stats || scaleStats(baseStats, mon.level || 5, rarity);
  const maxHp = mon.maxHp || stats.hp;
  return {
    ...mon,
    rarity,
    baseStats,
    stats,
    maxHp,
    currentHp: clamp(mon.currentHp ?? maxHp, 1, maxHp),
    turns: mon.turns || 1,
    weight: mon.weight || 0,
    description: mon.description || "Todavia no hay descripcion de Pokedex para este Pokemon.",
    genus: mon.genus || "Pokemon",
    habitat: mon.habitat || "desconocido",
    captureRate: mon.captureRate || null,
    growthRate: mon.growthRate || "desconocido",
    sprite: mon.sprite || spriteUrl(mon.apiId || 1),
    shinySprite: mon.shinySprite || mon.sprite || shinySpriteUrl(mon.apiId || 1)
  };
}

function defaultItems() {
  const items = {};
  BALLS.forEach((ball) => {
    items[ball.id] = 0;
  });
  POTIONS.forEach((potion) => {
    items[potion.id] = 0;
  });
  items.pokeBall = 6;
  items.potion = 3;
  return items;
}

function defaultStats() {
  return {
    captures: 0,
    defeats: 0,
    legendaryCaptures: 0,
    mythicalCaptures: 0,
    shinyCaptures: 0,
    missionsCompleted: 0,
    ballsThrown: 0,
    potionsUsed: 0,
    shopPurchases: 0,
    centerHeals: 0
  };
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function log(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 45);
  renderLog();
}

function fallback(id, name, hp, attack, defense, specialAttack, specialDefense, speed, type) {
  return {
    id,
    name,
    weight: 500,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
    },
    stats: makeStats(hp, attack, defense, specialAttack, specialDefense, speed),
    types: [{ type: { name: type } }]
  };
}

function makeStats(hp, attack, defense, specialAttack, specialDefense, speed) {
  return [
    { base_stat: hp, stat: { name: "hp" } },
    { base_stat: attack, stat: { name: "attack" } },
    { base_stat: defense, stat: { name: "defense" } },
    { base_stat: specialAttack, stat: { name: "special-attack" } },
    { base_stat: specialDefense, stat: { name: "special-defense" } },
    { base_stat: speed, stat: { name: "speed" } }
  ];
}

function statKey(name) {
  return { "special-attack": "spAtk", "special-defense": "spDef" }[name] || name;
}

function rarityLabel(mon) {
  if (mon.rarity === "mythical") return "Mitico";
  if (mon.rarity === "legendary") return "Legendario";
  return "Salvaje";
}

function rarityText(mon) {
  if (mon.rarity === "mythical") return " mitico";
  if (mon.rarity === "legendary") return " legendario";
  return "";
}

function hasAnyType(mon, types) {
  return mon.types.some((type) => types.includes(type));
}

function totalBalls() {
  return BALLS.reduce((sum, ball) => sum + getItem(ball.id), 0);
}

function totalHealingItems() {
  return POTIONS.reduce((sum, potion) => sum + getItem(potion.id), 0);
}

function getItem(id) {
  return state.items[id] || 0;
}

function addItem(id, amount) {
  state.items[id] = Math.max(0, getItem(id) + amount);
}

function hpPercent(mon) {
  return clamp(Math.round((mon.currentHp / mon.maxHp) * 100), 0, 100);
}

function setFallbackSprite(img, mon) {
  img.onerror = null;
  img.src = mon.shiny ? shinySpriteUrl(mon.apiId || 1) : spriteUrl(mon.apiId || 1);
}

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id || 1}.png`;
}

function shinySpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id || 1}.png`;
}

function itemIconMarkup(item) {
  return `<img class="item-icon" src="${itemIconUrl(item.id)}" alt="">`;
}

function itemIconUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${ITEM_SLUGS[id] || id}.png`;
}

function setMessage(message) {
  els.battleMessage.textContent = message;
}

function showDamage(element, amount) {
  element.textContent = `-${amount}`;
  element.classList.remove("show");
  window.requestAnimationFrame(() => {
    element.classList.add("show");
    window.setTimeout(() => element.classList.remove("show"), 680);
  });
}

function openModal(id) {
  document.querySelector(`#${id}`)?.classList.remove("hidden");
}

function closeModal(id) {
  document.querySelector(`#${id}`)?.classList.add("hidden");
}

function setBusy(value) {
  busy = value;
  els.walkBtn.disabled = value;
}

function animate(element, className) {
  element.classList.remove(className);
  window.requestAnimationFrame(() => {
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), 700);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(list) {
  return list[randomInt(0, list.length - 1)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function title(value) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function $(selector) {
  return document.querySelector(selector);
}
