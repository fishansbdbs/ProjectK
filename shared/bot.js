import { CARD_TYPES, getCard } from "./cards.js";
import { legalSummary } from "./rules.js";

function findHandIndex(player, predicate) {
  return player.hand.findIndex((id) => predicate(getCard(id), id));
}

function monsterScore(card, difficulty) {
  if (!card) return -1;
  if (difficulty === "hard") return card.attack * 1.15 + card.defense;
  if (difficulty === "normal") return card.attack + card.defense;
  return Math.random() * 1000;
}

function bestMonsterIndex(player, difficulty) {
  let best = -1;
  let bestScore = -1;
  player.hand.forEach((id, index) => {
    const card = getCard(id);
    if (card?.type !== CARD_TYPES.MONSTER) return;
    const score = monsterScore(card, difficulty);
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}

function usefulSpellIndex(state, botIndex, difficulty) {
  const bot = state.players[botIndex];
  const foe = state.players[botIndex === 0 ? 1 : 0];
  const priorities =
    difficulty === "hard"
      ? ["riskyDamage", "damage", "destroyWeak", "heal", "shield", "boost", "weaken", "mark", "skipAttack", "meter", "fortify"]
      : ["damage", "heal", "boost", "shield", "weaken", "mark", "meter", "fortify", "skipAttack", "destroyWeak", "riskyDamage"];

  for (const spellType of priorities) {
    const index = findHandIndex(bot, (card) => {
      if (card?.type !== CARD_TYPES.SPELL || card.spellType !== spellType) return false;
      if (["boost", "fortify", "returnSelf"].includes(card.spellType) && !bot.activeMonster) return false;
      if (["weaken", "destroyWeak"].includes(card.spellType) && !foe.activeMonster) return false;
      if (card.spellType === "destroyWeak" && foe.activeMonster?.attack > card.value) return false;
      if (card.spellType === "heal" && bot.life > 3300 && difficulty !== "easy") return false;
      return true;
    });
    if (index !== -1) return index;
  }
  return -1;
}

export function chooseBotAction(state, botPlayerId, difficulty = "normal") {
  const botIndex = state.players.findIndex((player) => player.id === botPlayerId);
  if (botIndex === -1) return { type: "endTurn" };
  const bot = state.players[botIndex];
  const legal = legalSummary(state, botPlayerId);
  if (!legal.isTurn) return null;

  if (legal.canActivateMaster) {
    if (difficulty !== "easy" || bot.life < 2600 || bot.activeMonster || Math.random() > 0.35) {
      return { type: "activateMaster" };
    }
  }

  if (legal.canPlayMonster) {
    const index = bestMonsterIndex(bot, difficulty);
    if (index !== -1) return { type: "playMonster", handIndex: index };
  }

  if (legal.canPlaySpell) {
    const index = usefulSpellIndex(state, botIndex, difficulty);
    if (index !== -1) return { type: "playSpell", handIndex: index };
  }

  if (legal.canAttack) return { type: "attack" };
  return { type: "endTurn" };
}
