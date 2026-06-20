import http from "node:http";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { applyAction, createDuel, endTurn, sanitizeDuelForPlayer, validateDeck } from "../../shared/rules.js";

const PORT = Number(process.env.PORT || 3000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const LOCAL_ORIGINS = new Set(["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173"]);
const app = express();
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => { const origin = req.headers.origin; if (isOriginAllowed(origin)) { res.setHeader("Access-Control-Allow-Origin", origin || "*"); res.setHeader("Vary", "Origin"); res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS"); res.setHeader("Access-Control-Allow-Headers", "Content-Type"); } if (req.method === "OPTIONS") return res.status(204).end(); next(); });
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin(origin, callback) { callback(null, isOriginAllowed(origin)); }, methods: ["GET", "POST"] } });
const hubPlayers = new Map();
const duelRooms = new Map();
const disconnectTimers = new Map();

app.get("/", (_req, res) => res.json({ ok: true, game: "Project K", message: "Project K server is awake. Use /health for deployment checks." }));
app.get("/health", (_req, res) => res.json({ ok: true, game: "Project K", version: "0.1.0", activePlayers: hubPlayers.size, duelRooms: duelRooms.size, uptime: Math.round(process.uptime()) }));

io.on("connection", (socket) => {
  socket.emit("server:hello", { id: socket.id, at: Date.now() });
  socket.on("player:enter", (payload = {}) => { const player = normalizeHubPlayer(socket.id, payload); hubPlayers.set(socket.id, player); socket.emit("hub:snapshot", { players: [...hubPlayers.values()] }); socket.broadcast.emit("hub:joined", player); });
  socket.on("hub:position", (payload = {}) => { const player = hubPlayers.get(socket.id); if (!player) return; player.position = sanitizePosition(payload.position); player.state = payload.state || "hub"; player.roomStatus = payload.roomStatus || ""; player.lastSeen = Date.now(); });
  socket.on("duel:create", (payload = {}, reply) => { const room = createRoom(socket, payload); socket.join(room.code); emitLobby(room); reply?.({ ok: true, code: room.code }); });
  socket.on("duel:join", (payload = {}, reply) => { const code = String(payload.code || "").trim().toUpperCase(); const room = duelRooms.get(code); if (!room) return reply?.({ ok: false, message: "Room not found." }); if (room.players.length >= 2 && !room.players.some((p) => p.socketId === socket.id)) return reply?.({ ok: false, message: "Room is full." }); upsertRoomPlayer(room, socket, payload); socket.join(code); emitLobby(room); reply?.({ ok: true, code }); });
  socket.on("duel:setDeck", (payload = {}, reply) => { const room = getSocketRoom(socket, payload.code); if (!room) return reply?.({ ok: false, message: "Room not found." }); const roomPlayer = room.players.find((p) => p.socketId === socket.id); if (!roomPlayer) return reply?.({ ok: false, message: "You are not in this room." }); const validation = validateDeck(payload.deck); if (!validation.valid) return reply?.({ ok: false, message: validation.errors.join(" ") }); roomPlayer.deck = payload.deck; roomPlayer.ready = false; emitLobby(room); reply?.({ ok: true }); });
  socket.on("duel:ready", (payload = {}, reply) => { const room = getSocketRoom(socket, payload.code); if (!room) return reply?.({ ok: false, message: "Room not found." }); const roomPlayer = room.players.find((p) => p.socketId === socket.id); if (!roomPlayer) return reply?.({ ok: false, message: "You are not in this room." }); roomPlayer.ready = Boolean(payload.ready); emitLobby(room); if (room.players.length === 2 && room.players.every((p) => p.ready)) startRoomDuel(room); reply?.({ ok: true }); });
  socket.on("duel:action", (payload = {}, reply) => { const room = getSocketRoom(socket, payload.code); if (!room?.state) return reply?.({ ok: false, message: "Duel not active." }); const result = applyAction(room.state, socket.id, payload.action || {}); emitDuel(room); reply?.({ ok: result.ok, message: result.message }); });
  socket.on("duel:leave", (payload = {}) => leaveRoom(socket, payload.code));
  socket.on("disconnect", () => { if (hubPlayers.has(socket.id)) { hubPlayers.delete(socket.id); socket.broadcast.emit("hub:left", { id: socket.id }); } for (const room of duelRooms.values()) { const roomPlayer = room.players.find((p) => p.socketId === socket.id); if (!roomPlayer) continue; roomPlayer.connected = false; if (room.state) { const statePlayer = room.state.players.find((p) => p.id === socket.id); if (statePlayer) statePlayer.connected = false; scheduleDisconnectLoss(room, socket.id); emitDuel(room); } else { room.players = room.players.filter((p) => p.socketId !== socket.id); if (room.players.length === 0) duelRooms.delete(room.code); else emitLobby(room); } } });
});

