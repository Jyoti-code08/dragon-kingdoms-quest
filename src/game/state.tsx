import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  ACHIEVEMENTS,
  DRAGONS,
  HOUSES,
  LOCATIONS,
  QUESTS,
  dragonById,
  dragonXpForLevel,
  houseById,
  itemById,
  locationById,
  xpForLevel,
  type Effects,
  type HouseId,
} from "./data";

const SAVE_KEY = "seven-kingdoms-save-v1";

export type Screen =
  | "title"
  | "howto"
  | "house"
  | "profile"
  | "dragonpick"
  | "realm";

export interface DragonState {
  unlocked: boolean;
  bond: number;
  xp: number;
  level: number;
  fed: number;
  trained: number;
}

export interface ChronicleEntry {
  id: number;
  kind: string;
  text: string;
}

export interface GameState {
  screen: Screen;
  playerName: string;
  houseId: HouseId | null;
  dragonId: string | null;
  level: number;
  xp: number;
  gold: number;
  army: number;
  food: number;
  reputation: number;
  influence: number;
  currentLocation: string;
  dragons: Record<string, DragonState>;
  locations: Record<string, { unlocked: boolean; owner: string }>;
  quests: Record<string, { status: "done"; choice: string }>;
  relations: Record<string, number>;
  inventory: Record<string, number>;
  achievements: string[];
  chronicle: ChronicleEntry[];
  battlesWon: number;
  battlesLost: number;
  metCharacters: string[];
}

const DEF_DRAGON: DragonState = { unlocked: false, bond: 0, xp: 0, level: 1, fed: 0, trained: 0 };
export const dragonState = (s: GameState, id: string): DragonState => s.dragons[id] ?? DEF_DRAGON;
export const locState = (s: GameState, id: string): { unlocked: boolean; owner: string } =>
  s.locations[id] ?? { unlocked: false, owner: "neutral" };

const emptyState = (): GameState => ({
  screen: "title",
  playerName: "",
  houseId: null,
  dragonId: null,
  level: 1,
  xp: 0,
  gold: 0,
  army: 0,
  food: 0,
  reputation: 0,
  influence: 0,
  currentLocation: "capital",
  dragons: {},
  locations: {},
  quests: {},
  relations: {},
  inventory: {},
  achievements: [],
  chronicle: [],
  battlesWon: 0,
  battlesLost: 0,
  metCharacters: [],
});

export const foundNewGame = (name: string, houseId: HouseId): GameState => {
  const house = houseById(houseId);
  const s = emptyState();
  s.screen = "dragonpick";
  s.playerName = name;
  s.houseId = houseId;
  s.gold = house.start.gold;
  s.army = house.start.army;
  s.food = house.start.food;
  s.reputation = house.start.reputation;
  s.influence = house.start.influence;
  s.currentLocation = house.startLocation;
  s.dragons = Object.fromEntries(
    DRAGONS.map((d) => [
      d.id,
      {
        unlocked: house.startDragons.includes(d.id),
        bond: house.startDragons.includes(d.id) ? 20 : 0,
        xp: 0,
        level: 1,
        fed: 0,
        trained: 0,
      } satisfies DragonState,
    ]),
  );
  s.locations = Object.fromEntries(
    LOCATIONS.map((l) => [
      l.id,
      {
        unlocked: l.unlockLevel <= 1 || l.id === house.startLocation,
        owner: l.owner === houseId ? houseId : l.owner,
      },
    ]),
  );
  s.relations = Object.fromEntries(
    // house members start friendlier
    HOUSES.flatMap(() => []) as [string, number][],
  );
  s.chronicle = [
    {
      id: Date.now(),
      kind: "Beginning",
      text: `${name} of ${house.name} takes up the mantle at ${house.seat}. The realm holds its breath.`,
    },
  ];
  return s;
};

