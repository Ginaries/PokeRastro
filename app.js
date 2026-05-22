const API_ROOT = "https://pokeapi.co/api/v2";
const MAX_POKEMON_ID = 1025;
const SHINY_RATE = 1 / 90;
const MAX_LEVEL = 1000;
const SAVE_KEY = "pokerastro-save-v3";
const SESSION_KEY = "pokerastro-session";
const OLD_SAVE_KEYS = ["pokerastro-save-v2", "pokerastro-save-v1"];
const AUTO_BATTLE_LIMIT = 80;
const POKEMON_TYPES = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];
const CAPTURE_AREAS = Array.from({ length: MAX_LEVEL / 10 }, (_, index) => {
  const min = index * 10 + 1;
  return { id: index, name: `Area ${index + 1}`, min, max: min + 9 };
});
const typeIdCache = new Map();

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
const PSEUDO_LEGENDARY_IDS = new Set([149, 248, 373, 376, 445, 635, 706, 784, 887, 998]);

const BALLS = [
  { id: "pokeBall", name: "Poke Ball", cost: 45, mod: 0.95, note: "Basica, confiable contra salvajes comunes." },
  { id: "greatBall", name: "Great Ball", cost: 200, mod: 1.45, note: "Mejora general confiable." },
  { id: "ultraBall", name: "Ultra Ball", cost: 500, mod: 2.15, note: "Fuerte contra casi todo." },
  { id: "masterBall", name: "Master Ball", cost: 7500, mod: 999, note: "Captura garantizada." },
  { id: "premierBall", name: "Premier Ball", cost: 70, mod: 1.08, note: "Ligero bonus elegante." },
  { id: "healBall", name: "Heal Ball", cost: 85, mod: 1.1, note: "Captura y cura al nuevo." },
  { id: "netBall", name: "Net Ball", cost: 190, mod: 1.05, note: "Muy buena contra agua o bicho." },
  { id: "nestBall", name: "Nest Ball", cost: 175, mod: 1.0, note: "Mejor contra niveles bajos." },
  { id: "repeatBall", name: "Repeat Ball", cost: 210, mod: 1.05, note: "Mejor si ya lo tenias." },
  { id: "timerBall", name: "Timer Ball", cost: 230, mod: 1.0, note: "Sube con turnos." },
  { id: "quickBall", name: "Quick Ball", cost: 310, mod: 1.0, note: "Muy fuerte al inicio." },
  { id: "duskBall", name: "Dusk Ball", cost: 240, mod: 1.65, note: "Buena en esta ruta boscosa." },
  { id: "diveBall", name: "Dive Ball", cost: 190, mod: 0.9, note: "Muy buena contra agua." },
  { id: "luxuryBall", name: "Luxury Ball", cost: 320, mod: 1.05, note: "Mas oro al capturar." },
  { id: "levelBall", name: "Level Ball", cost: 260, mod: 0.85, note: "Escala si le superas nivel." },
  { id: "lureBall", name: "Lure Ball", cost: 205, mod: 0.9, note: "Muy buena contra agua." },
  { id: "moonBall", name: "Moon Ball", cost: 260, mod: 1.35, note: "Buen bonus mistico." },
  { id: "friendBall", name: "Friend Ball", cost: 210, mod: 1.0, note: "Buen trato al capturado." },
  { id: "loveBall", name: "Love Ball", cost: 220, mod: 1.25, note: "Bonus estable." },
  { id: "heavyBall", name: "Heavy Ball", cost: 250, mod: 0.85, note: "Mejor contra pesos pesados." },
  { id: "fastBall", name: "Fast Ball", cost: 245, mod: 0.85, note: "Mejor contra veloces." },
  { id: "dreamBall", name: "Dream Ball", cost: 420, mod: 1.8, note: "Muy buena contra raros." },
  { id: "beastBall", name: "Beast Ball", cost: 520, mod: 0.8, note: "Dificil, pero sube contra raros." },
  { id: "safariBall", name: "Safari Ball", cost: 170, mod: 1.1, note: "Solida para la ruta." },
  { id: "sportBall", name: "Sport Ball", cost: 195, mod: 1.1, note: "Mejor contra bicho." },
  { id: "cherishBall", name: "Cherish Ball", cost: 1100, mod: 2.35, note: "Cara y potente." }
];

const POTIONS = [
  { id: "potion", name: "Pocion", cost: 65, heal: 30, note: "Cura 30 PS." },
  { id: "superPotion", name: "Super Pocion", cost: 135, heal: 70, note: "Cura 70 PS." },
  { id: "hyperPotion", name: "Hiper Pocion", cost: 280, heal: 150, note: "Cura 150 PS." },
  { id: "maxPotion", name: "Max Pocion", cost: 680, heal: "full", note: "Cura todos los PS." },
  { id: "fullRestore", name: "Restaurar Todo", cost: 460, healPercent: 0.72, note: "Cura 72% de los PS maximos." },
  { id: "freshWater", name: "Agua Fresca", cost: 90, heal: 50, note: "Cura 50 PS." },
  { id: "sodaPop", name: "Refresco", cost: 120, heal: 60, note: "Cura 60 PS." },
  { id: "lemonade", name: "Limonada", cost: 160, heal: 80, note: "Cura 80 PS." },
  { id: "moomooMilk", name: "Leche Mumu", cost: 210, heal: 100, note: "Cura 100 PS." }
];

const SHOP_ITEMS = [
  { id: "rareCandy", name: "Caramelo raro", cost: 1500, note: "Sube 1 nivel al Pokemon activo.", icon: "rare-candy" },
  { id: "hpUp", name: "Mas PS", cost: 5200, stat: "hp", boost: 0.06, note: "+6% PS al Pokemon activo. Sin limite." },
  { id: "protein", name: "Proteina", cost: 5600, stat: "attack", boost: 0.06, note: "+6% Ataque al Pokemon activo. Sin limite." },
  { id: "iron", name: "Hierro", cost: 5400, stat: "defense", boost: 0.06, note: "+6% Defensa al Pokemon activo. Sin limite." },
  { id: "calcium", name: "Calcio", cost: 5800, stat: "spAtk", boost: 0.06, note: "+6% At. esp. al Pokemon activo. Sin limite." },
  { id: "zinc", name: "Zinc", cost: 5400, stat: "spDef", boost: 0.06, note: "+6% Def. esp. al Pokemon activo. Sin limite." },
  { id: "carbos", name: "Carburante", cost: 5600, stat: "speed", boost: 0.06, note: "+6% Velocidad al Pokemon activo. Sin limite." }
];

const CARD_ITEMS = [
  { id: "cardCommon", name: "Carta comun", value: 90, chance: 0.28, icon: "coin-case" },
  { id: "cardRare", name: "Carta rara", value: 320, chance: 0.085, icon: "coin-case" },
  { id: "cardHolo", name: "Carta holo", value: 900, chance: 0.025, icon: "coin-case" },
  { id: "cardLegend", name: "Carta legendaria", value: 2400, chance: 0.007, icon: "coin-case" }
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
  moomooMilk: "moomoo-milk",
  rareCandy: "rare-candy",
  hpUp: "hp-up",
  protein: "protein",
  iron: "iron",
  calcium: "calcium",
  zinc: "zinc",
  carbos: "carbos",
  cardCommon: "coin-case",
  cardRare: "coin-case",
  cardHolo: "coin-case",
  cardLegend: "coin-case"
};

