import { useState } from "react";
import { toast } from "sonner";
import { Btn } from "./Btn";
import { Chip, DragonPortrait, Embers, HouseSigil, Meter, Ornament, Smoke } from "./atoms";
import { DRAGONS, HOUSES, dragonById, houseById, locationById, type HouseId } from "@/game/data";
import { foundNewGame, useGame } from "@/game/state";

function Backdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, oklch(0.34 0.14 32 / 0.55), transparent 65%), radial-gradient(60% 50% at 80% 90%, oklch(0.25 0.08 60 / 0.5), transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 800 400"
        className="animate-drift absolute bottom-0 left-1/2 w-[130%] -translate-x-1/2 opacity-25"
        preserveAspectRatio="none"
      >
        <path d="M0 400 L0 300 L60 260 L90 300 L140 210 L200 300 L260 190 L320 300 L380 240 L440 300 L500 170 L560 300 L620 250 L700 300 L760 270 L800 320 L800 400 Z" fill="oklch(0.14 0.01 40)" />
      </svg>
      <svg
        viewBox="0 0 600 400"
        className="animate-drift absolute top-6 left-1/2 w-[95%] max-w-3xl -translate-x-1/2 opacity-[0.18]"
      >
        <path
          d="M300 120 C260 60 180 40 120 70 C170 90 190 120 205 160 C150 150 110 175 70 210 C130 205 175 215 215 240 C185 275 175 315 180 355 C215 315 255 290 300 285 C345 290 385 315 420 355 C425 315 415 275 385 240 C425 215 470 205 530 210 C490 175 450 150 395 160 C410 120 430 90 480 70 C420 40 340 60 300 120 Z"
          fill="oklch(0.9 0.05 40)"
        />
      </svg>
      <Smoke />
      <Embers count={34} />
    </div>
  );
}

export function TitleScreen() {
  const { goto, hasSave, continueGame, newGame } = useGame();
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
      <Backdrop />
      <div className="relative max-w-3xl">
        <Chip tone="gold">A Realm of Fire and Oath</Chip>
        <h1 className="text-gilded mt-6 text-5xl leading-none font-bold sm:text-7xl md:text-8xl">
          SEVEN KINGDOMS
        </h1>
        <p className="mt-3 font-display text-lg tracking-[0.4em] text-accent/90 sm:text-2xl">
          RISE OF THE DRAGON
        </p>
        <Ornament className="mt-6" />
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Five Great Houses circle a throne of black glass. Ten dragons sleep in the volcanic
          valleys. Choose your banner, bind a wyrm, and decide by steel or by signature who rules
          the Seven Kingdoms.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Btn variant="hero" className="w-full sm:w-auto" onClick={() => goto("house")}>
            Begin Your Reign
          </Btn>
          <Btn variant="regal" className="w-full sm:w-auto" onClick={() => goto("howto")}>
            How To Play
          </Btn>
          {hasSave && (
            <Btn variant="ghost" className="w-full sm:w-auto" onClick={continueGame}>
              Continue
            </Btn>
          )}
        </div>
        {hasSave && (
          <button
            onClick={newGame}
            className="mt-6 text-[11px] tracking-[0.25em] text-muted-foreground uppercase underline-offset-4 transition hover:text-accent hover:underline"
          >
            Abandon chronicle · New Game
          </button>
        )}
      </div>
    </main>
  );
}

const RULES: { title: string; body: string }[] = [
  {
    title: "Houses",
    body: "Five Great Houses, each with its own ruler, seat, starting wealth, army and hidden advantage. Valeron bond dragons faster; Draven raise more spears; Aeloria gain more influence and loyalty; Kaelthorn spend less fury on abilities; Veyr strike harder first and profit from theft. Your House also unlocks its own quest line and characters.",
  },
  {
    title: "Dragons",
    body: "Ten dragons exist in the world; you begin with two and unlock the rest through quests and trials. Feed and train them in the Dragon Hall to raise bond and level. Bond and level raise health, attack and defense in battle. Ignivar, the Worldflame, sleeps beneath the Ancient Ruins.",
  },
  {
    title: "Resources",
    body: "Gold pays for negotiation and bribes. Army decides how much you can risk. Food feeds dragons and camps. Reputation is what the realm says about you; Influence is what the realm owes you. Territories you hold generate income and levies each time you collect tribute in the Realm view.",
  },
  {
    title: "Quests",
    body: "Over twenty quests across Main Story, House, Dragon, Exploration and Battle lines. Every quest offers real choices with different outcomes — protect a village or strip its stores, forgive a debt or call it in. Choices move gold, army, reputation, influence, dragon bond, territory and your standing with individual characters.",
  },
  {
    title: "Battles",
    body: "Turn-based duels between your dragon and an enemy host. Attack to deal damage and build fury, Defend to blunt the next blow and recover health, spend fury on your dragon's signature ability, or save 100 fury for Dragon Fury. Damage depends on your stats, your gear and a little luck. Winning yields gold, XP, reputation, items and sometimes a territory. Losing costs coin, soldiers and standing.",
  },
  {
    title: "Territories",
    body: "Ten locations on the map, some locked until you gain levels or complete quests. Each has a controlling house, a danger rating and resources. Travel to a location to unlock its quests. Win the right battles and its banner becomes yours.",
  },
  {
    title: "Choices & Consequences",
    body: "Characters remember. Relationships rise and fall with your decisions and change the tone of what they say to you. Everything of consequence is written into the Chronicle, and your progress is stored in your browser — use Save Game, or Continue from the title screen.",
  },
];