interface Ctx {
  state: GameState;
  set: (fn: (s: GameState) => GameState) => void;
  hasSave: boolean;
  newGame: () => void;
  continueGame: () => void;
  saveGame: () => void;
  applyEffects: (e: Effects, label?: string) => void;
  log: (kind: string, text: string) => void;
  goto: (s: Screen) => void;
  relationOf: (charId: string) => number;
}

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(emptyState);
  const [hasSave, setHasSave] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef(state);
  ref.current = state;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        if (parsed && parsed.houseId) setHasSave(true);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((s: GameState) => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(s));
      setHasSave(!!s.houseId);
    } catch {
      /* ignore */
    }
  }, []);

  const set = useCallback(
    (fn: (s: GameState) => GameState) => {
      setState((prev) => {
        const next = checkAchievements(fn(prev));
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const log = useCallback(
    (kind: string, text: string) => {
      set((s) => ({
        ...s,
        chronicle: [{ id: Date.now() + Math.random(), kind, text }, ...s.chronicle].slice(0, 200),
      }));
    },
    [set],
  );

  const goto = useCallback((screen: Screen) => set((s) => ({ ...s, screen })), [set]);

  const newGame = useCallback(() => {
    const s = emptyState();
    s.screen = "house";
    setState(s);
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* ignore */
    }
    setHasSave(false);
    toast.success("A new age begins", { description: "Choose the House you will lead." });
  }, []);

  const continueGame = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as GameState;
      // migrate any newly added content
      DRAGONS.forEach((d) => {
        if (!parsed.dragons[d.id])
          parsed.dragons[d.id] = { unlocked: false, bond: 0, xp: 0, level: 1, fed: 0, trained: 0 };
      });
      LOCATIONS.forEach((l) => {
        if (!parsed.locations[l.id])
          parsed.locations[l.id] = { unlocked: l.unlockLevel <= 1, owner: l.owner };
      });
      setState({ ...emptyState(), ...parsed, screen: parsed.dragonId ? "realm" : "dragonpick" });
      toast.success("Your reign continues", { description: `Welcome back, ${parsed.playerName}.` });
    } catch {
      toast.error("The chronicle could not be read.");
    }
  }, []);

  const saveGame = useCallback(() => {
    persist(ref.current);
    toast.success("Chronicle sealed", { description: "Your progress has been saved." });
  }, [persist]);

  const applyEffects = useCallback(
    (e: Effects, label?: string) => {
      const parts: string[] = [];
      set((s) => {
        const house = s.houseId ? houseById(s.houseId) : null;
        let next: GameState = { ...s };
        const add = (key: keyof GameState, amount: number, name: string, suffix = "") => {
          const cur = next[key] as number;
          next = { ...next, [key]: Math.max(0, Math.round(cur + amount)) } as GameState;
          parts.push(`${amount > 0 ? "+" : ""}${Math.round(amount)} ${name}${suffix}`);
        };
        if (e.gold) add("gold", e.gold, "gold");
        if (e.army) {
          const mult = house?.id === "draven" && e.army > 0 ? 1.2 : 1;
          add("army", e.army * mult, "army");
        }
        if (e.food) add("food", e.food, "food");
        if (e.reputation) add("reputation", e.reputation, "reputation");
        if (e.influence) {
          const mult = house?.id === "aeloria" && e.influence > 0 ? 1.3 : 1;
          add("influence", e.influence * mult, "influence");
        }
        if (e.xp) {
          next.xp += e.xp;
          parts.push(`+${e.xp} XP`);
          while (next.xp >= xpForLevel(next.level)) {
            next.xp -= xpForLevel(next.level);
            next.level += 1;
            parts.push(`Level ${next.level}!`);
            next.chronicle = [
              { id: Date.now() + Math.random(), kind: "Ascension", text: `You rise to level ${next.level}.` },
              ...next.chronicle,
            ];
          }
          // unlock locations by level
          next.locations = { ...next.locations };
          LOCATIONS.forEach((l) => {
            if (!locState(next, l.id).unlocked && l.unlockLevel <= next.level) {
              next.locations[l.id] = { ...locState(next, l.id), unlocked: true };
              parts.push(`${l.name} discovered`);
            }
          });
        }
        if (e.bond && next.dragonId) {
          const mult = house?.id === "valeron" ? 1.25 : 1;
          const d = dragonState(next, next.dragonId);
          next.dragons = {
            ...next.dragons,
            [next.dragonId]: { ...d, bond: Math.min(100, Math.round(d.bond + e.bond * mult)) },
          };
          parts.push(`+${Math.round(e.bond * mult)} dragon bond`);
        }
        if (e.relation) {
          const mult = house?.id === "aeloria" ? 1.25 : 1;
          const rel = { ...next.relations };
          e.relation.forEach((r) => {
            const delta = r.delta > 0 ? Math.round(r.delta * mult) : r.delta;
            rel[r.id] = Math.max(-100, Math.min(100, (rel[r.id] ?? 0) + delta));
          });
          next.relations = rel;
          parts.push("relationships shifted");
        }
        if (e.territory) {
          next.locations = {
            ...next.locations,
            [e.territory]: { unlocked: true, owner: next.houseId ?? "neutral" },
          };
          parts.push(`${locationById(e.territory).name} claimed`);
          next.chronicle = [
            {
              id: Date.now() + Math.random(),
              kind: "Conquest",
              text: `${locationById(e.territory).name} now flies your banner.`,
            },
            ...next.chronicle,
          ];
        }
        if (e.loseTerritory && locState(next, e.loseTerritory).owner === next.houseId) {
          next.locations = {
            ...next.locations,
            [e.loseTerritory]: { ...locState(next, e.loseTerritory), owner: "neutral" },
          };
          parts.push(`${locationById(e.loseTerritory).name} lost`);
        }
        if (e.unlockLocation && !next.locations[e.unlockLocation]?.unlocked) {
          next.locations = {
            ...next.locations,
            [e.unlockLocation]: { ...locState(next, e.unlockLocation), unlocked: true },
          };
          parts.push(`${locationById(e.unlockLocation).name} revealed`);
        }
        if (e.unlockDragon && !next.dragons[e.unlockDragon]?.unlocked) {
          next.dragons = {
            ...next.dragons,
            [e.unlockDragon]: { ...dragonState(next, e.unlockDragon), unlocked: true, bond: 10 },
          };
          parts.push(`${dragonById(e.unlockDragon).name} joins you`);
          next.chronicle = [
            {
              id: Date.now() + Math.random(),
              kind: "Dragon",
              text: `${dragonById(e.unlockDragon).name} answers your call.`,
            },
            ...next.chronicle,
          ];
        }
        if (e.item) {
          next.inventory = { ...next.inventory, [e.item]: (next.inventory[e.item] ?? 0) + 1 };
          parts.push(`${itemById(e.item).name} acquired`);
        }
        return next;
      });
      if (parts.length) {
        toast.success(label ?? "The realm shifts", { description: parts.join(" · ") });
      }
    },
    [set],
  );

  const relationOf = useCallback(
    (charId: string) => state.relations[charId] ?? 0,
    [state.relations],
  );

  const value = useMemo<Ctx>(
    () => ({ state, set, hasSave, newGame, continueGame, saveGame, applyEffects, log, goto, relationOf }),
    [state, set, hasSave, newGame, continueGame, saveGame, applyEffects, log, goto, relationOf],
  );

  if (!hydrated) return null;

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