const STAT_LABELS = { hp: "PS", attack: "Ataque", defense: "Defensa", spAtk: "At. esp.", spDef: "Def. esp.", speed: "Velocidad" };

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
  shopGold: $("#shopGold"),
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
  areaSelect: $("#areaSelect"),
  areaHint: $("#areaHint"),
  collectionList: $("#collectionList"),
  template: $("#collectionTemplate"),
  walkBtn: $("#walkBtn"),
  autoBattleBtn: $("#autoBattleBtn"),
  attackBtn: $("#attackBtn"),
  ballBtn: $("#ballBtn"),
  potionBtn: $("#potionBtn"),
  collectionBtn: $("#collectionBtn"),
  pokedexBtn: $("#pokedexBtn"),
  shopBtn: $("#shopBtn"),
  centerBtn: $("#centerBtn"),
  achievementsBtn: $("#achievementsBtn"),
  missionsBtn: $("#missionsBtn"),
  logBtn: $("#logBtn"),
  sortBtn: $("#sortBtn"),
  logoutBtn: $("#logoutBtn"),
  resetAccountBtn: $("#resetAccountBtn"),
  ballShopList: $("#ballShopList"),
  potionShopList: $("#potionShopList"),
  itemShopList: $("#itemShopList"),
  cardShopList: $("#cardShopList"),
  quantityTitle: $("#quantityTitle"),
  quantityIcon: $("#quantityIcon"),
  quantityItemName: $("#quantityItemName"),
  quantityItemDetail: $("#quantityItemDetail"),
  quantityInput: $("#quantityInput"),
  quantityRange: $("#quantityRange"),
  quantitySummary: $("#quantitySummary"),
  quantityMaxBtn: $("#quantityMaxBtn"),
  quantityConfirmBtn: $("#quantityConfirmBtn"),
  ballBagList: $("#ballBagList"),
  potionBagList: $("#potionBagList"),
  pokedexIdSearch: $("#pokedexIdSearch"),
  pokedexTypeFilter: $("#pokedexTypeFilter"),
  pokedexRarityFilter: $("#pokedexRarityFilter"),
  pokedexSummary: $("#pokedexSummary"),
  pokedexList: $("#pokedexList"),
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
  missionList: $("#missionList"),
  adminBtn: $("#adminBtn"),
  adminUserSearch: $("#adminUserSearch"),
  adminSearchBtn: $("#adminSearchBtn"),
  adminRefreshUsersBtn: $("#adminRefreshUsersBtn"),
  adminUserList: $("#adminUserList"),
  adminUserSummary: $("#adminUserSummary"),
  adminGrantGold: $("#adminGrantGold"),
  adminGrantMasterBall: $("#adminGrantMasterBall"),
  adminGrantUltraBall: $("#adminGrantUltraBall"),
  adminGrantRareCandy: $("#adminGrantRareCandy"),
  adminItemSelect: $("#adminItemSelect"),
  adminItemAmount: $("#adminItemAmount"),
  adminGrantBtn: $("#adminGrantBtn"),
  adminStatus: $("#adminStatus"),
  accountUserId: $("#accountUserId"),
  accountPassword: $("#accountPassword"),
  accountStatus: $("#accountStatus"),
  loginBtn: $("#loginBtn"),
  createAccountBtn: $("#createAccountBtn"),
};

const state = upgradeState(loadState());
let busy = false;
let cloud = null;
let cloudSaveTimer = null;
let suppressCloudSave = false;
let currentAdminTarget = null;
let adminUsers = [];
let quantityAction = null;

boot();

async function boot() {
  initCloud();
  bindEvents();
  renderAreaSelect();
  renderPokedexTypeFilter();
  renderShop();
  renderAdminItemSelect();
  await ensureStarterPokemon();
  ensureActiveMissions();
  render();
  save();
  openAccountModalIfNeeded();
}

async function ensureStarterPokemon() {
  if (state.collection.length) return;
  const starter = await fetchPokemon([1, 4, 7, 25][randomInt(0, 3)]);
  const mon = createOwnedPokemon(starter, 5, false);
  state.collection.push(mon);
  state.activeId = mon.uid;
  log(`Tu aventura empieza con ${mon.displayName}.`);
}

function bindEvents() {
  els.walkBtn.addEventListener("click", walk);
  els.autoBattleBtn.addEventListener("click", autoBattle);
  els.attackBtn.addEventListener("click", attack);
  els.ballBtn.addEventListener("click", openBallBag);
  els.potionBtn.addEventListener("click", openPotionBag);
  els.fieldActiveSprite.addEventListener("click", () => showPokemonStats(getActive(), "capturado"));
  els.fieldActiveName.addEventListener("click", () => showPokemonStats(getActive(), "capturado"));
  els.fieldWildSprite.addEventListener("click", () => showPokemonStats(state.wild, "salvaje"));
  els.fieldWildName.addEventListener("click", () => showPokemonStats(state.wild, "salvaje"));
  els.collectionBtn.addEventListener("click", () => openModal("collectionModal"));
  els.pokedexBtn.addEventListener("click", () => {
    openModal("pokedexModal");
    renderPokedex(true);
  });
  els.shopBtn.addEventListener("click", () => openModal("shopModal"));
  els.areaSelect.addEventListener("change", () => {
    state.areaId = Number(els.areaSelect.value) || 0;
    state.wild = null;
    setMessage(`${selectedArea().name}: encuentros Nv. ${selectedArea().min}-${selectedArea().max}.`);
    render();
    save();
  });
  [els.pokedexIdSearch, els.pokedexTypeFilter, els.pokedexRarityFilter].forEach((control) => {
    control.addEventListener("input", () => renderPokedex(true));
    control.addEventListener("change", () => renderPokedex(true));
  });
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
  els.adminBtn.addEventListener("click", openAdminModal);
  els.adminSearchBtn.addEventListener("click", adminSearchUser);
  els.adminRefreshUsersBtn.addEventListener("click", loadAdminUsers);
  els.adminUserList.addEventListener("change", adminSelectUser);
  els.adminGrantBtn.addEventListener("click", adminSendGrant);
  els.loginBtn.addEventListener("click", loginAccount);
  els.createAccountBtn.addEventListener("click", createAccount);
  els.logoutBtn.addEventListener("click", logoutAccount);
  els.resetAccountBtn.addEventListener("click", resetAccountProgress);
  els.quantityInput.addEventListener("input", syncQuantityFromInput);
  els.quantityRange.addEventListener("input", syncQuantityFromRange);
  els.quantityMaxBtn.addEventListener("click", setQuantityToMax);
  els.quantityConfirmBtn.addEventListener("click", confirmQuantityAction);
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
      if (event.target === modal && !["walkModal", "accountModal"].includes(modal.id)) closeModal(modal.id);
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
  const area = selectedArea();
  const levelBoost = pick.rarity === "legendary" ? randomInt(1, 4) : pick.rarity === "mythical" ? randomInt(2, 6) : 0;
  const level = clamp(randomInt(area.min, area.max) + levelBoost, 1, MAX_LEVEL);
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
    defeatWild(active);
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
  const heal = healingAmount(item, active);
  active.currentHp = clamp(active.currentHp + heal, 0, active.maxHp);
  log(`${active.displayName} recupero ${heal} PS con ${item.name}.`);
  setMessage(`${active.displayName} recupero PS.`);
  render();
  save();
}