setInterval(() => io.emit("hub:snapshot", { players: [...hubPlayers.values()] }), 500);
setInterval(() => { const now = Date.now(); for (const room of duelRooms.values()) { if (!room.state || room.state.winner || room.state.turnEndsAt > now) continue; endTurn(room.state, room.state.players[room.state.current].id); emitDuel(room); } }, 1000);
server.listen(PORT, "0.0.0.0", () => console.log(`Project K server listening on ${PORT}`));

function isOriginAllowed(origin) { if (!origin || origin === CLIENT_ORIGIN || LOCAL_ORIGINS.has(origin)) return true; try { return new URL(origin).hostname.endsWith(".netlify.app"); } catch { return false; } }
function normalizeHubPlayer(socketId, payload) { return { id: socketId, name: safeName(payload.name), color: safeColor(payload.color), position: sanitizePosition(payload.position), state: payload.state || "hub", roomStatus: payload.roomStatus || "", lastSeen: Date.now() }; }
function sanitizePosition(position = {}) { return { x: clampNumber(position.x, -50, 50), y: clampNumber(position.y, -10, 10), z: clampNumber(position.z, -50, 50), ry: clampNumber(position.ry, -Math.PI * 2, Math.PI * 2) }; }
function clampNumber(value, min, max) { const n = Number(value); return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : 0; }
function safeName(value) { return String(value || "Cardbearer").slice(0, 18).replace(/[^\w -]/g, "").trim() || "Cardbearer"; }
function safeColor(value) { const text = String(value || "#f97316"); return /^#[0-9a-f]{6}$/i.test(text) ? text : "#f97316"; }
function createRoom(socket, payload) { let code = ""; do code = Math.random().toString(36).slice(2, 6).toUpperCase(); while (duelRooms.has(code)); const room = { code, hostId: socket.id, createdAt: Date.now(), status: "lobby", players: [], state: null }; duelRooms.set(code, room); upsertRoomPlayer(room, socket, payload); return room; }
function upsertRoomPlayer(room, socket, payload = {}) { const existing = room.players.find((p) => p.socketId === socket.id); const hubPlayer = hubPlayers.get(socket.id); const next = { socketId: socket.id, name: safeName(payload.name ?? hubPlayer?.name), color: safeColor(payload.color ?? hubPlayer?.color), deck: payload.deck, ready: false, connected: true }; if (existing) Object.assign(existing, next); else room.players.push(next); }
function getSocketRoom(socket, codeInput) { const code = String(codeInput || "").trim().toUpperCase(); const direct = duelRooms.get(code); if (direct?.players.some((p) => p.socketId === socket.id)) return direct; return [...duelRooms.values()].find((room) => room.players.some((p) => p.socketId === socket.id)); }
function emitLobby(room) { io.to(room.code).emit("duel:lobby", { code: room.code, hostId: room.hostId, status: room.status, players: room.players.map((p) => ({ id: p.socketId, name: p.name, color: p.color, ready: p.ready, connected: p.connected, deckName: p.deck?.name || "Starter Deck" })) }); }
function startRoomDuel(room) { room.status = "active"; room.state = createDuel({ seed: `room-${room.code}-${Date.now()}`, players: room.players.map((p) => ({ id: p.socketId, name: p.name, color: p.color, deck: p.deck })) }); emitDuel(room); }
function emitDuel(room) { for (const roomPlayer of room.players) io.to(roomPlayer.socketId).emit("duel:state", { code: room.code, state: sanitizeDuelForPlayer(room.state, roomPlayer.socketId) }); emitLobby(room); }
function leaveRoom(socket, codeInput) { const room = getSocketRoom(socket, codeInput); if (!room) return; if (room.state && !room.state.winner) { applyAction(room.state, socket.id, { type: "surrender" }); emitDuel(room); } room.players = room.players.filter((p) => p.socketId !== socket.id); socket.leave(room.code); if (room.players.length === 0) duelRooms.delete(room.code); else emitLobby(room); }
function scheduleDisconnectLoss(room, socketId) { const key = `${room.code}:${socketId}`; if (disconnectTimers.has(key)) return; const timer = setTimeout(() => { disconnectTimers.delete(key); if (!room.state || room.state.winner) return; const statePlayer = room.state.players.find((p) => p.id === socketId); if (statePlayer?.connected === false) { applyAction(room.state, socketId, { type: "surrender" }); emitDuel(room); } }, 30000); disconnectTimers.set(key, timer); }
