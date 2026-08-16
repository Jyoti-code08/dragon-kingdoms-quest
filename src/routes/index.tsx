import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DragonPick, HouseSelect, HowToPlay, ProfileSetup, TitleScreen } from "@/components/game/Onboarding";
import { Realm } from "@/components/game/Realm";
import { GameProvider, useGame } from "@/game/state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seven Kingdoms: Rise of the Dragon — Fantasy Strategy Game" },
      {
        name: "description",
        content:
          "Choose one of five Great Houses, bond a dragon, conquer territories and decide who rules the Seven Kingdoms in this free browser fantasy strategy adventure.",
      },
      { property: "og:title", content: "Seven Kingdoms: Rise of the Dragon" },
      {
        property: "og:description",
        content:
          "Five Houses, ten dragons, twenty quests and turn-based dragon battles. Play free in your browser — no account required.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  return (
    <GameProvider>
      <Screens />
      <Toaster position="top-right" />
    </GameProvider>
  );
}

function Screens() {
  const { state } = useGame();
  switch (state.screen) {
    case "howto":
      return <HowToPlay />;
    case "house":
      return <HouseSelect />;
    case "profile":
      return <ProfileSetup />;
    case "dragonpick":
      return <DragonPick />;
    case "realm":
      return state.houseId && state.dragonId ? <Realm /> : <TitleScreen />;
    default:
      return <TitleScreen />;
  }
}