function captureWild(ball) {
  const wild = state.wild;
  const owned = {
    ...wild,
    uid: uid(),
    level: 1,
    xp: 0,
    stats: scaleStats(wild.baseStats, 1, wild.rarity, wild.statBonus),
    turns: 1
  };
  owned.maxHp = owned.stats.hp;
  owned.currentHp = owned.maxHp;
  if (ball.id === "healBall" || ball.id === "friendBall") owned.currentHp = owned.maxHp;
  const duplicate = findWeakestDuplicate(owned);
  const goldReward = captureReward(wild, ball);
  const rewards = [
    { label: "Oro", value: `+${goldReward}` },
    { label: "Captura", value: `${owned.displayName} Nv. 1` }
  ];
  state.collection.push(owned);
  state.caught += 1;
  state.stats.captures += 1;
  if (owned.shiny) state.stats.shinyCaptures += 1;
  if (owned.rarity === "legendary") state.stats.legendaryCaptures += 1;
  if (owned.rarity === "mythical") state.stats.mythicalCaptures += 1;
  state.gold += goldReward;
  const cardDrop = rollCardDrop(wild, 0.65);
  if (cardDrop) {
    addItem(cardDrop.id, 1);
    rewards.push({ label: "Carta encontrada", value: cardDrop.name, icon: itemIconUrl(cardDrop.id) });
    log(`Encontraste ${cardDrop.name} al capturar a ${owned.displayName}.`);
  }

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
    log(`Liberaste al duplicado mas debil de ${owned.displayName} (${owned.shiny ? "variocolor" : "normal"}). +35 oro`);
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

function defeatWild(attacker = getActive()) {
  const wild = state.wild;
  const active = attacker || getActive();
  if (!wild || !active) return;
  const gold = defeatReward(wild);
  const xp = 18 + wild.level * 4 + (wild.shiny ? 120 : 0) + (wild.rarity !== "normal" ? 160 : 0);
  const cardDrop = rollCardDrop(wild, 1);
  state.gold += gold;
  state.stats.defeats += 1;
  if (cardDrop) addItem(cardDrop.id, 1);
  const xpResult = gainXp(active, xp);
  log(`Venciste a ${wild.displayName}. +${gold} oro. ${xpResult.text}`);
  if (cardDrop) log(`Cayo ${cardDrop.name}.`);
  setMessage(`Venciste a ${wild.displayName}. ${xpResult.text}`);
  state.wild = null;
  showResultModal({
    title: "Victoria",
    kind: `${rarityLabel(wild)} derrotado`,
    name: wild.displayName,
    text: `${active.displayName} gano el combate.`,
    sprite: wild.shiny ? wild.shinySprite : wild.sprite,
    rewards: [
      { label: "Oro", value: `+${gold}` },
      { label: "Experiencia", value: xpResult.resultLabel },
      { label: "Derrotas", value: `${state.stats.defeats}` },
      ...(cardDrop ? [{ label: "Carta", value: cardDrop.name, icon: itemIconUrl(cardDrop.id) }] : [])
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
  return buyItemQuantity(itemId, cost, name, 1);
}

function buyItemQuantity(itemId, cost, name, quantity) {
  const amount = Math.max(1, Math.floor(quantity) || 1);
  const totalCost = cost * amount;
  if (state.gold < totalCost) {
    log(`Te falta oro para comprar ${name}.`);
    setMessage(`No alcanza el oro para ${name}.`);
    return;
  }
  state.gold -= totalCost;
  addItem(itemId, amount);
  state.stats.shopPurchases += amount;
  log(`Compraste ${amount} ${name}. -${totalCost} oro.`);
  render();
  save();
}

function render() {
  const active = getActive();
  const inventoryText = `${totalBalls()} Balls - ${totalHealingItems()} curas - ${getItem("rareCandy")} caramelos - ${totalCards()} cartas`;
  els.gold.textContent = state.gold;
  els.steps.textContent = state.steps;
  els.caughtCount.textContent = state.caught;
  els.inventory.textContent = inventoryText;
  els.shopInventory.textContent = inventoryText;
  els.shopGold.textContent = `${state.gold} oro`;
  renderActive(active);
  renderWild();
  renderAreaSelect();
  renderCollection();
  renderPokedex();
  renderLog();
  renderPotionBag();
  renderBallBag();
  renderCardShop();
  renderAchievements();
  renderMissions();
  els.attackBtn.disabled = !state.wild;
  els.autoBattleBtn.disabled = busy || !active;
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
  const isNewSpecies = isNewPokedexSpecies(wild);
  els.fieldWildName.innerHTML = `${wild.displayName}${isNewSpecies ? " <em>NUEVO</em>" : ""}`;
  els.fieldWildLevel.textContent = `Nv. ${wild.level}`;
  els.fieldWildTags.textContent = `${isNewSpecies ? "Nuevo registro - " : ""}${rarityLabel(wild)}${wild.shiny ? " variocolor - " : " - "}${wild.types.join(" / ")} - PS ${wild.currentHp}/${wild.maxHp}`;
  els.wildHpBar.style.width = `${hpPercent(wild)}%`;
  els.encounterHint.textContent = `${isNewSpecies ? "NUEVO en tu Pokedex. " : ""}${rarityLabel(wild)}: captura estimada con Poke Ball ${Math.round(captureChance(BALLS[0], wild, getActive()) * 100)}%.`;
}

function renderShop() {
  els.ballShopList.innerHTML = "";
  els.potionShopList.innerHTML = "";
  els.itemShopList.innerHTML = "";
  els.cardShopList.innerHTML = "";
  BALLS.forEach((ball) => els.ballShopList.appendChild(shopButton(ball)));
  POTIONS.forEach((potion) => els.potionShopList.appendChild(shopButton(potion)));
  SHOP_ITEMS.forEach((item) => els.itemShopList.appendChild(shopButton(item)));
  renderCardShop();
}

function shopButton(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.innerHTML = `${itemIconMarkup(item)}<span>${item.name}</span><strong>${item.cost} oro</strong><small>${item.note}</small>`;
  button.addEventListener("click", () => openBuyQuantity(item));
  return button;
}

function renderCardShop() {
  if (!els.cardShopList) return;
  els.cardShopList.innerHTML = "";
  CARD_ITEMS.forEach((card) => {
    const owned = getItem(card.id);
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = owned <= 0;
    button.innerHTML = `${itemIconMarkup(card)}<span>${card.name} x${owned}</span><strong>${card.value} oro c/u</strong><small>${owned > 0 ? `Vender todo: +${owned * card.value} oro` : "Derrotando Pokemon pueden caer."}</small>`;
    button.addEventListener("click", () => openSellQuantity(card));
    els.cardShopList.appendChild(button);
  });
}

function sellCard(cardId) {
  const card = CARD_ITEMS.find((item) => item.id === cardId);
  const owned = getItem(cardId);
  if (!card || owned <= 0) return;
  sellCardQuantity(cardId, owned);
}

function sellCardQuantity(cardId, quantity) {
  const card = CARD_ITEMS.find((item) => item.id === cardId);
  const owned = getItem(cardId);
  const amount = clamp(Math.floor(quantity) || 1, 1, owned);
  if (!card || owned <= 0) return;
  addItem(cardId, -amount);
  state.gold += amount * card.value;
  log(`Vendiste ${amount} ${card.name}. +${amount * card.value} oro.`);
  setMessage(`Vendiste cartas por ${amount * card.value} oro.`);
  render();
  save();
}

function openBuyQuantity(item) {
  const max = Math.floor(state.gold / item.cost);
  if (max <= 0) {
    setMessage(`No alcanza el oro para ${item.name}.`);
    return;
  }
  openQuantityModal({
    mode: "buy",
    item,
    max,
    unitValue: item.cost,
    confirmText: "Comprar",
    detail: `${item.cost} oro c/u`
  });
}

function openSellQuantity(card) {
  const max = getItem(card.id);
  if (max <= 0) return;
  openQuantityModal({
    mode: "sell-card",
    item: card,
    max,
    unitValue: card.value,
    confirmText: "Vender",
    detail: `${card.value} oro c/u`
  });
}

function openQuantityModal(action) {
  quantityAction = action;
  els.quantityTitle.textContent = action.mode === "buy" ? "Comprar" : "Vender";
  els.quantityIcon.src = itemIconUrl(action.item.id);
  els.quantityItemName.textContent = action.item.name;
  els.quantityItemDetail.textContent = action.detail;
  els.quantityInput.max = action.max;
  els.quantityRange.max = action.max;
  els.quantityInput.value = 1;
  els.quantityRange.value = 1;
  els.quantityConfirmBtn.textContent = action.confirmText;
  updateQuantitySummary();
  openModal("quantityModal");
}

function syncQuantityFromInput() {
  if (!quantityAction) return;
  const amount = clamp(Math.floor(Number(els.quantityInput.value) || 1), 1, quantityAction.max);
  els.quantityInput.value = amount;
  els.quantityRange.value = amount;
  updateQuantitySummary();
}

function syncQuantityFromRange() {
  if (!quantityAction) return;
  els.quantityInput.value = els.quantityRange.value;
  updateQuantitySummary();
}

function setQuantityToMax() {
  if (!quantityAction) return;
  els.quantityInput.value = quantityAction.max;
  els.quantityRange.value = quantityAction.max;
  updateQuantitySummary();
}

function updateQuantitySummary() {
  if (!quantityAction) return;
  const amount = Math.floor(Number(els.quantityInput.value) || 1);
  const total = amount * quantityAction.unitValue;
  const verb = quantityAction.mode === "buy" ? "Costo" : "Ganancia";
  els.quantitySummary.textContent = `Maximo ${quantityAction.max} - ${verb}: ${total} oro`;
}

function confirmQuantityAction() {
  if (!quantityAction) return;
  const amount = clamp(Math.floor(Number(els.quantityInput.value) || 1), 1, quantityAction.max);
  const action = quantityAction;
  closeModal("quantityModal");
  quantityAction = null;
  if (action.mode === "buy") {
    buyItemQuantity(action.item.id, action.item.cost, action.item.name, amount);
  } else {
    sellCardQuantity(action.item.id, amount);
  }
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
    button.innerHTML = `${itemIconMarkup(potion)}<span>${potion.name} x${owned}</span><strong>${healingLabel(potion)}</strong><small>${potion.note}</small>`;
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
  els.statsGrid.innerHTML = statMarkupForPokemon(mon);
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

    const candy = document.createElement("button");
    candy.type = "button";
    candy.textContent = `Caramelo raro x${getItem("rareCandy")}`;
    candy.disabled = getItem("rareCandy") <= 0 || mon.level >= MAX_LEVEL || mon.uid !== state.activeId;
    candy.addEventListener("click", () => {
      useRareCandy(mon);
      showPokemonStats(mon, kind);
    });

    const evolution = await evolutionButton(mon);
    els.statsActions.append(activate, candy);
    vitaminButtons(mon).forEach((button) => els.statsActions.appendChild(button));
    els.statsActions.appendChild(evolution);
    els.statsActions.appendChild(release);
  }
  openModal("statsModal");
}

function useRareCandy(mon) {
  if (!mon || mon.uid !== state.activeId || getItem("rareCandy") <= 0 || mon.level >= MAX_LEVEL) return;
  addItem("rareCandy", -1);
  const before = mon.level;
  mon.level += 1;
  mon.xp = 0;
  mon.stats = scaleStats(mon.baseStats, mon.level, mon.rarity, mon.statBonus);
  mon.maxHp = mon.stats.hp;
  mon.currentHp = mon.maxHp;
  log(`${mon.displayName} subio de Nv. ${before} a Nv. ${mon.level} con Caramelo raro.`);
  setMessage(`${mon.displayName} subio a Nv. ${mon.level}.`);
  render();
  save();
}

function vitaminButtons(mon) {
  return SHOP_ITEMS.filter((item) => item.stat).map((item) => {
    const owned = getItem(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${item.name} x${owned}`;
    button.disabled = owned <= 0 || mon.uid !== state.activeId;
    button.title = item.note;
    button.addEventListener("click", () => {
      useStatItem(mon, item.id);
      showPokemonStats(mon, "capturado");
    });
    return button;
  });
}

function useStatItem(mon, itemId) {
  const item = SHOP_ITEMS.find((entry) => entry.id === itemId && entry.stat);
  if (!item || !mon || mon.uid !== state.activeId || getItem(item.id) <= 0) return;
  mon.statBonus = mon.statBonus || {};
  const current = Number(mon.statBonus[item.stat]) || 0;
  const hpRatio = mon.currentHp / mon.maxHp;
  const before = mon.stats[item.stat];
  let nextBonus = current + item.boost;
  let nextStats = scaleStats(mon.baseStats, mon.level, mon.rarity, { ...mon.statBonus, [item.stat]: nextBonus });
  while (nextStats[item.stat] <= before) {
    nextBonus += 0.01;
    nextStats = scaleStats(mon.baseStats, mon.level, mon.rarity, { ...mon.statBonus, [item.stat]: nextBonus });
  }
  mon.statBonus[item.stat] = nextBonus;
  mon.stats = scaleStats(mon.baseStats, mon.level, mon.rarity, mon.statBonus);
  mon.maxHp = mon.stats.hp;
  mon.currentHp = clamp(Math.ceil(mon.maxHp * hpRatio), 1, mon.maxHp);
  addItem(item.id, -1);
  const after = mon.stats[item.stat];
  log(`${mon.displayName} uso ${item.name}. ${STAT_LABELS[item.stat]} ${before} -> ${after}.`);
  setMessage(`${STAT_LABELS[item.stat]} de ${mon.displayName}: ${before} -> ${after}.`);
  render();
  save();
}

async function autoBattle() {
  if (busy) return;
  setBusy(true);
  closeModal("resultModal");
  let rounds = 0;
  while (rounds < AUTO_BATTLE_LIMIT) {
    const active = getActive();
    if (!active) break;
    if (active.currentHp <= Math.ceil(active.maxHp * 0.42)) {
      const healed = useBestPotion(active);
      if (!healed && active.currentHp <= Math.ceil(active.maxHp * 0.25)) {
        setMessage("Auto-pelea pausada: faltan curas.");
        log("Auto-pelea pausada por falta de curas.");
        break;
      }
    }
    if (!state.wild) {
      state.steps += 1;
      state.gold += 4 + Math.floor(Math.random() * 6);
      await spawnWild();
      render();
      await wait(130);
    }
    if (shouldPauseAutoBattle(state.wild)) {
      setMessage(`Auto-pelea pausada: aparecio ${state.wild.displayName} ${specialEncounterLabel(state.wild)}.`);
      log("Auto-pelea se detuvo por encuentro raro.");
      break;
    }
    attack();
    closeModal("resultModal");
    rounds += 1;
    if (!state.wild) await wait(120);
    if (!getActive() || getActive().currentHp <= 0) break;
  }
  setBusy(false);
  render();
  save();
}

function useBestPotion(active) {
  const missing = active.maxHp - active.currentHp;
  if (missing <= 0) return false;
  const available = POTIONS
    .filter((potion) => getItem(potion.id) > 0)
    .sort((a, b) => potionHealValue(a, active) - potionHealValue(b, active));
  const item = available.find((potion) => healingAmount(potion, active) >= missing) || available.at(-1);
  if (!item) return false;
  addItem(item.id, -1);
  state.stats.potionsUsed += 1;
  const heal = healingAmount(item, active);
  active.currentHp = clamp(active.currentHp + heal, 0, active.maxHp);
  log(`Auto-pelea uso ${item.name}. ${active.displayName} recupero ${heal} PS.`);
  return true;
}

function potionHealValue(potion, active) {
  if (potion.heal === "full") return active.maxHp;
  if (potion.healPercent) return Math.ceil(active.maxHp * potion.healPercent);
  return potion.heal;
}

function healingAmount(potion, mon) {
  const missing = mon.maxHp - mon.currentHp;
  if (potion.heal === "full") return missing;
  if (potion.healPercent) return Math.min(missing, Math.ceil(mon.maxHp * potion.healPercent));
  return Math.min(missing, potion.heal);
}

function healingLabel(potion) {
  if (potion.heal === "full") return "Full";
  if (potion.healPercent) return `${Math.round(potion.healPercent * 100)}% PS`;
  return `+${potion.heal} PS`;
}

function shouldPauseAutoBattle(mon) {
  return Boolean(mon && (mon.shiny || mon.rarity !== "normal" || PSEUDO_LEGENDARY_IDS.has(mon.apiId)));
}

function specialEncounterLabel(mon) {
  if (!mon) return "especial";
  if (mon.shiny) return "variocolor";
  if (mon.rarity === "mythical") return "mitico";
  if (mon.rarity === "legendary") return "legendario";
  if (PSEUDO_LEGENDARY_IDS.has(mon.apiId)) return "pseudo-legendario";
  return "especial";
}

async function evolutionButton(mon) {
  const option = await findEvolutionOption(mon);
  const button = document.createElement("button");
  button.type = "button";
  if (!option) {
    button.textContent = "Sin evolucion";
    button.disabled = true;
    return button;
  }
  button.textContent = mon.level >= option.minLevel ? `Evolucionar a ${option.name}` : `Evoluciona Nv. ${option.minLevel}`;
  button.disabled = mon.level < option.minLevel;
  button.addEventListener("click", async () => {
    await evolvePokemon(mon, option);
    closeModal("statsModal");
  });
  return button;
}

async function findEvolutionOption(mon) {
  if (!mon?.apiId) return null;
  const species = await fetchPokemonSpecies(mon.apiId);
  const chainUrl = species?.evolution_chain?.url;
  if (!chainUrl) return null;
  try {
    const response = await fetch(chainUrl);
    if (!response.ok) return null;
    const chain = await response.json();
    return findNextEvolutionInChain(chain.chain, mon.name);
  } catch {
    return null;
  }
}

function findNextEvolutionInChain(node, name) {
  if (!node) return null;
  if (node.species?.name === name && node.evolves_to?.length) {
    const next = node.evolves_to[0];
    const details = next.evolution_details?.[0] || {};
    const id = Number(next.species?.url?.match(/\/pokemon-species\/(\d+)\//)?.[1]);
    return {
      id,
      name: title(next.species.name),
      minLevel: details.min_level || 16
    };
  }
  for (const child of node.evolves_to || []) {
    const found = findNextEvolutionInChain(child, name);
    if (found) return found;
  }
  return null;
}

async function evolvePokemon(mon, option) {
  if (!option?.id || mon.level < option.minLevel) return;
  const data = await fetchPokemon(option.id);
  const evolved = normalizePokemon(data);
  Object.assign(mon, evolved, {
    uid: mon.uid,
    level: mon.level,
    xp: mon.xp,
    shiny: mon.shiny,
    statBonus: mon.statBonus,
    stats: scaleStats(evolved.baseStats, mon.level, evolved.rarity, mon.statBonus)
  });
  mon.maxHp = mon.stats.hp;
  mon.currentHp = mon.maxHp;
  log(`${title(data.name)} evoluciono y conserva su entrenamiento.`);
  setMessage(`${mon.displayName} evoluciono.`);
  render();
  save();
}

function captureChance(ball, wild, active) {
  if (!wild || !active) return 0;
  if (ball.id === "masterBall") return 1;
  const speciesRate = clamp((wild.captureRate || 140) / 255, 0.08, 0.9);
  const hpFactor = 0.38 + (1 - wild.currentHp / wild.maxHp) * 0.72;
  const levelFactor = clamp(1 + (active.level - wild.level) * 0.01, 0.55, 1.35);
  const rarityFactor = rarityCaptureFactor(wild);
  const modifier = ballModifier(ball, wild, active);
  const chance = speciesRate * hpFactor * levelFactor * rarityFactor * modifier;
  return clamp(chance, wild.rarity === "normal" && !wild.shiny ? 0.07 : 0.02, maxCaptureChance(wild));
}

function ballModifier(ball, wild, active) {
  let mod = ball.mod;
  if (ball.id === "quickBall") mod = wild.turns <= 1 ? 3.2 : 0.8;
  if (ball.id === "timerBall") mod = Math.min(3.5, 0.75 + wild.turns * 0.28);
  if (ball.id === "netBall" && hasAnyType(wild, ["water", "bug"])) mod = 2.7;
  if (ball.id === "diveBall" && hasAnyType(wild, ["water"])) mod = 2.55;
  if (ball.id === "lureBall" && hasAnyType(wild, ["water"])) mod = 2.55;
  if (ball.id === "sportBall" && hasAnyType(wild, ["bug"])) mod = 2.45;
  if (ball.id === "nestBall") mod = wild.level < 20 ? 2.75 : wild.level < 35 ? 1.85 : 0.8;
  if (ball.id === "repeatBall" && state.collection.some((mon) => mon.apiId === wild.apiId)) mod = 2.65;
  if (ball.id === "levelBall") {
    const ratio = active.level / Math.max(1, wild.level);
    mod = ratio >= 4 ? 3.6 : ratio >= 2 ? 2.6 : ratio > 1 ? 1.55 : 0.85;
  }
  if (ball.id === "heavyBall") mod = wild.weight >= 2000 ? 2.9 : wild.weight >= 1000 ? 1.95 : 0.85;
  if (ball.id === "fastBall") mod = wild.baseStats.speed >= 100 ? 2.75 : 0.85;
  if (ball.id === "beastBall" && wild.rarity !== "normal") mod = 4.5;
  if (ball.id === "dreamBall" && wild.rarity !== "normal") mod = 3.1;
  return mod;
}

function rarityCaptureFactor(wild) {
  if (wild.rarity === "mythical") return wild.shiny ? 0.14 : 0.22;
  if (wild.rarity === "legendary") return wild.shiny ? 0.17 : 0.28;
  if (PSEUDO_LEGENDARY_IDS.has(wild.apiId)) return wild.shiny ? 0.28 : 0.5;
  return wild.shiny ? 0.55 : 1;
}

function maxCaptureChance(wild) {
  if (wild.rarity === "mythical") return wild.shiny ? 0.36 : 0.52;
  if (wild.rarity === "legendary") return wild.shiny ? 0.42 : 0.58;
  if (PSEUDO_LEGENDARY_IDS.has(wild.apiId)) return wild.shiny ? 0.5 : 0.72;
  return wild.shiny ? 0.78 : 0.94;
}

function createBattlePokemon(data, level, shiny, forcedRarity = null) {
  const base = normalizePokemon(data);
  const rarity = forcedRarity || base.rarity;
  const statBonus = randomStatBonus();
  const stats = scaleStats(base.baseStats, level, rarity, statBonus);
  return {
    ...base,
    rarity,
    uid: uid(),
    level,
    shiny,
    statBonus,
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

function scaleStats(base, level, rarity = "normal", statBonus = null) {
  const scale = 0.55 + level / 72 + Math.log10(level + 9) * 0.34;
  const rarityBoost = rarity === "mythical" ? 1.14 : rarity === "legendary" ? 1.1 : 1;
  const stats = {
    hp: Math.floor(((base.hp * scale) + level * 2 + 18) * rarityBoost),
    attack: Math.floor((base.attack * scale + level) * rarityBoost),
    defense: Math.floor((base.defense * scale + level) * rarityBoost),
    spAtk: Math.floor((base.spAtk * scale + level) * rarityBoost),
    spDef: Math.floor((base.spDef * scale + level) * rarityBoost),
    speed: Math.floor((base.speed * scale + level) * rarityBoost)
  };
  if (!statBonus) return stats;
  Object.keys(stats).forEach((key) => {
    stats[key] = Math.max(1, Math.floor(stats[key] * (1 + (statBonus[key] || 0))));
  });
  return stats;
}

function renderAreaSelect() {
  if (!els.areaSelect) return;
  const active = getActive();
  const current = clamp(state.areaId || 0, 0, CAPTURE_AREAS.length - 1);
  if (els.areaSelect.children.length !== CAPTURE_AREAS.length) {
    els.areaSelect.innerHTML = "";
    CAPTURE_AREAS.forEach((area) => {
      const option = document.createElement("option");
      option.value = area.id;
      option.textContent = `${area.name} Nv. ${area.min}-${area.max}`;
      els.areaSelect.appendChild(option);
    });
  }
  const maxUnlocked = Math.min(CAPTURE_AREAS.length - 1, Math.floor(((active?.level || 1) + 9) / 10));
  [...els.areaSelect.options].forEach((option) => {
    option.disabled = Number(option.value) > maxUnlocked;
  });
  state.areaId = Math.min(current, maxUnlocked);
  els.areaSelect.value = state.areaId;
  const area = selectedArea();
  els.areaHint.textContent = `${area.name}: salvajes Nv. ${area.min}-${area.max}. Capturas entran en Nv. 1.`;
}

function selectedArea() {
  return CAPTURE_AREAS[clamp(state.areaId || 0, 0, CAPTURE_AREAS.length - 1)];
}

function renderPokedexTypeFilter() {
  els.pokedexTypeFilter.innerHTML = `<option value="all">Todos</option>${POKEMON_TYPES.map((type) => `<option value="${type}">${title(type)}</option>`).join("")}`;
}

async function renderPokedex(force = false) {
  if (!els.pokedexList) return;
  if (!force && document.querySelector("#pokedexModal")?.classList.contains("hidden")) return;
  const captured = new Map();
  state.collection.forEach((mon) => {
    const entry = captured.get(mon.apiId) || { normal: false, shiny: false, mon };
    entry.normal = entry.normal || !mon.shiny;
    entry.shiny = entry.shiny || Boolean(mon.shiny);
    entry.mon = mon;
    captured.set(mon.apiId, entry);
  });
  const idSearch = Number(els.pokedexIdSearch.value);
  const typeFilter = els.pokedexTypeFilter.value || "all";
  const rarityFilter = els.pokedexRarityFilter.value || "all";
  const typeIds = typeFilter === "all" ? null : await pokemonIdsByType(typeFilter);
  const ids = Number.isFinite(idSearch) && idSearch > 0
    ? [clamp(idSearch, 1, MAX_POKEMON_ID)]
    : Array.from({ length: MAX_POKEMON_ID }, (_, index) => index + 1);
  const filtered = ids.filter((id) => {
    if (rarityFilter === "legendary" && !LEGENDARY_IDS.has(id)) return false;
    if (rarityFilter === "mythical" && !MYTHICAL_IDS.has(id)) return false;
    if (rarityFilter === "normal" && (LEGENDARY_IDS.has(id) || MYTHICAL_IDS.has(id))) return false;
    if (typeIds && !typeIds.has(id)) return false;
    return true;
  });
  els.pokedexSummary.textContent = `${captured.size}/${MAX_POKEMON_ID} especies registradas - ${state.collection.length} Pokemon en coleccion`;
  els.pokedexList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  filtered.forEach((id) => {
    const entry = captured.get(id);
    const card = document.createElement("article");
    card.className = `pokedex-entry${entry ? " captured" : " missing"}`;
    const name = entry?.mon.displayName || `#${id}`;
    const rarity = MYTHICAL_IDS.has(id) ? "Mitico" : LEGENDARY_IDS.has(id) ? "Legendario" : "Normal";
    card.innerHTML = `
      <img src="${entry ? (entry.mon.shiny ? entry.mon.shinySprite : entry.mon.sprite) : spriteUrl(id)}" alt="" loading="lazy">
      <strong>#${id} ${entry ? name : "???"}</strong>
      <small>${rarity}${entry ? ` - ${entry.mon.types.join(" / ")}` : ""}</small>
      <span>${entry?.normal ? "Normal" : ""}${entry?.normal && entry?.shiny ? " + " : ""}${entry?.shiny ? "Variocolor" : ""}</span>
    `;
    fragment.appendChild(card);
  });
  els.pokedexList.appendChild(fragment);
}

async function pokemonIdsByType(type) {
  if (typeIdCache.has(type)) return typeIdCache.get(type);
  try {
    const response = await fetch(`${API_ROOT}/type/${type}`);
    if (!response.ok) throw new Error("Tipo no disponible");
    const data = await response.json();
    const ids = new Set(
      data.pokemon
        .map((entry) => Number(entry.pokemon.url.match(/\/pokemon\/(\d+)\//)?.[1]))
        .filter((id) => Number.isFinite(id) && id >= 1 && id <= MAX_POKEMON_ID)
    );
    typeIdCache.set(type, ids);
    return ids;
  } catch {
    return new Set();
  }
}

function calcDamage(attacker, defender) {
  const offense = Math.max(attacker.stats.attack, attacker.stats.spAtk);
  const defense = Math.max(8, Math.floor((defender.stats.defense + defender.stats.spDef) / 2));
  const base = 8 + attacker.level * 1.35 + offense * 0.4 - defense * 0.18;
  return Math.max(3, Math.floor(base * (0.84 + Math.random() * 0.32)));
}

function gainXp(mon, amount) {
  if (!mon) return { gained: 0, levels: 0, text: "Sin Pokemon para recibir XP.", resultLabel: "+0 XP" };
  if (mon.level >= MAX_LEVEL) return { gained: 0, levels: 0, text: `${mon.displayName} ya esta en nivel maximo.`, resultLabel: "Nivel maximo" };
  const beforeLevel = mon.level;
  const gained = amount;
  mon.xp += amount;
  while (mon.level < MAX_LEVEL && mon.xp >= xpNeeded(mon.level)) {
    mon.xp -= xpNeeded(mon.level);
    mon.level += 1;
    mon.stats = scaleStats(mon.baseStats, mon.level, mon.rarity, mon.statBonus);
    mon.maxHp = mon.stats.hp;
    mon.currentHp = mon.maxHp;
    log(`${mon.displayName} subio a Nv. ${mon.level}.`);
  }
  if (mon.level >= MAX_LEVEL) mon.xp = 0;
  const levels = mon.level - beforeLevel;
  return {
    gained,
    levels,
    text: levels > 0
      ? `${mon.displayName} gano ${gained} XP y subio ${levels} nivel${levels === 1 ? "" : "es"}.`
      : `${mon.displayName} gano ${gained} XP.`,
    resultLabel: levels > 0 ? `+${gained} XP / +${levels} Nv.` : `+${gained} XP`
  };
}

function xpNeeded(level) {
  return Math.floor(90 + level * 36 + level ** 1.85);
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
  const duplicates = state.collection.filter((mon) => mon.apiId === candidate.apiId && Boolean(mon.shiny) === Boolean(candidate.shiny));
  return duplicates.length ? duplicates.sort((a, b) => powerScore(a) - powerScore(b))[0] : null;
}

function randomStatBonus() {
  return {
    hp: randomStatDelta(),
    attack: randomStatDelta(),
    defense: randomStatDelta(),
    spAtk: randomStatDelta(),
    spDef: randomStatDelta(),
    speed: randomStatDelta()
  };
}

function randomStatDelta() {
  return (randomInt(-10, 10) / 100);
}

function powerScore(mon) {
  return Object.values(mon.stats).reduce((sum, value) => sum + value, 0) + mon.level * 14 + (mon.shiny ? 450 : 0) + (mon.rarity === "legendary" ? 800 : mon.rarity === "mythical" ? 1100 : 0);
}

function captureReward(mon, ball) {
  let reward = 25 + levelGoldValue(mon.level);
  if (PSEUDO_LEGENDARY_IDS.has(mon.apiId)) reward += Math.round(levelGoldValue(mon.level) * 0.7) + 120;
  if (mon.shiny) reward += Math.round(levelGoldValue(mon.level) * 1.2) + 180;
  if (mon.rarity === "legendary") reward += Math.round(levelGoldValue(mon.level) * 1.6) + 420;
  if (mon.rarity === "mythical") reward += Math.round(levelGoldValue(mon.level) * 2.1) + 650;
  if (ball.id === "luxuryBall") reward = Math.round(reward * 1.45);
  return reward;
}

function defeatReward(mon) {
  let reward = 16 + Math.round(levelGoldValue(mon.level) * 0.82);
  if (PSEUDO_LEGENDARY_IDS.has(mon.apiId)) reward += 90;
  if (mon.shiny) reward += Math.round(levelGoldValue(mon.level) * 0.9) + 140;
  if (mon.rarity === "legendary") reward += Math.round(levelGoldValue(mon.level) * 1.15) + 260;
  if (mon.rarity === "mythical") reward += Math.round(levelGoldValue(mon.level) * 1.55) + 410;
  return reward;
}

function levelGoldValue(level) {
  return Math.round(level * 4.5 + level ** 1.18);
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

function rollCardDrop(mon, multiplier = 1) {
  if (!mon) return null;
  const rarityBonus = mon.rarity === "mythical" ? 0.09 : mon.rarity === "legendary" ? 0.07 : PSEUDO_LEGENDARY_IDS.has(mon.apiId) ? 0.045 : 0;
  const shinyBonus = mon.shiny ? 0.055 : 0;
  const levelBonus = Math.min(0.08, mon.level / MAX_LEVEL * 0.08);
  for (const card of [...CARD_ITEMS].reverse()) {
    const chance = (card.chance + rarityBonus + shinyBonus + levelBonus) * multiplier;
    if (Math.random() < chance) return card;
  }
  return null;
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
  return BALLS.find((item) => item.id === id)
    || POTIONS.find((item) => item.id === id)
    || SHOP_ITEMS.find((item) => item.id === id)
    || CARD_ITEMS.find((item) => item.id === id);
}

function getActive() {
  return state.collection.find((mon) => mon.uid === state.activeId) || state.collection[0];
}

function isNewPokedexSpecies(mon) {
  return Boolean(mon && !state.collection.some((owned) => owned.apiId === mon.apiId));
}

function statMarkup(stats) {
  return Object.entries(STAT_LABELS).map(([key, label]) => `<span>${label}<strong>${stats[key]}</strong></span>`).join("");
}

function statMarkupForPokemon(mon) {
  const neutral = scaleStats(mon.baseStats, mon.level, mon.rarity);
  return Object.entries(STAT_LABELS).map(([key, label]) => {
    const diff = mon.stats[key] - neutral[key];
    const sign = diff > 0 ? "+" : "";
    const className = diff > 0 ? "stat-up" : diff < 0 ? "stat-down" : "";
    return `<span>${label}<strong>${mon.stats[key]}</strong><em class="${className}">${sign}${diff} vs especie</em></span>`;
  }).join("");
}

function renderLog() {
  els.battleLog.innerHTML = state.log.map((item) => `<p>${item}</p>`).join("");
}

function openAccountModalIfNeeded() {
  const session = loadSession();
  els.accountUserId.value = state.syncUserId || session.userId || "";
  els.accountPassword.value = "";
  if (session.userId) state.syncUserId = session.userId;
  els.accountStatus.textContent = cloud
    ? "Crea una cuenta o inicia sesion para cargar tu partida."
    : "Configura Firebase para guardar progreso online. Mientras tanto, el progreso queda en este navegador.";
  openModal("accountModal");
}

async function loginAccount() {
  const credentials = readAccountForm();
  if (!credentials) return;
  setAccountBusy(true, "Entrando...");
  try {
    if (!cloud) throw new Error("Firebase no esta configurado");
    const user = await signInCloud(credentials);
    await refreshAdminRole(user.uid);
    const saveData = await loadCloudSave(user.uid);
    if (!saveData) throw new Error("La cuenta no tiene partida guardada");
    suppressCloudSave = true;
    replaceState(upgradeState(saveData));
    state.syncUserId = credentials.userId;
    const grants = await applyCloudGrants(user.uid);
    saveSession(credentials.userId);
    save();
    suppressCloudSave = false;
    if (grants.length) scheduleCloudSave(true);
    render();
    closeModal("accountModal");
    setMessage(`Bienvenido, ${credentials.userId}.`);
  } catch (error) {
    els.accountStatus.textContent = `No se pudo entrar: ${error.message}`;
  } finally {
    setAccountBusy(false);
  }
}

async function createAccount() {
  const credentials = readAccountForm();
  if (!credentials) return;
  setAccountBusy(true, "Creando cuenta...");
  try {
    if (!cloud) throw new Error("Firebase no esta configurado");
    const user = await createCloudAccount(credentials);
    await refreshAdminRole(user.uid);
    state.syncUserId = credentials.userId;
    saveSession(credentials.userId);
    save();
    await saveCloudState(user.uid);
    closeModal("accountModal");
    setMessage(`Cuenta creada: ${credentials.userId}.`);
  } catch (error) {
    els.accountStatus.textContent = `No se pudo crear: ${error.message}`;
  } finally {
    setAccountBusy(false);
  }
}

function readAccountForm() {
  const userId = normalizeUserId(els.accountUserId.value);
  const password = els.accountPassword.value;
  if (!userId || !password) {
    els.accountStatus.textContent = "Falta usuario o clave.";
    return null;
  }
  if (password.length < 6) {
    els.accountStatus.textContent = "La clave necesita minimo 6 caracteres.";
    return null;
  }
  return { userId, password };
}

function setAccountBusy(value, message = "") {
  els.loginBtn.disabled = value;
  els.createAccountBtn.disabled = value;
  if (message) els.accountStatus.textContent = message;
}

async function logoutAccount() {
  if (!window.confirm("Cerrar sesion y volver a la pantalla de acceso?")) return;
  try {
    window.clearTimeout(cloudSaveTimer);
    if (cloud?.user) await saveCloudState(cloud.user.uid).catch(() => {});
    if (cloud?.auth) await cloud.auth.signOut();
  } catch (error) {
    log(`No se pudo cerrar sesion correctamente: ${error.message}`);
  }
  if (cloud) cloud.user = null;
  localStorage.removeItem(SESSION_KEY);
  els.adminBtn.classList.add("hidden");
  state.syncUserId = "";
  save();
  document.querySelectorAll(".modal").forEach((modal) => closeModal(modal.id));
  setMessage("Sesion cerrada.");
  openAccountModalIfNeeded();
}

async function resetAccountProgress() {
  const userId = state.syncUserId || loadSession().userId || cloud?.user?.displayName || "";
  const accepted = window.confirm("Esto reinicia la partida de esta cuenta: Pokemon, oro, objetos, cartas, logros y misiones vuelven a cero. La cuenta no se borra. Continuar?");
  if (!accepted) return;
  suppressCloudSave = true;
  replaceState(baseState());
  state.syncUserId = userId;
  await ensureStarterPokemon();
  ensureActiveMissions();
  suppressCloudSave = false;
  save();
  if (cloud?.user) await saveCloudState(cloud.user.uid);
  render();
  document.querySelectorAll(".modal").forEach((modal) => {
    if (modal.id !== "accountModal") closeModal(modal.id);
  });
  setMessage("Cuenta reiniciada. Nueva aventura lista.");
}

function initCloud() {
  const config = window.POKERASTRO_FIREBASE_CONFIG || {};
  if (!window.firebase || !config.apiKey || !config.projectId) return;
  const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);
  cloud = {
    app,
    auth: firebase.auth(),
    db: firebase.firestore(),
    user: null
  };
  cloud.auth.onAuthStateChanged((user) => {
    cloud.user = user;
    if (user) refreshAdminRole(user.uid).catch(() => {});
  });
}

async function signInCloud(credentials) {
  const result = await cloud.auth.signInWithEmailAndPassword(accountEmail(credentials.userId), credentials.password);
  cloud.user = result.user;
  return result.user;
}

async function createCloudAccount(credentials) {
  const result = await cloud.auth.createUserWithEmailAndPassword(accountEmail(credentials.userId), credentials.password);
  cloud.user = result.user;
  await result.user.updateProfile({ displayName: credentials.userId });
  return result.user;
}

async function loadCloudSave(uid) {
  const doc = await cloud.db.collection("saves").doc(uid).get();
  return doc.exists ? doc.data().save : null;
}

async function saveCloudState(uid = cloud?.user?.uid) {
  if (!cloud || !uid) return;
  const snapshot = JSON.parse(JSON.stringify(state));
  await cloud.db.collection("saves").doc(uid).set({
    ...playerCloudSummary(snapshot),
    save: snapshot,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

function playerCloudSummary(snapshot = state) {
  const active = snapshot.collection.find((mon) => mon.uid === snapshot.activeId) || snapshot.collection[0] || null;
  const strongest = [...snapshot.collection].sort((a, b) => powerScore(b) - powerScore(a))[0] || null;
  const species = new Set(snapshot.collection.map((mon) => mon.apiId));
  const itemSummary = cloudItemSummary(snapshot.items || {});
  return {
    userId: snapshot.syncUserId || cloud?.user?.displayName || "",
    gold: Number(snapshot.gold) || 0,
    steps: Number(snapshot.steps) || 0,
    captures: Number(snapshot.stats?.captures || snapshot.caught) || 0,
    defeats: Number(snapshot.stats?.defeats) || 0,
    collectionCount: snapshot.collection.length,
    speciesCount: species.size,
    shinyCount: snapshot.collection.filter((mon) => mon.shiny).length,
    legendaryCount: snapshot.collection.filter((mon) => mon.rarity === "legendary").length,
    mythicalCount: snapshot.collection.filter((mon) => mon.rarity === "mythical").length,
    highestLevel: snapshot.collection.reduce((max, mon) => Math.max(max, mon.level || 1), 1),
    activePokemon: active ? pokemonCloudSummary(active) : null,
    strongestPokemon: strongest ? pokemonCloudSummary(strongest) : null,
    items: itemSummary,
    pokeBall: itemSummary.pokeBall || 0,
    greatBall: itemSummary.greatBall || 0,
    ultraBall: itemSummary.ultraBall || 0,
    masterBall: itemSummary.masterBall || 0,
    rareCandy: itemSummary.rareCandy || 0
  };
}

function pokemonCloudSummary(mon) {
  return {
    apiId: mon.apiId,
    name: mon.displayName,
    level: mon.level,
    shiny: Boolean(mon.shiny),
    rarity: mon.rarity,
    power: powerScore(mon)
  };
}

function cloudItemSummary(items) {
  const summary = {};
  [...BALLS, ...POTIONS, ...SHOP_ITEMS, ...CARD_ITEMS].forEach((item) => {
    summary[item.id] = Number(items[item.id]) || 0;
  });
  return summary;
}

function scheduleCloudSave(now = false) {
  if (!cloud?.user || suppressCloudSave) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(() => {
    saveCloudState().catch(() => {});
  }, now ? 0 : 900);
}

async function applyCloudGrants(uid) {
  const docRef = cloud.db.collection("grants").doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) return [];
  const data = doc.data() || {};
  const grantId = String(data.grantId || data.nonce || doc.updateTime?.toMillis?.() || Date.now());
  if (state.appliedGrants?.includes(grantId)) return [];
  const grants = [];
  if (Number(data.gold)) grants.push({ grantId: `${grantId}:gold`, gold: Number(data.gold) });
  Object.entries(data.items || {}).forEach(([itemId, amount]) => {
    if (Number(amount)) grants.push({ grantId: `${grantId}:${itemId}`, itemId, amount: Number(amount) });
  });
  const applied = applyAccountGrants(grants);
  if (applied.length) await docRef.delete();
  return applied;
}

async function refreshAdminRole(uid) {
  if (!cloud || !uid) return false;
  const doc = await cloud.db.collection("admins").doc(uid).get();
  const isAdmin = doc.exists && doc.data()?.active !== false;
  els.adminBtn.classList.toggle("hidden", !isAdmin);
  return isAdmin;
}

function openAdminModal() {
  currentAdminTarget = null;
  els.adminUserSearch.value = "";
  els.adminUserList.innerHTML = "<option value=\"\">Cargando jugadores...</option>";
  els.adminUserSummary.innerHTML = "";
  els.adminStatus.textContent = "Cargando jugadores...";
  resetAdminGrantForm();
  openModal("adminModal");
  loadAdminUsers();
}

async function loadAdminUsers() {
  if (!cloud?.user) {
    els.adminStatus.textContent = "Necesitas iniciar sesion como admin.";
    return;
  }
  els.adminRefreshUsersBtn.disabled = true;
  els.adminStatus.textContent = "Cargando jugadores...";
  try {
    const snapshot = await cloud.db.collection("saves").orderBy("updatedAt", "desc").limit(80).get();
    adminUsers = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    renderAdminUserList();
    els.adminStatus.textContent = adminUsers.length
      ? `Lista cargada: ${adminUsers.length} jugador${adminUsers.length === 1 ? "" : "es"}.`
      : "Todavia no hay jugadores guardados.";
  } catch (error) {
    els.adminStatus.textContent = `No se pudo cargar la lista: ${error.message}`;
    adminUsers = [];
    renderAdminUserList();
  } finally {
    els.adminRefreshUsersBtn.disabled = false;
  }
}

function renderAdminUserList() {
  els.adminUserList.innerHTML = "<option value=\"\">Elegir jugador...</option>";
  adminUsers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.uid;
    option.textContent = `${user.userId || user.uid} - ${user.gold || 0} oro - Nv. ${user.highestLevel || 1}`;
    els.adminUserList.appendChild(option);
  });
}

function renderAdminItemSelect() {
  els.adminItemSelect.innerHTML = "<option value=\"\">Sin item extra</option>";
  [
    ["Balls", BALLS],
    ["Curas", POTIONS],
    ["Objetos", SHOP_ITEMS],
    ["Cartas", CARD_ITEMS]
  ].forEach(([groupName, items]) => {
    const group = document.createElement("optgroup");
    group.label = groupName;
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      group.appendChild(option);
    });
    els.adminItemSelect.appendChild(group);
  });
}

function adminSelectUser() {
  const uid = els.adminUserList.value;
  const user = adminUsers.find((item) => item.uid === uid);
  if (!user) return;
  currentAdminTarget = user;
  els.adminUserSearch.value = user.userId || "";
  renderAdminSummary(user);
  els.adminStatus.textContent = `Usuario elegido: ${user.userId || user.uid}.`;
}

async function adminSearchUser() {
  const userId = normalizeUserId(els.adminUserSearch.value);
  if (!userId) {
    els.adminStatus.textContent = "Ingresa un usuario.";
    return;
  }
  els.adminStatus.textContent = "Buscando...";
  try {
    const query = await cloud.db.collection("saves").where("userId", "==", userId).limit(1).get();
    if (query.empty) {
      currentAdminTarget = null;
      els.adminUserSummary.innerHTML = "";
      els.adminStatus.textContent = "Usuario no encontrado.";
      return;
    }
    const doc = query.docs[0];
    currentAdminTarget = { uid: doc.id, ...doc.data() };
    if (!adminUsers.some((user) => user.uid === currentAdminTarget.uid)) {
      adminUsers.unshift(currentAdminTarget);
      renderAdminUserList();
    }
    els.adminUserList.value = currentAdminTarget.uid;
    renderAdminSummary(currentAdminTarget);
    els.adminStatus.textContent = `Usuario encontrado: ${currentAdminTarget.userId}.`;
  } catch (error) {
    els.adminStatus.textContent = `No se pudo buscar: ${error.message}`;
  }
}

function renderAdminSummary(user) {
  const active = user.activePokemon;
  const strongest = user.strongestPokemon;
  els.adminUserSummary.innerHTML = `
    <span>Usuario<strong>${user.userId || "-"}</strong></span>
    <span>Oro<strong>${user.gold || 0}</strong></span>
    <span>Capturas<strong>${user.captures || 0}</strong></span>
    <span>Pokemon<strong>${user.collectionCount || 0}</strong></span>
    <span>Nivel max<strong>${user.highestLevel || 1}</strong></span>
    <span>Master Ball<strong>${user.masterBall || 0}</strong></span>
    <span>Activo<strong>${active ? `${active.name} Nv. ${active.level}` : "-"}</strong></span>
    <span>Mas fuerte<strong>${strongest ? `${strongest.name} Nv. ${strongest.level}` : "-"}</strong></span>
  `;
}

async function adminSendGrant() {
  if (!currentAdminTarget) {
    els.adminStatus.textContent = "Primero busca un usuario.";
    return;
  }
  const gold = signedNumberInput(els.adminGrantGold);
  const masterBall = signedNumberInput(els.adminGrantMasterBall);
  const ultraBall = signedNumberInput(els.adminGrantUltraBall);
  const rareCandy = signedNumberInput(els.adminGrantRareCandy);
  const extraItemId = els.adminItemSelect.value;
  const extraItemAmount = signedNumberInput(els.adminItemAmount);
  if (!gold && !masterBall && !ultraBall && !rareCandy && !extraItemAmount) {
    els.adminStatus.textContent = "Ingresa al menos un ajuste positivo o negativo.";
    return;
  }
  if (extraItemAmount && !extraItemId) {
    els.adminStatus.textContent = "Elegi el item extra o deja la cantidad en 0.";
    return;
  }
  const items = {};
  if (masterBall) items.masterBall = masterBall;
  if (ultraBall) items.ultraBall = ultraBall;
  if (rareCandy) items.rareCandy = rareCandy;
  if (extraItemId && extraItemAmount) items[extraItemId] = (items[extraItemId] || 0) + extraItemAmount;
  els.adminStatus.textContent = "Enviando ajuste...";
  try {
    await cloud.db.collection("grants").doc(currentAdminTarget.uid).set({
      grantId: `admin-${Date.now()}`,
      gold,
      items,
      from: cloud.user.uid,
      targetUserId: currentAdminTarget.userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    els.adminStatus.textContent = "Ajuste enviado. Se aplicara cuando el jugador vuelva a entrar.";
    resetAdminGrantForm();
  } catch (error) {
    els.adminStatus.textContent = `No se pudo enviar: ${error.message}`;
  }
}

function resetAdminGrantForm() {
  els.adminGrantGold.value = 0;
  els.adminGrantMasterBall.value = 0;
  els.adminGrantUltraBall.value = 0;
  els.adminGrantRareCandy.value = 0;
  els.adminItemSelect.value = "";
  els.adminItemAmount.value = 0;
}

function signedNumberInput(input) {
  return Math.trunc(Number(input.value) || 0);
}

function normalizeUserId(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function accountEmail(userId) {
  return `${userId}@pokerastro.local`;
}

function applyAccountGrants(grants) {
  state.appliedGrants = Array.isArray(state.appliedGrants) ? state.appliedGrants : [];
  const applied = [];
  grants.forEach((grant) => {
    const id = String(grant.grantId || "");
    if (!id || state.appliedGrants.includes(id)) return;
    const gold = Number(grant.gold) || 0;
    const amount = Number(grant.amount) || 0;
    if (gold) {
      state.gold = Math.max(0, state.gold + gold);
      applied.push(`${gold > 0 ? "+" : ""}${gold} oro`);
    }
    if (grant.itemId && amount) {
      addItem(grant.itemId, amount);
      applied.push(`${findItem(grant.itemId)?.name || grant.itemId} x${amount}`);
    }
    state.appliedGrants.push(id);
  });
  return applied;
}

function replaceState(next) {
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, next);
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
}

function loadState() {
  const base = baseState();
  try {
    const savedKey = [SAVE_KEY, ...OLD_SAVE_KEYS].find((key) => localStorage.getItem(key));
    const saved = savedKey ? JSON.parse(localStorage.getItem(savedKey)) : null;
    return saved ? { ...base, ...saved } : base;
  } catch {
    return base;
  }
}

function baseState() {
  return {
    gold: 120,
    steps: 0,
    caught: 0,
    activeId: null,
    areaId: 0,
    syncUserId: "",
    wild: null,
    collection: [],
    items: defaultItems(),
    stats: defaultStats(),
    achievementsClaimed: [],
    missionsClaimed: [],
    appliedGrants: [],
    activeMissions: [],
    log: []
  };
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
  upgraded.appliedGrants = raw.appliedGrants || [];
  upgraded.syncUserId = raw.syncUserId || "";
  upgraded.activeMissions = raw.activeMissions || [];
  upgraded.areaId = clamp(Number(raw.areaId) || 0, 0, CAPTURE_AREAS.length - 1);
  return upgraded;
}

function upgradePokemon(mon) {
  const rarity = mon.rarity || (MYTHICAL_IDS.has(mon.apiId) ? "mythical" : LEGENDARY_IDS.has(mon.apiId) ? "legendary" : "normal");
  const baseStats = mon.baseStats || mon.stats || { hp: 45, attack: 45, defense: 45, spAtk: 45, spDef: 45, speed: 45 };
  const statBonus = mon.statBonus || { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };
  const level = clamp(mon.level || 5, 1, MAX_LEVEL);
  const stats = scaleStats(baseStats, level, rarity, statBonus);
  const maxHp = mon.maxHp || stats.hp;
  return {
    ...mon,
    level,
    rarity,
    baseStats,
    statBonus,
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
  SHOP_ITEMS.forEach((item) => {
    items[item.id] = 0;
  });
  CARD_ITEMS.forEach((item) => {
    items[item.id] = 0;
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
  scheduleCloudSave();
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

function totalCards() {
  return CARD_ITEMS.reduce((sum, card) => sum + getItem(card.id), 0);
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
  if (CARD_ITEMS.some((card) => card.id === id)) return cardIconUrl(id);
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${ITEM_SLUGS[id] || id}.png`;
}

function cardIconUrl(id) {
  const fill = id === "cardLegend" ? "#facc15" : id === "cardHolo" ? "#67e8f9" : id === "cardRare" ? "#c084fc" : "#94a3b8";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="14" y="6" width="36" height="52" rx="5" fill="#0f172a" stroke="${fill}" stroke-width="4"/><circle cx="32" cy="28" r="11" fill="${fill}"/><path d="M21 45h22" stroke="#e5e7eb" stroke-width="4" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
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
  if (id === "quantityModal") quantityAction = null;
}

function setBusy(value) {
  busy = value;
  els.walkBtn.disabled = value;
  els.autoBattleBtn.disabled = value;
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
