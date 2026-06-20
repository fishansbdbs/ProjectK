import test from "node:test";
import assert from "node:assert/strict";
import { CARD_TYPES, STARTER_DECKS, getCard } from "../../shared/cards.js";
import { applyAction, createDuel, deckFromStarter, sanitizeDuelForPlayer, validateDeck } from "../../shared/rules.js";

test("starter decks are legal", () => {
  for (const deck of STARTER_DECKS) {
    const result = validateDeck(deck);
    assert.equal(result.valid, true, `${deck.name}: ${result.errors.join(", ")}`);
  }
});

test("duel starts with hands and draws on first turn", () => {
  const state = createDuel({
    seed: "test-start",
    players: [
      { id: "p1", name: "One", deck: deckFromStarter("ember-pride") },
      { id: "p2", name: "Two", deck: deckFromStarter("ironroot-wall") }
    ]
  });
  assert.equal(state.players[0].hand.length, 5);
  assert.equal(state.players[1].hand.length, 4);
  assert.equal(state.players[0].deck.length, 5);
});

test("one monster and one spell limits are enforced", () => {
  const state = createDuel({
    seed: "test-limits",
    players: [
      { id: "p1", name: "One", deck: deckFromStarter("ember-pride") },
      { id: "p2", name: "Two", deck: deckFromStarter("ironroot-wall") }
    ]
  });
  const monsterIndex = state.players[0].hand.findIndex((id) => getCard(id)?.type === CARD_TYPES.MONSTER);
  assert.equal(applyAction(state, "p1", { type: "playMonster", handIndex: monsterIndex }).ok, true);
  const secondMonsterIndex = state.players[0].hand.findIndex((id) => getCard(id)?.type === CARD_TYPES.MONSTER);
  assert.equal(applyAction(state, "p1", { type: "playMonster", handIndex: secondMonsterIndex }).ok, false);
  const spellIndex = state.players[0].hand.findIndex((id) => getCard(id)?.type === CARD_TYPES.SPELL);
  assert.equal(applyAction(state, "p1", { type: "playSpell", handIndex: spellIndex }).ok, true);
  const secondSpellIndex = state.players[0].hand.findIndex((id) => getCard(id)?.type === CARD_TYPES.SPELL);
  if (secondSpellIndex !== -1) assert.equal(applyAction(state, "p1", { type: "playSpell", handIndex: secondSpellIndex }).ok, false);
});

test("combat and direct damage can produce a winner", () => {
  const state = createDuel({
    seed: "test-combat",
    players: [
      { id: "p1", name: "One", deck: deckFromStarter("ember-pride") },
      { id: "p2", name: "Two", deck: deckFromStarter("tidebound-circle") }
    ]
  });
  state.players[0].activeMonster = { uid: "x", cardId: "flamehorn-brute", attack: 5000, defense: 700, baseAttack: 1500, baseDefense: 700, temporaryAttack: 0, temporaryDefense: 0 };
  assert.equal(applyAction(state, "p1", { type: "attack" }).ok, true);
  assert.equal(state.winner.playerId, "p1");
});

test("deck master ability and sanitized state hide enemy hand", () => {
  const state = createDuel({
    seed: "test-master",
    players: [
      { id: "p1", name: "One", deck: deckFromStarter("ember-pride") },
      { id: "p2", name: "Two", deck: deckFromStarter("ironroot-wall") }
    ]
  });
  state.players[0].masterMeter = 100;
  state.players[0].activeMonster = { uid: "x", cardId: "ember-cub", attack: 900, defense: 500, baseAttack: 900, baseDefense: 500, temporaryAttack: 0, temporaryDefense: 0 };
  assert.equal(applyAction(state, "p1", { type: "activateMaster" }).ok, true);
  assert.equal(state.players[0].activeMonster.attack, 1600);
  const view = sanitizeDuelForPlayer(state, "p1");
  assert.ok(Array.isArray(view.players[0].hand));
  assert.equal(view.players[1].hand, undefined);
  assert.equal(typeof view.players[1].handCount, "number");
});