export function HowToPlay() {
  const { goto } = useGame();
  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-14">
      <Backdrop />
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-gilded text-center text-4xl sm:text-5xl">How To Play</h1>
        <Ornament className="mt-5" />
        <div className="mt-8 space-y-4">
          {RULES.map((r) => (
            <section key={r.title} className="panel-ornate p-5">
              <h2 className="font-display text-lg text-accent">{r.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Btn variant="hero" onClick={() => goto("house")}>
            Begin Your Reign
          </Btn>
          <Btn variant="ghost" onClick={() => goto("title")}>
            Back to the Gate
          </Btn>
        </div>
      </div>
    </main>
  );
}

export function HouseSelect() {
  const { goto, set } = useGame();
  const [openId, setOpenId] = useState<HouseId | null>(null);
  const open = openId ? houseById(openId) : null;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6">
      <Backdrop />
      <div className="relative mx-auto max-w-6xl">
        <h1 className="text-gilded text-center text-4xl sm:text-5xl">Choose Your House</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Five banners. One throne. Your choice shapes your armies, your dragons and every story
          that follows.
        </p>
        <Ornament className="mt-5" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOUSES.map((h) => (
            <button
              key={h.id}
              onClick={() => setOpenId(h.id)}
              className="panel-ornate group cursor-pointer p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/70"
              style={{ boxShadow: openId === h.id ? `0 0 0 1px ${h.accent}` : undefined }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="rounded-md p-1 transition-transform duration-500 group-hover:scale-110"
                  style={{ background: `radial-gradient(circle, ${h.hue}33, transparent 70%)` }}
                >
                  <HouseSigil house={h} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-lg leading-tight">{h.name}</h2>
                  <p className="text-xs tracking-widest uppercase" style={{ color: h.accent }}>
                    {h.title}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground italic">“{h.words}”</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Meter label="Strength" value={h.stats.strength} color={h.hue} />
                <Meter label="Wealth" value={h.stats.wealth} color={h.hue} />
                <Meter label="Influence" value={h.stats.influence} color={h.hue} />
                <Meter label="Military" value={h.stats.military} color={h.hue} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                <span className="text-accent">Ruler:</span> {h.ruler}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="text-accent">Seat:</span> {h.seat}
              </p>
              <span className="mt-4 inline-block text-[10px] tracking-[0.25em] text-accent uppercase">
                View House →
              </span>
            </button>
          ))}
          <div className="panel flex flex-col justify-center p-6 text-center">
            <h3 className="font-display text-base text-accent">Undecided?</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Valeron for dragons, Draven for war, Aeloria for diplomacy, Kaelthorn for the sea,
              Veyr for knives in the dark.
            </p>
            <Btn variant="ghost" className="mt-4" onClick={() => goto("title")}>
              Back to the Gate
            </Btn>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-3 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="panel-ornate max-h-[88vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="flex items-start gap-4">
              <HouseSigil house={open} className="h-20 w-20 shrink-0" />
              <div>
                <h2 className="font-display text-2xl">{open.name}</h2>
                <p className="text-xs tracking-widest uppercase" style={{ color: open.accent }}>
                  {open.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground italic">“{open.words}”</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{open.history}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="panel p-3 text-sm">
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Ruler</p>
                <p className="font-display">{open.ruler}</p>
              </div>
              <div className="panel p-3 text-sm">
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Territory</p>
                <p className="font-display">{open.seat}</p>
              </div>
              <div className="panel p-3 text-sm">
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Specialty</p>
                <p className="font-display">{open.specialty}</p>
              </div>
              <div className="panel p-3 text-sm">
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">House Advantage</p>
                <p className="text-xs text-accent">{open.bonus}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  ["Gold", open.start.gold],
                  ["Army", open.start.army],
                  ["Food", open.start.food],
                  ["Influence", open.start.influence],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="panel px-3 py-2 text-center">
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{k}</p>
                  <p className="font-display text-lg text-accent">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                Dragons sworn to this House
              </p>
              <div className="mt-2 flex gap-3">
                {open.startDragons.map((id) => (
                  <div key={id} className="panel flex-1 p-2 text-center">
                    <DragonPortrait dragon={dragonById(id)} className="h-16" />
                    <p className="font-display text-xs">{dragonById(id).name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Btn
                variant="hero"
                className="flex-1"
                onClick={() => {
                  set((s) => ({ ...s, houseId: open.id, screen: "profile" }));
                  toast.success(`${open.name} rises`, { description: open.words });
                }}
              >
                Choose This House
              </Btn>
              <Btn variant="ghost" onClick={() => setOpenId(null)}>
                Close
              </Btn>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export function ProfileSetup() {
  const { state, set, goto } = useGame();
  const house = state.houseId ? houseById(state.houseId) : HOUSES[0]!;
  const [name, setName] = useState("");

  const submit = () => {
    const finalName = name.trim() || "The Nameless Heir";
    set(() => foundNewGame(finalName, house.id));
    toast.success(`Rise, ${finalName}`, { description: `${house.name} awaits your command.` });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <Backdrop />
      <div className="panel-ornate relative w-full max-w-lg p-7">
        <div className="flex items-center gap-4">
          <HouseSigil house={house} />
          <div>
            <h1 className="font-display text-2xl">Name Your Heir</h1>
            <p className="text-xs tracking-widest uppercase" style={{ color: house.accent }}>
              {house.name} · {house.title}
            </p>
          </div>
        </div>
        <label className="mt-6 block text-[10px] tracking-widest text-muted-foreground uppercase">
          Your name
        </label>
        <input
          value={name}
          maxLength={28}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. Aeryn of the Ember Coast"
          className="mt-2 w-full rounded-md border border-input bg-background/70 px-4 py-3 font-display text-base text-foreground outline-none transition focus:border-accent/70 focus:ring-2 focus:ring-ring/40"
        />
        <div className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
          {(
            [
              ["Ruler", house.ruler],
              ["Seat", house.seat],
              ["Gold", house.start.gold],
              ["Army", house.start.army],
              ["Food", house.start.food],
              ["Reputation", house.start.reputation],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="panel px-3 py-2">
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{k}</p>
              <p className="font-display text-xs text-foreground">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Btn variant="hero" className="flex-1" onClick={submit}>
            Take Up The Banner
          </Btn>
          <Btn variant="ghost" onClick={() => goto("house")}>
            Change House
          </Btn>
        </div>
      </div>
    </main>
  );
}

export function DragonPick() {
  const { state, set } = useGame();
  const house = state.houseId ? houseById(state.houseId) : HOUSES[0]!;
  const available = DRAGONS.filter((d) => state.dragons[d.id]?.unlocked);
  const [picked, setPicked] = useState<string | null>(available[0]?.id ?? null);
  const dragon = picked ? dragonById(picked) : null;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6">
      <Backdrop />
      <div className="relative mx-auto max-w-4xl">
        <h1 className="text-gilded text-center text-4xl sm:text-5xl">Bind Your Dragon</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {house.name} keeps two wyrms in its pits. Choose the one that will carry you into the war.
        </p>
        <Ornament className="mt-5" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {available.map((d) => (
            <button
              key={d.id}
              onClick={() => setPicked(d.id)}
              className="panel-ornate cursor-pointer p-5 text-left transition-all hover:-translate-y-1"
              style={{ borderColor: picked === d.id ? d.wing : undefined }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg">{d.name}</h2>
                <Chip tone="gold">{d.rarity}</Chip>
              </div>
              <DragonPortrait dragon={d} className="h-32" large={picked === d.id} />
              <p className="text-xs text-muted-foreground">
                {d.element} · {d.size} · {d.age}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d.lore}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Meter label="Attack" value={d.attack} max={60} color={d.wing} />
                <Meter label="Defense" value={d.defense} max={50} color={d.wing} />
                <Meter label="Speed" value={d.speed} max={50} color={d.wing} />
                <Meter label="Health" value={d.health} max={340} color={d.wing} />
              </div>
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Btn
            variant="hero"
            disabled={!dragon}
            onClick={() => {
              if (!dragon) return;
              set((s) => ({
                ...s,
                dragonId: dragon.id,
                screen: "realm",
                chronicle: [
                  {
                    id: Date.now(),
                    kind: "Bond",
                    text: `${dragon.name} accepts ${s.playerName} as rider at ${locationById(s.currentLocation).name}.`,
                  },
                  ...s.chronicle,
                ],
              }));
              toast.success(`${dragon.name} is yours`, { description: "Enter the realm." });
            }}
          >
            Bond & Enter The Realm
          </Btn>
        </div>
      </div>
    </main>
  );
}
