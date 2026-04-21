// Persistent anonymous session for LAN-based rooms
const SESSION_KEY = "dsa_session_id";
const USERNAME_KEY = "dsa_username";
const OWNED_ROOMS_KEY = "dsa_owned_rooms";

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function setUsername(name: string) {
  localStorage.setItem(USERNAME_KEY, name);
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

type OwnedRoomsMap = Record<string, string>;

function getOwnedRoomsMap(): OwnedRoomsMap {
  const raw = localStorage.getItem(OWNED_ROOMS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as OwnedRoomsMap;
  } catch {
    return {};
  }
}

function setOwnedRoomsMap(map: OwnedRoomsMap) {
  localStorage.setItem(OWNED_ROOMS_KEY, JSON.stringify(map));
}

export function claimRoomOwnership(roomCode: string, sessionId: string) {
  const map = getOwnedRoomsMap();
  map[roomCode] = sessionId;
  setOwnedRoomsMap(map);
}

export function isClaimedRoomOwner(roomCode: string, sessionId: string): boolean {
  const map = getOwnedRoomsMap();
  return map[roomCode] === sessionId;
}
