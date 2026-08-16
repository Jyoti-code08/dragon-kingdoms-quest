import { useEffect, useMemo, useRef, useState } from "react";
import { Btn } from "./Btn";
import { Chip, DragonPortrait, Embers, Meter } from "./atoms";
import { dragonById, enemyById, houseById, itemById, type Enemy } from "@/game/data";
import { dragonState, useGame } from "@/game/state";

interface Props {
  enemyId: string;
  onResolve: (won: boolean, enemy: Enemy) => void;
  onFlee: () => void;
}

type Entry = { id: number; text: string; tone: "player" | "enemy" | "system" };

export function Battle({ enemyId, onResolve, onFlee }: Props) {
  const { state } = useGame();
  const enemy = enemyById(enemyId);
  const dragon = dragonById(state.dragonId ?? "vharos");
  const ds = dragonState(state, dragon.id);
  const house = state.houseId ? houseById(state.houseId) : null;

  const gear = useMemo(() => {
    let atk = 0;
    let def = 0;
    let hp = 0;
    Object.entries(state.inventory).forEach(([id, n]) => {
      if (!n) return;
      const eff = itemById(id)?.effect;
      if (!eff) return;
      atk += eff.attack ?? 0;
      def += eff.defense ?? 0;
      hp += eff.hp ?? 0;
    });
    return { atk, def, hp };
  }, [state.inventory]);

  const me = useMemo(() => {
    const lvl = ds.level - 1;
    return {
      maxHp: dragon.health + lvl * 22 + Math.round(ds.bond * 0.6) + gear.hp,
      attack: dragon.attack + lvl * 3 + Math.round(ds.bond * 0.12) + gear.atk + (house?.id === "valeron" ? 4 : 0),
      defense: dragon.defense + lvl * 2 + gear.def,
      speed: dragon.speed + lvl,
    };
  }, [dragon, ds, gear, house]);

  const [hp, setHp] = useState(me.maxHp);
  const [ehp, setEhp] = useState(enemy.health);
  const [fury, setFury] = useState(house?.id === "kaelthorn" ? 30 : 15);
  const [guard, setGuard] = useState(false);
  const [turn, setTurn] = useState<"player" | "enemy">("player");
  const [round, setRound] = useState(1);
  const [over, setOver] = useState<null | "win" | "lose">(null);
  const [log, setLog] = useState<Entry[]>([
    { id: 1, text: `${enemy.name} takes the field. ${dragon.name} answers.`, tone: "system" },
  ]);
  const [shake, setShake] = useState<"me" | "enemy" | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const firstStrike = useRef(true);

  const push = (text: string, tone: Entry["tone"]) =>
    setLog((l) => [...l, { id: Date.now() + Math.random(), text, tone }]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  const roll = (min: number, max: number) => min + Math.random() * (max - min);

  const damage = (atk: number, def: number, mult: number) =>
    Math.max(4, Math.round((atk * mult - def * 0.45) * roll(0.85, 1.18)));

  const enemyTurn = () => {
    setTimeout(() => {
      const useHeavy = Math.random() < 0.28;
      let dmg = damage(enemy.attack, me.defense, useHeavy ? 1.55 : 1);
      if (guard) dmg = Math.round(dmg * 0.42);
      setShake("me");
      setTimeout(() => setShake(null), 320);
      const nextHp = Math.max(0, hpRef.current - dmg);
      hpRef.current = nextHp;
      setHp(nextHp);
      push(
        `${enemy.name} ${useHeavy ? "unleashes a savage assault" : "strikes"} for ${dmg} damage${guard ? " (blunted by your guard)" : ""}.`,
        "enemy",
      );
      setGuard(false);
      if (nextHp <= 0) {
        setOver("lose");
        push(`${dragon.name} falls. The field is lost.`, "system");
        return;
      }
      setFury((f) => Math.min(100, f + 12));
      setRound((r) => r + 1);
      setTurn("player");
    }, 750);
  };

  const hpRef = useRef(hp);
  hpRef.current = hp;
  const ehpRef = useRef(ehp);
  ehpRef.current = ehp;

  const hitEnemy = (dmg: number, text: string) => {
    setShake("enemy");
    setTimeout(() => setShake(null), 320);
    const next = Math.max(0, ehpRef.current - dmg);
    ehpRef.current = next;
    setEhp(next);
    push(text, "player");
    if (next <= 0) {
      setOver("win");
      push(`${enemy.name} is broken. The day is yours.`, "system");
      return true;
    }
    return false;
  };

  const act = (kind: "attack" | "defend" | "special" | "fury") => {
    if (turn !== "player" || over) return;
    setTurn("enemy");
    let bonus = 1;
    if (firstStrike.current && house?.id === "veyr") {
      bonus = 1.35;
      firstStrike.current = false;
    }

    if (kind === "attack") {
      const dmg = damage(me.attack, enemy.defense, 1 * bonus);
      if (hitEnemy(dmg, `${dragon.name} rakes ${enemy.name} for ${dmg} damage.`)) return;
      setFury((f) => Math.min(100, f + 18));
    } else if (kind === "defend") {
      setGuard(true);
      const heal = Math.round(me.maxHp * 0.07);
      const nh = Math.min(me.maxHp, hpRef.current + heal);
      hpRef.current = nh;
      setHp(nh);
      push(`${dragon.name} folds its wings into a guard and recovers ${heal} health.`, "player");
      setFury((f) => Math.min(100, f + 24));
    } else if (kind === "special") {
      const cost = house?.id === "kaelthorn" ? 25 : 35;
      if (fury < cost) return;
      setFury((f) => f - cost);
      const dmg = damage(me.attack, enemy.defense, 1.7 * bonus);
      if (hitEnemy(dmg, `${dragon.name} looses ${dragon.ability} — ${dmg} damage!`)) return;
    } else {
      if (fury < 100) return;
      setFury(0);
      const dmg = damage(me.attack, enemy.defense, 2.9 * bonus);
      if (hitEnemy(dmg, `DRAGON FURY — ${dragon.name} engulfs the field for ${dmg} damage!`)) return;
    }
    enemyTurn();
  };

  const specialCost = house?.id === "kaelthorn" ? 25 : 35;

  return (
    <div className="relative overflow-hidden panel-ornate p-4 sm:p-6">
      <Embers count={14} />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl text-gilded sm:text-2xl">Field of Battle</h3>
            <p className="text-xs text-muted-foreground">
              Round {round} · {over ? "Battle concluded" : turn === "player" ? "Your move" : `${enemy.name} moves`}
            </p>
          </div>
          <Chip tone="gold">{enemy.title}</Chip>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div
            className="panel p-4 transition-transform"
            style={{ transform: shake === "me" ? "translateX(-6px)" : undefined }}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base">{dragon.name}</h4>
              <Chip>Lv {ds.level}</Chip>
            </div>
            <DragonPortrait dragon={dragon} className="h-28" />
            <Meter label="Health" value={hp} max={me.maxHp} color="oklch(0.6 0.19 25)" />
            <div className="mt-2">
              <Meter label="Fury" value={fury} color="var(--gold)" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] tracking-widest text-muted-foreground uppercase">
              <div className="panel py-1">
                ATK<div className="font-display text-sm text-foreground">{me.attack}</div>
              </div>
              <div className="panel py-1">
                DEF<div className="font-display text-sm text-foreground">{me.defense}</div>
              </div>
              <div className="panel py-1">
                SPD<div className="font-display text-sm text-foreground">{me.speed}</div>
              </div>
            </div>
          </div>

          <div
            className="panel p-4 transition-transform"
            style={{ transform: shake === "enemy" ? "translateX(6px)" : undefined }}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base">{enemy.name}</h4>
              <Chip tone="danger">Foe</Chip>
            </div>
            <div className="my-2 flex h-28 items-center justify-center">
              <svg viewBox="0 0 120 100" className="h-28" role="img" aria-label={enemy.name}>
                <defs>
                  <radialGradient id={`eg-${enemy.id}`}>
                    <stop offset="0%" stopColor={enemy.hue} stopOpacity="0.65" />
                    <stop offset="100%" stopColor={enemy.hue} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="60" cy="55" rx="56" ry="42" fill={`url(#eg-${enemy.id})`} />
                <path
                  d="M60 12 L74 26 L70 44 L84 58 L78 84 H42 L36 58 L50 44 L46 26 Z"
                  fill={enemy.hue}
                  stroke="oklch(0.85 0.1 85 / 0.5)"
                  strokeWidth="1.5"
                />
                <circle cx="53" cy="34" r="2.6" fill="oklch(0.9 0.16 60)" />
                <circle cx="67" cy="34" r="2.6" fill="oklch(0.9 0.16 60)" />
                <path d="M40 12 L50 24 M80 12 L70 24" stroke={enemy.hue} strokeWidth="4" />
              </svg>
            </div>
            <Meter label="Health" value={ehp} max={enemy.health} color="oklch(0.55 0.2 20)" />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] tracking-widest text-muted-foreground uppercase">
              <div className="panel py-1">
                ATK<div className="font-display text-sm text-foreground">{enemy.attack}</div>
              </div>
              <div className="panel py-1">
                DEF<div className="font-display text-sm text-foreground">{enemy.defense}</div>
              </div>
              <div className="panel py-1">
                SPD<div className="font-display text-sm text-foreground">{enemy.speed}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={logRef}
          className="panel mt-4 h-36 space-y-1.5 overflow-y-auto p-3 text-sm"
          aria-live="polite"
        >
          {log.map((l) => (
            <p
              key={l.id}
              className={
                l.tone === "player"
                  ? "text-accent"
                  : l.tone === "enemy"
                    ? "text-destructive-foreground/90"
                    : "text-muted-foreground italic"
              }
            >
              {l.text}
            </p>
          ))}
        </div>

        {!over ? (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Btn variant="hero" disabled={turn !== "player"} onClick={() => act("attack")}>
              Attack
            </Btn>
            <Btn variant="regal" disabled={turn !== "player"} onClick={() => act("defend")}>
              Defend
            </Btn>
            <Btn
              variant="regal"
              disabled={turn !== "player" || fury < specialCost}
              onClick={() => act("special")}
              title={`${dragon.ability} — ${specialCost} fury`}
            >
              {dragon.ability}
            </Btn>
            <Btn variant="danger" disabled={turn !== "player" || fury < 100} onClick={() => act("fury")}>
              Dragon Fury
            </Btn>
            <Btn variant="ghost" className="col-span-2 sm:col-span-4" onClick={onFlee}>
              Withdraw from the field
            </Btn>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-3">
            <p className="font-display text-lg text-gilded">
              {over === "win" ? "Victory" : "Defeat"}
            </p>
            <p className="max-w-md text-center text-sm text-muted-foreground">
              {over === "win"
                ? `${enemy.name} lies broken. Spoils: ${enemy.reward.gold} gold, ${enemy.reward.xp} XP, +${enemy.reward.reputation} reputation${enemy.reward.territory ? `, and control of a territory` : ""}.`
                : `${dragon.name} is dragged from the field. Your host is thinned and your name a little quieter.`}
            </p>
            <Btn variant="hero" onClick={() => onResolve(over === "win", enemy)}>
              {over === "win" ? "Claim the spoils" : "Retreat and regroup"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
