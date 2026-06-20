# Project K

Project K is an original 3D online browser card-battle game. Players are Cardbearers who use K-Cards to summon guardians, cast spells, and awaken a Deck Master in fast server-authoritative duels.

The game uses only procedural geometry, SVG/CSS-style card art, generated Web Audio sounds, and original names/rules/visuals.

## What Is Included

- 3D hub: The Cardbearer Atrium
- Online hub presence with low-rate player position sync
- Online duel rooms with Socket.IO
- Bot duel and tutorial duel
- Deck editor with local custom decks
- Card library with 40 cards
- Four starter decks and four Deck Masters
- LocalStorage saves and safe save reset
- Settings for audio, graphics, motion, fullscreen, FPS, and colorblind icons
- Render server config and Netlify client config

## Project Structure

```text
client/       Vite + Three.js browser client
server/       Node.js + Express + Socket.IO authoritative server
shared/       Cards, starter decks, Deck Masters, rules, bot logic
deploy/       Deployment notes
render.yaml   Render Blueprint for the server
netlify.toml  Netlify config for the client
```

## Run Locally

Install dependencies:

```bash
npm run install:all
```

Start the server:

```bash
npm run dev:server
```

Start the client in another terminal:

```bash
npm run dev:client
```

Open:

```text
http://localhost:5173
```

## Required Commands

Root:

```bash
npm run install:all
npm run dev:server
npm run dev:client
```

Client:

```bash
npm run build --prefix client
```

Server:

```bash
npm start --prefix server
```

## Test Online Duels Locally

1. Run the server and client.
2. Open `http://localhost:5173` in two browser tabs.
3. Enter a different Cardbearer name in each tab.
4. In tab one, open Online Duel and create a room.
5. In tab two, join the room code.
6. Ready both players.
7. Draw, summon, cast, attack, activate a Deck Master, end turns, and surrender from the duel UI.

The server controls deck validation, shuffling, draw, hands, turn state, life totals, monster/spell limits, Deck Master state, win conditions, and disconnect surrender.

## Environment Variables

Client `.env`:

```env
VITE_SERVER_URL=http://localhost:3000
```

Netlify production example:

```env
VITE_SERVER_URL=https://YOUR-RENDER-SERVER.onrender.com
```

Server `.env`:

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Render production example:

```env
CLIENT_ORIGIN=https://YOUR-NETLIFY-SITE.netlify.app
NODE_ENV=production
```

## Deploy The Server To Render

The repository includes `render.yaml`.

1. Push this repository to GitHub.
2. In Render, create a new Blueprint from the repo.
3. Render uses:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/health`
4. Set `CLIENT_ORIGIN` to the final Netlify URL.
5. After deploy, check:

```text
https://YOUR-RENDER-SERVER.onrender.com/health
```

It should return JSON with `"ok": true`.

## Deploy The Client To Netlify

The repository includes `netlify.toml`.

1. Create a Netlify site from this GitHub repo.
2. Netlify uses:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set:

```env
VITE_SERVER_URL=https://YOUR-RENDER-SERVER.onrender.com
```

4. Deploy the site.
5. Copy the Netlify URL back into Render as `CLIENT_ORIGIN`.

## How Friends Join Online

Friends use the Netlify game URL. One player creates an Online Duel room, sends the four-character room code, and the other player joins from the Online Duel screen.

## Editing Cards

Cards live in:

```text
shared/cards.js
```

Monster cards use `type: "monster"` and include attack, defense, element, rarity, flavor, procedural model data, and card art colors.

Spell cards use `type: "spell"` and include a `spellType` handled by `shared/rules.js`.

## Adding Cards

1. Add the card to `CARDS` in `shared/cards.js`.
2. If it is a new spell behavior, add the resolver branch in `resolveSpell()` in `shared/rules.js`.
3. Run:

```bash
npm run test --prefix server
npm run build --prefix client
```

## Editing Starter Decks

Starter decks live in `STARTER_DECKS` in `shared/cards.js`.

Deck rules:

- Exactly 10 cards
- At least 5 monsters
- At least 3 spells
- No more than 2 copies of the same card
- Exactly 1 Deck Master

## Editing Deck Masters

Deck Masters live in `DECK_MASTERS` in `shared/cards.js`.

Their awakening checks are handled by `checkAllAwaken()` in `shared/rules.js`, and their once-per-duel abilities are handled by `activateDeckMaster()`.

## Updating Patch Notes

Patch notes are rendered in:

```text
client/src/projectKApp.js
```

Search for `renderPatchNotes()` and update the version title and list.

## Verification

Useful checks:

```bash
npm run install:all
npm run test --prefix server
npm run build --prefix client
```

## Honest Limitations

- Online movement sync is intentionally lightweight.
- The first version has one active monster per player and no instant-speed responses.
- The art is procedural and readable rather than high-detail.
- The client bundle includes Three.js in the main bundle, so Vite may print a chunk-size warning during build.
