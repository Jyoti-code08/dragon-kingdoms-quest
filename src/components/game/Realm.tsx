import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Btn } from "./Btn";
import { Chip, DragonPortrait, Embers, HouseSigil, Meter, Ornament } from "./atoms";
import { Battle } from "./Battle";
import {
  ACHIEVEMENTS,
  CHARACTERS,
  DRAGONS,
  ENEMIES,
  ITEMS,
  LOCATIONS,
  QUESTS,
  charById,
  dragonById,
  dragonXpForLevel,
  enemyById,
  houseById,
  itemById,
  locationById,
  questById,
  xpForLevel,
  type Character,
  type Enemy,
  type Quest,
} from "@/game/data";
import { dragonState, grantDragonXp, locState, useGame, type GameState } from "@/game/state";
import { cn } from "@/lib/utils";

const TABS = [
  "realm",
  "map",
  "dragons",
  "characters",
  "quests",
  "battles",
  "house",
  "inventory",
  "chronicle",
] as const;
type Tab = (typeof TABS)[number];

const ownedTerritories = (s: GameState) =>
  LOCATIONS.filter((l) => locState(s, l.id).owner === s.houseId);

const questsAt = (s: GameState, locationId: string) =>
  QUESTS.filter(
    (q) =>
      q.location === locationId &&
      !s.quests[q.id] &&
      q.level <= s.level &&
      (!q.house || q.house === s.houseId),
  );

const openQuests = (s: GameState) =>
  QUESTS.filter(
    (q) =>
      !s.quests[q.id] &&
      q.level <= s.level &&
      (!q.house || q.house === s.houseId) &&
      locState(s, q.location).unlocked,
  );

export function Realm() {
  const { state, set, saveGame, newGame, applyEffects, log } = useGame();
  const [tab, setTab] = useState<Tab>("realm");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [pending, setPending] = useState<{ enemyId: string; questId?: string; choiceId?: string } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [talking, setTalking] = useState<Character | null>(null);
  const [lastTribute, setLastTribute] = useState(0);

  const house = houseById(state.houseId ?? "valeron");
  const dragon = dragonById(state.dragonId ?? house.startDragons[0]!);
  const ds = dragonState(state, dragon.id);
  const location = locationById(state.currentLocation);
  const territories = ownedTerritories(state);

  const goTab = (t: Tab) => {
    setTab(t);
    setMenuOpen(false);
  };

  const startBattle = (enemyId: string, questId?: string, choiceId?: string) => {
    setPending({ enemyId, questId, choiceId });
    setActiveQuest(null);
    setTab("battles");
    setMenuOpen(false);
  };

  const resolveBattle = (won: boolean, enemy: Enemy) => {
    const q = pending?.questId ? questById(pending.questId) : null;
    const choice = q?.choices.find((c) => c.id === pending?.choiceId);
    setPending(null);
    if (won) {
      set((s) => {
        const next = grantDragonXp({ ...s, battlesWon: s.battlesWon + 1 }, dragon.id, Math.round(enemy.reward.xp * 0.7));
        return next;
      });
      applyEffects(
        {
          gold: enemy.reward.gold,
          xp: enemy.reward.xp,
          reputation: enemy.reward.reputation,
          army: enemy.reward.army,
          item: enemy.reward.item,
          territory: enemy.reward.territory,
          bond: 6,
        },
        `Victory over ${enemy.name}`,
      );
      log("Battle", `Victory: ${enemy.name} was broken in the field.`);
      if (q && choice) completeQuest(q, choice.id, true);
    } else {
      set((s) => ({ ...s, battlesLost: s.battlesLost + 1 }));
      applyEffects(
        { gold: -Math.round(state.gold * 0.12), army: -Math.round(state.army * 0.15), reputation: -6, xp: 25 },
        `Defeat at the hands of ${enemy.name}`,
      );
      log("Battle", `Defeat: ${enemy.name} drove your host from the field.`);
    }
  };

  const completeQuest = (q: Quest, choiceId: string, silent = false) => {
    const choice = q.choices.find((c) => c.id === choiceId)!;
    set((s) => grantDragonXp({ ...s, quests: { ...s.quests, [q.id]: { status: "done", choice: choiceId } } }, dragon.id, 40));
    if (!silent) applyEffects(choice.effects, `Quest complete — ${q.title}`);
    else applyEffects(choice.effects, `Quest complete — ${q.title}`);
    log("Quest", `${q.title}: ${choice.outcome || choice.label}`);
    setActiveQuest(null);
  };

  const chooseQuest = (q: Quest, choiceId: string) => {
    const choice = q.choices.find((c) => c.id === choiceId)!;
    if (choice.battle) {
      startBattle(choice.battle, q.id, choice.id);
      return;
    }
    completeQuest(q, choiceId);
  };

  const collectTribute = () => {
    const now = Date.now();
    if (now - lastTribute < 45000) {
      toast("The stewards are still counting", {
        description: `Tribute may be collected again in ${Math.ceil((45000 - (now - lastTribute)) / 1000)}s.`,
      });
      return;
    }
    setLastTribute(now);
    const gold = territories.reduce(
      (n, t) => n + Math.round(t.income * (house.id === "kaelthorn" && t.resources.includes("Ships") ? 1.25 : 1)),
      40,
    );
    const army = territories.reduce((n, t) => n + Math.round(t.armyGain * 0.3), 10);
    const food = territories.length * 25 + 20;
    applyEffects({ gold, army, food, xp: 20 }, "Tribute collected");
    log("Realm", `Tribute gathered from ${territories.length} holding(s): ${gold} gold.`);
  };

  return (
    <div className="relative min-h-screen pb-16">
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <Embers count={14} />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <HouseSigil house={house} className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm leading-tight sm:text-base">
              {state.playerName}
            </p>
            <p className="truncate text-[10px] tracking-widest text-muted-foreground uppercase">
              {house.name} · Lv {state.level} · {location.name}
            </p>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <ResourceStrip state={state} />
          </div>
          <Btn variant="quiet" className="hidden sm:inline-flex" onClick={saveGame}>
            Save
          </Btn>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-md border border-border p-2 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        <nav className="mx-auto hidden max-w-7xl gap-1 overflow-x-auto px-4 pb-2 lg:flex">
          {TABS.map((t) => (
            <NavBtn key={t} label={t} active={tab === t} onClick={() => goTab(t)} />
          ))}
        </nav>
        {menuOpen && (
          <nav className="grid grid-cols-2 gap-1 border-t border-border/60 p-3 sm:grid-cols-3 lg:hidden">
            {TABS.map((t) => (
              <NavBtn key={t} label={t} active={tab === t} onClick={() => goTab(t)} />
            ))}
            <Btn variant="quiet" onClick={saveGame}>
              Save Game
            </Btn>
          </nav>
        )}
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
          <ResourceStrip state={state} />
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6">
        {tab === "realm" && (
          <RealmView
            state={state}
            onTribute={collectTribute}
            onTab={goTab}
            onQuest={(q) => setActiveQuest(q)}
            onNewGame={newGame}
            onSave={saveGame}
          />
        )}
        {tab === "map" && (
          <MapView
            state={state}
            selected={selectedLocation}
            onSelect={setSelectedLocation}
            onTravel={(id) => {
              set((s) => ({ ...s, currentLocation: id }));
              applyEffects({ xp: 15, food: -10 }, `Travelled to ${locationById(id).name}`);
              log("Travel", `You ride for ${locationById(id).name}.`);
            }}
            onQuest={(q) => setActiveQuest(q)}
          />
        )}
        {tab === "dragons" && <DragonHall />}
        {tab === "characters" && <CharacterView onTalk={setTalking} />}
        {tab === "quests" && <QuestView state={state} onOpen={setActiveQuest} />}
        {tab === "battles" && (
          <BattleView
            state={state}
            pending={pending}
            onStart={(id) => startBattle(id)}
            onResolve={resolveBattle}
            onFlee={() => {
              setPending(null);
              toast("You withdraw", { description: "No spoils, no shame worth speaking of." });
            }}
          />
        )}
        {tab === "house" && <HouseView state={state} onTalk={setTalking} onQuest={setActiveQuest} />}
        {tab === "inventory" && <InventoryView />}
        {tab === "chronicle" && <ChronicleView state={state} />}
      </main>

      {activeQuest && (
        <QuestModal
          quest={activeQuest}
          onClose={() => setActiveQuest(null)}
          onChoose={(cid) => chooseQuest(activeQuest, cid)}
        />
      )}
      {talking && <DialogueModal character={talking} onClose={() => setTalking(null)} />}
    </div>
  );
}

function NavBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 font-display text-[11px] tracking-[0.2em] uppercase whitespace-nowrap transition-all",
        active
          ? "bg-primary/25 text-accent ring-1 ring-accent/50"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-accent",
      )}
    >
      {label}
    </button>
  );
}

function ResourceStrip({ state }: { state: GameState }) {
  const items: [string, number | string][] = [
    ["Gold", state.gold],
    ["Army", state.army],
    ["Food", state.food],
    ["Rep", state.reputation],
    ["Infl", state.influence],
  ];
  return (
    <>
      {items.map(([k, v]) => (
        <div
          key={k}
          className="panel flex shrink-0 items-center gap-2 px-2.5 py-1 text-xs whitespace-nowrap"
        >
          <span className="text-[9px] tracking-widest text-muted-foreground uppercase">{k}</span>
          <span className="font-display text-accent">{v}</span>
        </div>
      ))}
    </>
  );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-gilded font-display text-2xl sm:text-3xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      <div className="rule-gold mt-3" />
    </div>
  );
}

function RealmView({
  state,
  onTribute,
  onTab,
  onQuest,
  onNewGame,
  onSave,
}: {
  state: GameState;
  onTribute: () => void;
  onTab: (t: Tab) => void;
  onQuest: (q: Quest) => void;
  onNewGame: () => void;
  onSave: () => void;
}) {
  const house = houseById(state.houseId!);
  const dragon = dragonById(state.dragonId!);
  const ds = dragonState(state, dragon.id);
  const territories = ownedTerritories(state);
  const quests = openQuests(state);
  const featured = quests[0];

  return (
    <div className="space-y-6">
      <SectionHead title="The Realm" sub={`${house.words} — the state of your reign.`} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel-ornate p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start gap-4">
            <HouseSigil house={house} className="h-20 w-20" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl">{state.playerName}</h3>
              <p className="text-xs tracking-widest uppercase" style={{ color: house.accent }}>
                {house.name} · {house.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sworn under {house.ruler}. Currently at {locationById(state.currentLocation).name}.
              </p>
              <div className="mt-3 max-w-sm">
                <Meter
                  label={`Level ${state.level} · XP`}
                  value={state.xp}
                  max={xpForLevel(state.level)}
                  color={house.hue}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["Gold", state.gold],
                ["Army", state.army],
                ["Food", state.food],
                ["Reputation", state.reputation],
                ["Influence", state.influence],
                ["Territories", territories.length],
                ["Battles Won", state.battlesWon],
                ["Dragon Bond", `${ds.bond}%`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="panel px-3 py-2 text-center">
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{k}</p>
                <p className="font-display text-lg text-accent">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn variant="hero" onClick={onTribute}>
              Collect Tribute
            </Btn>
            <Btn variant="regal" onClick={() => onTab("quests")}>
              Council of Quests
            </Btn>
            <Btn variant="regal" onClick={() => onTab("map")}>
              Open the Map
            </Btn>
            <Btn variant="ghost" onClick={onSave}>
              Save Game
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                if (confirm("Abandon this chronicle and begin a new game?")) onNewGame();
              }}
            >
              New Game
            </Btn>
          </div>
        </div>

        <div className="panel-ornate p-5">
          <h3 className="font-display text-lg">Your Dragon</h3>
          <DragonPortrait dragon={dragon} className="h-32" large />
          <p className="font-display text-xl">{dragon.name}</p>
          <p className="text-xs text-muted-foreground">
            {dragon.element} · {dragon.size} · Level {ds.level}
          </p>
          <div className="mt-3 space-y-2">
            <Meter label="Bond" value={ds.bond} color={dragon.wing} />
            <Meter label="Dragon XP" value={ds.xp} max={dragonXpForLevel(ds.level)} color={dragon.wing} />
          </div>
          <Btn variant="regal" className="mt-4 w-full" onClick={() => onTab("dragons")}>
            Dragon Hall
          </Btn>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h3 className="font-display text-lg text-accent">Current Undertaking</h3>
          {featured ? (
            <>
              <p className="mt-1 font-display text-xl">{featured.title}</p>
              <Chip tone="gold">{featured.category}</Chip>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{featured.story}</p>
              <p className="mt-3 text-sm text-accent">Objective: {featured.objective}</p>
              <Btn variant="hero" className="mt-4" onClick={() => onQuest(featured)}>
                Take Up This Quest
              </Btn>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No quest is open to you at this level and location. Travel the map, win battles and
              gain levels — the realm always finds more work for a dragonrider.
            </p>
          )}
        </div>
        <div className="panel p-5">
          <h3 className="font-display text-lg text-accent">Holdings</h3>
          {territories.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">You hold no territory. Yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {territories.map((t) => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <span>{t.name}</span>
                  <span className="text-accent">+{t.income}g</span>
                </li>
              ))}
            </ul>
          )}
          <div className="rule-gold my-4" />
          <h3 className="font-display text-lg text-accent">Latest Chronicle</h3>
          <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
            {state.chronicle.slice(0, 5).map((c) => (
              <li key={c.id}>
                <span className="text-accent">{c.kind}:</span> {c.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MapView({
  state,
  selected,
  onSelect,
  onTravel,
  onQuest,
}: {
  state: GameState;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onTravel: (id: string) => void;
  onQuest: (q: Quest) => void;
}) {
  const loc = selected ? locationById(selected) : null;
  const ls = selected ? locState(state, selected) : null;
  const quests = selected ? questsAt(state, selected) : [];

  const ownerLabel = (owner: string) =>
    owner === "neutral" ? "Unclaimed" : owner === "wild" ? "Wild lands" : houseById(owner as never).name;

  return (
    <div>
      <SectionHead title="The Known Realm" sub="Ten holdings, one throne. Click a location to survey it." />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="panel-ornate relative aspect-[4/3] overflow-hidden lg:col-span-3">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 40% 30%, oklch(0.3 0.03 70 / 0.7), transparent 70%), linear-gradient(160deg, oklch(0.22 0.02 60), oklch(0.15 0.012 40))",
            }}
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
            <path d="M0 70 C20 62 28 78 44 72 C60 66 72 82 100 74 L100 100 L0 100 Z" fill="oklch(0.2 0.03 220 / 0.6)" />
            <path d="M10 30 L20 18 L30 30 Z M28 26 L38 12 L48 26 Z M60 22 L70 8 L80 22 Z" fill="oklch(0.28 0.01 60 / 0.8)" />
            {LOCATIONS.map((a, i) =>
              LOCATIONS.slice(i + 1).map((b) =>
                Math.hypot(a.x - b.x, a.y - b.y) < 32 ? (
                  <line
                    key={a.id + b.id}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="oklch(0.7 0.08 80 / 0.18)"
                    strokeWidth="0.3"
                    strokeDasharray="1.5 1.5"
                  />
                ) : null,
              ),
            )}
          </svg>
          {LOCATIONS.map((l) => {
            const st = locState(state, l.id);
            const mine = st.owner === state.houseId;
            const here = state.currentLocation === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onSelect(l.id)}
                title={st.unlocked ? l.name : "Undiscovered"}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
              >
                <span
                  className={cn(
                    "block h-4 w-4 rotate-45 rounded-[3px] border transition-all duration-300 group-hover:scale-150 sm:h-5 sm:w-5",
                    here ? "animate-glow" : "",
                    !st.unlocked
                      ? "border-border bg-secondary/60"
                      : mine
                        ? "border-accent bg-primary"
                        : "border-accent/60 bg-secondary",
                  )}
                />
                <span
                  className={cn(
                    "absolute top-5 left-1/2 hidden -translate-x-1/2 text-[9px] whitespace-nowrap sm:block",
                    selected === l.id ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {st.unlocked ? l.name : "???"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="panel-ornate p-5 lg:col-span-2">
          {!loc || !ls ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
              <Ornament />
              <p className="mt-4 text-sm text-muted-foreground">
                Select a holding on the map to read its survey.
              </p>
            </div>
          ) : !ls.unlocked ? (
            <div>
              <h3 className="font-display text-xl">Uncharted</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This place is not yet on your maps. Reach level {loc.unlockLevel} or follow the
                right rumour, and it will reveal itself.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-xl">{loc.name}</h3>
                <Chip tone={ls.owner === state.houseId ? "good" : "default"}>{ownerLabel(ls.owner)}</Chip>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{loc.description}</p>
              <div className="mt-4 space-y-2">
                <Meter label="Danger" value={loc.danger} max={10} color="oklch(0.6 0.19 25)" />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {loc.resources.map((r) => (
                    <Chip key={r} tone="gold">
                      {r}
                    </Chip>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Income {loc.income} gold · Levies {loc.armyGain}
                </p>
              </div>
              <div className="rule-gold my-4" />
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                Available quests
              </p>
              {quests.length ? (
                <ul className="mt-2 space-y-2">
                  {quests.map((q) => (
                    <li key={q.id}>
                      <button
                        onClick={() => onQuest(q)}
                        className="w-full cursor-pointer rounded-md border border-border/70 px-3 py-2 text-left text-sm transition hover:border-accent/60 hover:text-accent"
                      >
                        {q.title}
                        <span className="ml-2 text-[10px] tracking-widest text-muted-foreground uppercase">
                          {q.category}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Nothing stirs here for now.</p>
              )}
              <Btn
                variant="hero"
                className="mt-5 w-full"
                disabled={state.currentLocation === loc.id}
                onClick={() => onTravel(loc.id)}
              >
                {state.currentLocation === loc.id ? "You are here" : `Travel to ${loc.name}`}
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DragonHall() {
  const { state, set, applyEffects, log } = useGame();
  const [sel, setSel] = useState(state.dragonId ?? DRAGONS[0]!.id);
  const dragon = dragonById(sel);
  const ds = dragonState(state, dragon.id);
  const unlocked = ds.unlocked;

  const feed = () => {
    if (state.food < 30) {
      toast.error("Not enough food", { description: "Your stores cannot spare 30 rations." });
      return;
    }
    set((s) => {
      const d = dragonState(s, dragon.id);
      return grantDragonXp(
        { ...s, food: s.food - 30, dragons: { ...s.dragons, [dragon.id]: { ...d, bond: Math.min(100, d.bond + 6), fed: d.fed + 1 } } },
        dragon.id,
        35,
      );
    });
    toast.success(`${dragon.name} feeds`, { description: "-30 food · +6 bond · +35 dragon XP" });
    log("Dragon", `${dragon.name} was fed at the pits.`);
  };

  const train = () => {
    if (state.gold < 80) {
      toast.error("Not enough gold", { description: "Trainers want 80 gold for a session." });
      return;
    }
    set((s) => {
      const d = dragonState(s, dragon.id);
      return grantDragonXp(
        { ...s, gold: s.gold - 80, dragons: { ...s.dragons, [dragon.id]: { ...d, bond: Math.min(100, d.bond + 3), trained: d.trained + 1 } } },
        dragon.id,
        80,
      );
    });
    toast.success(`${dragon.name} trains`, { description: "-80 gold · +3 bond · +80 dragon XP" });
    log("Dragon", `${dragon.name} completed a training flight.`);
  };

  return (
    <div>
      <SectionHead
        title="The Dragon Hall"
        sub="Ten wyrms are known to the Seven Kingdoms. Bond with those who answer you."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
          {DRAGONS.map((d) => {
            const st = dragonState(state, d.id);
            const active = state.dragonId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSel(d.id)}
                className={cn(
                  "panel cursor-pointer p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/60",
                  sel === d.id && "ring-1 ring-accent/60",
                  !st.unlocked && "opacity-60",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base">{st.unlocked ? d.name : "Unbonded Wyrm"}</h3>
                  {active ? <Chip tone="good">Ridden</Chip> : <Chip tone={st.unlocked ? "gold" : "default"}>{st.unlocked ? d.rarity : "Locked"}</Chip>}
                </div>
                <div className={cn(!st.unlocked && "opacity-30 grayscale")}>
                  <DragonPortrait dragon={d} className="h-24" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {st.unlocked ? `${d.element} · Lv ${st.level} · Bond ${st.bond}%` : "Unlocked through quests and trials"}
                </p>
              </button>
            );
          })}
        </div>

        <div className="panel-ornate h-fit p-5 lg:col-span-2 lg:sticky lg:top-40">
          <div className="flex items-start justify-between">
            <h3 className="font-display text-2xl">{unlocked ? dragon.name : "Unknown Wyrm"}</h3>
            <Chip tone="gold">{dragon.rarity}</Chip>
          </div>
          <div className={cn(!unlocked && "opacity-40 grayscale")}>
            <DragonPortrait dragon={dragon} className="h-36" large={unlocked} />
          </div>
          {unlocked ? (
            <>
              <p className="text-sm leading-relaxed text-muted-foreground">{dragon.lore}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    ["Age", dragon.age],
                    ["Size", dragon.size],
                    ["Element", dragon.element],
                    ["Ability", dragon.ability],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="panel px-3 py-2">
                    <p className="text-[9px] tracking-widest text-muted-foreground uppercase">{k}</p>
                    <p className="font-display text-xs">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Meter label="Health" value={dragon.health + (ds.level - 1) * 22} max={420} color={dragon.wing} />
                <Meter label="Attack" value={dragon.attack + (ds.level - 1) * 3} max={70} color={dragon.wing} />
                <Meter label="Defense" value={dragon.defense + (ds.level - 1) * 2} max={60} color={dragon.wing} />
                <Meter label="Speed" value={dragon.speed} max={50} color={dragon.wing} />
                <Meter label="Fury" value={dragon.fury} max={50} color={dragon.wing} />
                <Meter label="Bond" value={ds.bond} color={dragon.wing} />
                <Meter label={`Dragon Lv ${ds.level} · XP`} value={ds.xp} max={dragonXpForLevel(ds.level)} color={dragon.wing} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Btn variant="regal" onClick={feed}>
                  Feed (30 food)
                </Btn>
                <Btn variant="regal" onClick={train}>
                  Train (80 gold)
                </Btn>
                <Btn
                  variant="hero"
                  className="col-span-2"
                  disabled={state.dragonId === dragon.id}
                  onClick={() => {
                    set((s) => ({ ...s, dragonId: dragon.id }));
                    toast.success(`${dragon.name} takes the saddle`);
                    log("Dragon", `${dragon.name} is now your mount.`);
                  }}
                >
                  {state.dragonId === dragon.id ? "Currently Ridden" : "Ride This Dragon"}
                </Btn>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Fed {ds.fed} times · Trained {ds.trained} times
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              This wyrm has not yet answered you. Dragons are won through Dragon quests, the sky
              trial over the Ashen Mountains, and what sleeps beneath the Ancient Ruins.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CharacterView({ onTalk }: { onTalk: (c: Character) => void }) {
  const { state } = useGame();
  const [filter, setFilter] = useState<string>("all");
  const list = CHARACTERS.filter((c) => filter === "all" || c.house === filter);

  return (
    <div>
      <SectionHead title="Figures of the Realm" sub="Seventeen souls whose opinion of you is worth coin and blood." />
      <div className="mb-4 flex flex-wrap gap-2">
        <Btn variant={filter === "all" ? "regal" : "quiet"} onClick={() => setFilter("all")}>
          All
        </Btn>
        {["valeron", "draven", "aeloria", "kaelthorn", "veyr"].map((h) => (
          <Btn key={h} variant={filter === h ? "regal" : "quiet"} onClick={() => setFilter(h)}>
            {houseById(h as never).name.replace("House ", "")}
          </Btn>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const rel = state.relations[c.id] ?? 0;
          return (
            <div key={c.id} className="panel-ornate flex flex-col p-4">
              <div className="flex items-center gap-3">
                <Portrait c={c} />
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base">{c.name}</h3>
                  <p className="truncate text-[10px] tracking-widest uppercase" style={{ color: c.hue }}>
                    {houseById(c.house).name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                </div>
              </div>
              <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground">{c.bio}</p>
              <div className="mt-3 space-y-2">
                <Meter label="House Loyalty" value={c.loyalty} color={c.hue} />
                <Meter
                  label="Bond with you"
                  value={Math.max(0, rel + 50)}
                  max={150}
                  color={rel < 0 ? "oklch(0.6 0.2 25)" : "oklch(0.72 0.14 145)"}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Standing: {rel > 30 ? "Devoted" : rel > 10 ? "Friendly" : rel > -10 ? "Neutral" : rel > -30 ? "Cold" : "Hostile"} ({rel})
              </p>
              <Btn variant="regal" className="mt-3" onClick={() => onTalk(c)}>
                Speak With {c.name.split(" ")[0]}
              </Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Portrait({ c, size = 56 }: { c: Character; size?: number }) {
  const initials = c.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <svg viewBox="0 0 60 60" style={{ width: size, height: size }} className="shrink-0" role="img" aria-label={c.name}>
      <defs>
        <linearGradient id={`pg-${c.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.hue} stopOpacity="0.85" />
          <stop offset="100%" stopColor="oklch(0.18 0.02 40)" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill={`url(#pg-${c.id})`} stroke="oklch(0.78 0.13 82 / 0.5)" strokeWidth="1.5" />
      <path d="M30 20 a8 8 0 1 1 0 16 a8 8 0 1 1 0 -16 Z" fill="oklch(0.16 0.01 40 / 0.55)" />
      <path d="M13 52 C16 40 24 36 30 36 C36 36 44 40 47 52 Z" fill="oklch(0.16 0.01 40 / 0.55)" />
      <text
        x="30"
        y="34"
        textAnchor="middle"
        fontSize="15"
        fontFamily="Cinzel, serif"
        fill="oklch(0.92 0.06 85)"
      >
        {initials}
      </text>
    </svg>
  );
}

const DIALOGUE_OPTIONS = [
  {
    id: "honour",
    label: "Speak plainly and offer your honour",
    reply: "Then we understand each other. That is rarer than you think.",
    rel: 8,
    rep: 4,
  },
  {
    id: "coin",
    label: "Offer coin for their support (120 gold)",
    reply: "Coin is honest. It never pretends to be affection.",
    rel: 12,
    gold: -120,
  },
  {
    id: "threat",
    label: "Remind them what dragons do to holdfasts",
    reply: "You mistake fear for loyalty. Many have. Few enjoyed the correction.",
    rel: -14,
    rep: -5,
    infl: 8,
  },
  {
    id: "listen",
    label: "Say nothing and let them talk",
    reply: "…Well. Most people fill a silence. You didn't. I'll remember that.",
    rel: 5,
    infl: 3,
  },
] as const;

function DialogueModal({ character, onClose }: { character: Character; onClose: () => void }) {
  const { state, applyEffects, log, set } = useGame();
  const [reply, setReply] = useState<string | null>(null);
  const rel = state.relations[character.id] ?? 0;

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-4">
        <Portrait c={character} size={72} />
        <div>
          <h3 className="font-display text-2xl">{character.name}</h3>
          <p className="text-xs tracking-widest uppercase" style={{ color: character.hue }}>
            {character.role} · {houseById(character.house).name}
          </p>
        </div>
      </div>
      <p className="mt-5 border-l-2 border-accent/50 pl-4 text-base leading-relaxed text-foreground/90 italic">
        “{reply ?? character.dialogue}”
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Standing: {rel} · {character.bio}
      </p>
      <div className="mt-5 space-y-2">
        {DIALOGUE_OPTIONS.map((o) => (
          <button
            key={o.id}
            disabled={o.id === "coin" && state.gold < 120}
            onClick={() => {
              setReply(o.reply);
              applyEffects(
                {
                  relation: [{ id: character.id, delta: o.rel }],
                  reputation: "rep" in o ? o.rep : undefined,
                  gold: "gold" in o ? o.gold : undefined,
                  influence: "infl" in o ? o.infl : undefined,
                  xp: 10,
                },
                `${character.name} responds`,
              );
              set((s) => ({
                ...s,
                metCharacters: s.metCharacters.includes(character.id)
                  ? s.metCharacters
                  : [...s.metCharacters, character.id],
              }));
              log("Court", `You spoke with ${character.name}. Their standing shifted by ${o.rel}.`);
            }}
            className="w-full cursor-pointer rounded-md border border-border/70 px-4 py-3 text-left text-sm transition hover:border-accent/60 hover:bg-secondary/50 hover:text-accent disabled:opacity-40"
          >
            {o.label}
          </button>
        ))}
      </div>
      <Btn variant="ghost" className="mt-5 w-full" onClick={onClose}>
        Take your leave
      </Btn>
    </Modal>
  );
}

function QuestView({ state, onOpen }: { state: GameState; onOpen: (q: Quest) => void }) {
  const cats = ["All", "Main Story", "House", "Dragon", "Exploration", "Battle"] as const;
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const done = Object.keys(state.quests).length;

  const visible = QUESTS.filter((q) => (cat === "All" || q.category === cat) && (!q.house || q.house === state.houseId));

  return (
    <div>
      <SectionHead
        title="Council of Quests"
        sub={`${done} of ${QUESTS.filter((q) => !q.house || q.house === state.houseId).length} undertakings resolved.`}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Btn key={c} variant={cat === c ? "regal" : "quiet"} onClick={() => setCat(c)}>
            {c}
          </Btn>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {visible.map((q) => {
          const record = state.quests[q.id];
          const locked = !record && (q.level > state.level || !locState(state, q.location).unlocked);
          return (
            <div key={q.id} className={cn("panel-ornate flex flex-col p-5", record && "opacity-75")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg">{q.title}</h3>
                <Chip tone={record ? "good" : locked ? "default" : "gold"}>
                  {record ? "Completed" : locked ? `Level ${q.level}` : q.category}
                </Chip>
              </div>
              <p className="mt-1 text-[11px] tracking-widest text-muted-foreground uppercase">
                {q.category} · {locationById(q.location).name}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{q.story}</p>
              <p className="mt-3 text-sm text-accent">Objective: {q.objective}</p>
              {record ? (
                <p className="mt-3 text-xs text-muted-foreground italic">
                  Your decision: “{q.choices.find((c) => c.id === record.choice)?.label}”
                </p>
              ) : locked ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Requires level {q.level} and knowledge of {locationById(q.location).name}.
                </p>
              ) : (
                <Btn variant="hero" className="mt-4" onClick={() => onOpen(q)}>
                  Undertake
                </Btn>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestModal({
  quest,
  onClose,
  onChoose,
}: {
  quest: Quest;
  onClose: () => void;
  onChoose: (choiceId: string) => void;
}) {
  const character = quest.character ? charById(quest.character) : null;
  return (
    <Modal onClose={onClose}>
      <Chip tone="gold">{quest.category}</Chip>
      <h3 className="mt-3 font-display text-2xl">{quest.title}</h3>
      <p className="text-[11px] tracking-widest text-muted-foreground uppercase">
        {locationById(quest.location).name}
      </p>
      {character && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-border/60 p-3">
          <Portrait c={character} size={48} />
          <div>
            <p className="font-display text-sm">{character.name}</p>
            <p className="text-xs text-muted-foreground italic">“{character.dialogue}”</p>
          </div>
        </div>
      )}
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{quest.story}</p>
      <p className="mt-3 text-sm text-accent">Objective: {quest.objective}</p>
      <div className="rule-gold my-4" />
      <div className="space-y-2">
        {quest.choices.map((c) => (
          <button
            key={c.id}
            onClick={() => onChoose(c.id)}
            className="w-full cursor-pointer rounded-md border border-border/70 px-4 py-3 text-left transition hover:border-accent/60 hover:bg-secondary/50"
          >
            <p className="font-display text-sm text-foreground">{c.label}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {c.battle ? "This will lead to battle." : summarise(c.effects)}
            </p>
          </button>
        ))}
      </div>
      <Btn variant="ghost" className="mt-5 w-full" onClick={onClose}>
        Withdraw for now
      </Btn>
    </Modal>
  );
}

function summarise(e: Record<string, unknown>) {
  const map: Record<string, string> = {
    gold: "gold",
    army: "army",
    food: "food",
    reputation: "reputation",
    influence: "influence",
    xp: "XP",
    bond: "dragon bond",
  };
  const parts = Object.entries(map)
    .filter(([k]) => typeof e[k] === "number" && e[k] !== 0)
    .map(([k, label]) => `${(e[k] as number) > 0 ? "+" : ""}${e[k]} ${label}`);
  if (e["territory"]) parts.push("claims a territory");
  if (e["unlockDragon"]) parts.push("may unlock a dragon");
  if (e["item"]) parts.push("yields an item");
  if (e["relation"]) parts.push("shifts relationships");
  return parts.join(" · ") || "Consequences unknown.";
}

function BattleView({
  state,
  pending,
  onStart,
  onResolve,
  onFlee,
}: {
  state: GameState;
  pending: { enemyId: string } | null;
  onStart: (id: string) => void;
  onResolve: (won: boolean, e: Enemy) => void;
  onFlee: () => void;
}) {
  const available = ENEMIES.filter((_, i) => i < 3 + state.level);
  return (
    <div>
      <SectionHead
        title="The Field of Battle"
        sub={`Won ${state.battlesWon} · Lost ${state.battlesLost}. Choose a foe, then choose how to break them.`}
      />
      {pending ? (
        <Battle enemyId={pending.enemyId} onResolve={onResolve} onFlee={onFlee} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENEMIES.map((e) => {
            const unlocked = available.includes(e);
            return (
              <div key={e.id} className={cn("panel-ornate p-5", !unlocked && "opacity-55")}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg">{e.name}</h3>
                  <Chip tone={unlocked ? "danger" : "default"}>{unlocked ? "Available" : "Too Distant"}</Chip>
                </div>
                <p className="text-[11px] tracking-widest text-muted-foreground uppercase">{e.title}</p>
                <div className="mt-3 space-y-1.5">
                  <Meter label="Health" value={e.health} max={620} color={e.hue} />
                  <Meter label="Attack" value={e.attack} max={70} color={e.hue} />
                  <Meter label="Defense" value={e.defense} max={50} color={e.hue} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Spoils: {e.reward.gold} gold · {e.reward.xp} XP · +{e.reward.reputation} rep
                  {e.reward.territory ? ` · ${locationById(e.reward.territory).name}` : ""}
                  {e.reward.item ? ` · ${itemById(e.reward.item).name}` : ""}
                </p>
                <Btn variant="hero" className="mt-4 w-full" disabled={!unlocked} onClick={() => onStart(e.id)}>
                  {unlocked ? "Give Battle" : `Requires level ${e.id === "pretender" ? 9 : 4}`}
                </Btn>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HouseView({
  state,
  onTalk,
  onQuest,
}: {
  state: GameState;
  onTalk: (c: Character) => void;
  onQuest: (q: Quest) => void;
}) {
  const house = houseById(state.houseId!);
  const members = CHARACTERS.filter((c) => c.house === house.id);
  const houseQuests = QUESTS.filter((q) => q.house === house.id);
  const owned = ownedTerritories(state);
  const enemyLands = LOCATIONS.filter(
    (l) => locState(state, l.id).owner !== state.houseId && locState(state, l.id).owner !== "neutral",
  );
  const neutral = LOCATIONS.filter((l) => locState(state, l.id).owner === "neutral");

  return (
    <div>
      <SectionHead title={house.name} sub={`${house.title} — “${house.words}”`} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel-ornate p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start gap-4">
            <HouseSigil house={house} className="h-24 w-24" />
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-muted-foreground">{house.history}</p>
              <p className="mt-3 text-sm">
                <span className="text-accent">Advantage:</span> {house.bonus}
              </p>
              <p className="mt-1 text-sm">
                <span className="text-accent">Specialty:</span> {house.specialty}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Meter label="Strength" value={house.stats.strength} color={house.hue} />
            <Meter label="Wealth" value={house.stats.wealth} color={house.hue} />
            <Meter label="Influence" value={house.stats.influence} color={house.hue} />
            <Meter label="Military" value={house.stats.military} color={house.hue} />
          </div>
        </div>
        <div className="panel-ornate p-5">
          <h3 className="font-display text-lg text-accent">Territories</h3>
          <p className="mt-2 text-[10px] tracking-widest text-muted-foreground uppercase">Yours</p>
          <ul className="text-sm">
            {owned.length ? owned.map((t) => <li key={t.id}>· {t.name}</li>) : <li className="text-muted-foreground">None</li>}
          </ul>
          <p className="mt-3 text-[10px] tracking-widest text-muted-foreground uppercase">Rival held</p>
          <ul className="text-sm text-muted-foreground">
            {enemyLands.map((t) => (
              <li key={t.id}>· {t.name}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] tracking-widest text-muted-foreground uppercase">Neutral</p>
          <ul className="text-sm text-muted-foreground">
            {neutral.map((t) => (
              <li key={t.id}>· {t.name}</li>
            ))}
          </ul>
          <div className="rule-gold my-4" />
          <p className="text-xs text-muted-foreground">
            Total income {owned.reduce((n, t) => n + t.income, 0)} gold per tribute.
          </p>
        </div>
      </div>

      <h3 className="mt-8 font-display text-xl text-accent">Sworn Figures</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((c) => (
          <div key={c.id} className="panel flex items-center gap-3 p-4">
            <Portrait c={c} size={48} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.role}</p>
            </div>
            <Btn variant="quiet" onClick={() => onTalk(c)}>
              Speak
            </Btn>
          </div>
        ))}
      </div>

      <h3 className="mt-8 font-display text-xl text-accent">House Quest Line</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {houseQuests.map((q) => {
          const record = state.quests[q.id];
          return (
            <div key={q.id} className="panel p-4">
              <div className="flex items-center justify-between">
                <p className="font-display">{q.title}</p>
                <Chip tone={record ? "good" : "gold"}>{record ? "Completed" : "Open"}</Chip>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{q.objective}</p>
              {!record && q.level <= state.level && (
                <Btn variant="regal" className="mt-3" onClick={() => onQuest(q)}>
                  Undertake
                </Btn>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InventoryView() {
  const { state, set, applyEffects, log } = useGame();
  const held = ITEMS.filter((i) => (state.inventory[i.id] ?? 0) > 0);
  const consumable = (id: string) => {
    const it = itemById(id);
    return !!it.effect && (it.effect.gold || it.effect.food || it.effect.bond);
  };

  return (
    <div>
      <SectionHead
        title="The Armoury"
        sub="Weapons and armour strengthen your dragon in every battle. Provisions and treasures can be used at will."
      />
      {held.length === 0 ? (
        <div className="panel-ornate p-8 text-center">
          <Ornament />
          <p className="mt-4 text-sm text-muted-foreground">
            Your stores are empty. Win battles and resolve quests to gather weapons, armour,
            dragon relics and treasure.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {held.map((i) => (
            <div key={i.id} className="panel-ornate flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base">{i.name}</h3>
                <Chip tone="gold">×{state.inventory[i.id]}</Chip>
              </div>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{i.type}</p>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{i.description}</p>
              {consumable(i.id) ? (
                <Btn
                  variant="regal"
                  className="mt-3"
                  onClick={() => {
                    set((s) => ({
                      ...s,
                      inventory: { ...s.inventory, [i.id]: (s.inventory[i.id] ?? 1) - 1 },
                    }));
                    applyEffects(
                      { gold: i.effect?.gold, food: i.effect?.food, bond: i.effect?.bond },
                      `${i.name} used`,
                    );
                    log("Inventory", `${i.name} was used.`);
                  }}
                >
                  Use
                </Btn>
              ) : (
                <p className="mt-3 text-xs text-accent">
                  {i.effect ? "Equipped — bonus applies in battle." : "Carried for a purpose not yet clear."}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChronicleView({ state }: { state: GameState }) {
  const earned = new Set(state.achievements);
  return (
    <div>
      <SectionHead title="The Chronicle" sub="Everything of consequence, written down." />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel-ornate max-h-[70vh] overflow-y-auto p-5 lg:col-span-2">
          {state.chronicle.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing has yet been written.</p>
          ) : (
            <ol className="space-y-3">
              {state.chronicle.map((c) => (
                <li key={c.id} className="border-l-2 border-accent/40 pl-4">
                  <p className="text-[10px] tracking-widest text-accent uppercase">{c.kind}</p>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="panel-ornate h-fit p-5">
          <h3 className="font-display text-lg text-accent">Achievements</h3>
          <p className="text-xs text-muted-foreground">
            {earned.size} of {ACHIEVEMENTS.length} earned
          </p>
          <ul className="mt-3 space-y-2">
            {ACHIEVEMENTS.map((a) => (
              <li
                key={a.id}
                className={cn(
                  "rounded-md border p-3",
                  earned.has(a.id) ? "border-accent/50 bg-accent/5" : "border-border/60 opacity-60",
                )}
              >
                <p className="font-display text-sm">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </li>
            ))}
          </ul>
          <div className="rule-gold my-4" />
          <h3 className="font-display text-lg text-accent">Tally</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Quests resolved: {Object.keys(state.quests).length}</li>
            <li>Battles won: {state.battlesWon}</li>
            <li>Battles lost: {state.battlesLost}</li>
            <li>Dragons bonded: {Object.values(state.dragons).filter((d) => d.unlocked).length}</li>
            <li>Territories held: {ownedTerritories(state).length}</li>
            <li>Figures met: {state.metCharacters.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="panel-ornate max-h-[88vh] w-full max-w-2xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