function checkAchievements(s: GameState): GameState {
  const earned = new Set(s.achievements);
  const unlockedDragons = Object.values(s.dragons).filter((d) => d.unlocked).length;
  const owned = Object.values(s.locations).filter((l) => l.owner === s.houseId).length;
  const bestBond = Math.max(0, ...Object.values(s.dragons).map((d) => d.bond));
  const questsDone = Object.keys(s.quests).length;
  const itemKinds = Object.values(s.inventory).filter((n) => n > 0).length;

  const test: [string, boolean][] = [
    ["first_blood", s.battlesWon >= 1],
    ["dragon_rider", bestBond >= 50],
    ["beast_tamer", unlockedDragons >= 5],
    ["conqueror", owned >= 4],
    ["master_realm", s.level >= 8],
    ["coffers", s.gold >= 3000],
    ["warlord", s.army >= 1500],
    ["diplomat", s.influence >= 80],
    ["chronicler", questsDone >= 10],
    ["legend", s.reputation >= 100],
    ["worldbreaker", locState(s, "capital").owner === s.houseId && s.level >= 5],
    ["collector", itemKinds >= 8],
  ];

  let next = s;
  const newly: string[] = [];
  test.forEach(([id, ok]) => {
    if (ok && !earned.has(id)) {
      earned.add(id);
      newly.push(id);
    }
  });
  if (newly.length) {
    next = {
      ...s,
      achievements: [...earned],
      chronicle: [
        ...newly.map((id) => ({
          id: Date.now() + Math.random(),
          kind: "Achievement",
          text: `Achievement earned: ${ACHIEVEMENTS.find((a) => a.id === id)!.name}.`,
        })),
        ...s.chronicle,
      ],
    };
    newly.forEach((id) => {
      const a = ACHIEVEMENTS.find((x) => x.id === id)!;
      setTimeout(() => toast(`Achievement: ${a.name}`, { description: a.description }), 250);
    });
  }
  return next;
}

export function grantDragonXp(s: GameState, dragonId: string, amount: number): GameState {
  const d = s.dragons[dragonId];
  if (!d) return s;

  let xp = d.xp + amount;
  let level = d.level;
  while (xp >= dragonXpForLevel(level)) {
    xp -= dragonXpForLevel(level);
    level += 1;
  }
  return { ...s, dragons: { ...s.dragons, [dragonId]: { ...d, xp, level } } };
}

export const availableQuests = (s: GameState) =>
  QUESTS.filter(
    (q) =>
      !s.quests[q.id] &&
      q.level <= s.level &&
      (!q.house || q.house === s.houseId) &&
      locState(s, q.location).unlocked,
  );

export const lockedQuests = (s: GameState) =>
  QUESTS.filter((q) => !s.quests[q.id] && !availableQuests(s).includes(q));
