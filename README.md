# Seven Kingdoms Legacy

Build a COMPLETE, PLAYABLE browser-based fantasy strategy/adventure game called “Seven Kingdoms: Rise of the Dragon”.

IMPORTANT:

This must be a real interactive WEB GAME, not a landing page, mockup, dashboard, or collection of static screens.

Build the complete experience in one project from the beginning.

Do not leave placeholder buttons, empty pages, “coming soon” sections, fake interactions, or unfinished components.

Every visible button, card, tab, selection, quest, battle action, and navigation element must work.

The game must be playable immediately after generation using local game state.

Do not require login, payment, API keys, or external services to play the core game.

Make the game responsive for desktop and mobile browsers.

Use original fantasy names, artwork-style visuals, symbols, and lore. Do NOT copy copyrighted Game of Thrones characters, logos, exact locations, dialogue, or artwork.

1. VISUAL STYLE

Create a premium dark medieval fantasy interface.

Visual direction:

Dark charcoal/black background

Deep red, burgundy, bronze and muted gold accents

Medieval stone, parchment and metal textures

Cinematic fantasy atmosphere

Elegant serif headings combined with readable modern body text

Large atmospheric backgrounds

Subtle particles, smoke, embers and dragon-themed visual effects

Smooth hover states and page transitions

High-quality cards and panels

No childish cartoon appearance

No generic emoji as the main visual assets

Use polished fantasy icons, silhouettes and CSS/SVG-based decorative elements where appropriate

The interface should feel like a serious premium fantasy game.

2. TITLE / START SCREEN

Create an impressive opening screen.

Title:
“SEVEN KINGDOMS”
Subtitle:
“RISE OF THE DRAGON”

Show:

Cinematic fantasy background

A large dragon silhouette

Medieval kingdom atmosphere

“BEGIN YOUR REIGN” button

“HOW TO PLAY” button

HOW TO PLAY should open a clear explanation of:

Houses

Dragons

Resources

Quests

Battles

Territories

Choices and consequences

3. HOUSE SELECTION

After clicking BEGIN YOUR REIGN, show a full House Selection screen.

Create exactly 5 Great Houses:

House Valeron — The Crown of Fire

House Draven — The Iron Wolves

House Aeloria — The Moon Court

House Kaelthorn — The Storm Lords

House Veyr — The Shadow Keep

Each house must have:

Unique sigil

Unique visual identity

Ruler

Territory

Short history

Strength

Wealth

Influence

Military power

Starting resources

House specialty

Show all 5 houses clearly on screen.

The player must be able to click a house to open a detailed information panel and then click:
“CHOOSE THIS HOUSE”

Once selected, store the player's chosen house and update the game state.

4. PLAYER PROFILE

After selecting a house, create the player's profile.

Show:

Player name: allow the player to enter a custom name

Selected House

House ruler

Level

Gold

Army

Reputation

Influence

Food

Territory

Dragon Bond

Display these values throughout the game.

5. DRAGON SYSTEM

Create 10 unique dragons.

Each dragon must have:

Unique name

Age

Size

Element

Health

Attack

Defense

Speed

Fury

Bond level

Rarity

Short lore description

Distinct visual appearance

Examples of dragon names:

Vharos

Nyxara

Emberwing

Dreadmaw

Solaryn

Ashfang

Vaelith

Stormscale

Morvane

Ignivar

Do not make all dragons look identical.

Create a Dragon Hall where the player can:

Browse all dragons

View details

Select an available dragon

Feed it

Train it

Increase its bond

View its stats

Only some dragons should be available initially. Unlock additional dragons through gameplay.

6. MAIN REALM DASHBOARD

After choosing a house and dragon, show the main game dashboard.

Include:

Player profile

Current house

Dragon

Resources

Current quest

Reputation

Current territory

Navigation

Main navigation:

REALM

MAP

DRAGONS

CHARACTERS

QUESTS

BATTLES

HOUSE

CHRONICLE

Every navigation item must open a functional section.

7. INTERACTIVE MAP

Create a fantasy kingdom map with at least 10 locations.

Locations should include:

Capital

Northern Fortress

Dragon Valley

Whispering Woods

Storm Coast

Iron Pass

Moonlit Harbor

Ashen Mountains

Shadow Marsh

Ancient Ruins

Each location must be clickable.

Clicking a location should show:

Location name

Description

Controlling house

Danger level

Available resources

Available quests

Travel button

Travelling should update the player's current location.

Some locations should be locked initially and unlock through progression.

8. CHARACTERS

Create at least 15 original fantasy characters from the five houses.

Each character needs:

Name

Portrait/visual

House

Role

Short biography

Loyalty

Relationship with player

Dialogue

Characters should appear in quests and story events.

Allow the player to interact with them.

Choices in conversations should change relationships or reputation.

9. QUEST SYSTEM

Create at least 20 quests divided into:

Main Story

House Quests

Dragon Quests

Exploration Quests

Battle Quests

Each quest must contain:

Title

Story

Objective

Choices

Consequences

Reward

Completion state

Do not make quests static.

Examples of meaningful choices:

Help a rival house

Protect a village

Steal resources

Negotiate peace

Attack an enemy

Rescue a character

Search ancient ruins

Choices must modify game values such as:

Reputation

Gold

Army

Influence

Relationships

Territory

Dragon Bond

10. BATTLE SYSTEM

Create an actual turn-based fantasy battle system.

The player can:

Select dragon

Select enemy

Choose Attack

Choose Defend

Choose Special Ability

Choose Dragon Fury

Show:

Player health

Enemy health

Dragon stats

Battle log

Damage numbers

Turn indicator

Victory/defeat state

Battle results must depend on stats and actions.

Winning gives:

Gold

Experience

Reputation

Items

Sometimes territory

Losing should have consequences.

11. TERRITORY / KINGDOM SYSTEM

Allow the player to gain control over territories.

Show:

Controlled territories

Enemy territories

Neutral territories

Territories should affect:

Income

Army

Resources

Influence

Create a simple conquest system where successful quests and battles can change territorial control.

12. HOUSE SYSTEM

The selected house should matter throughout gameplay.

Different houses should have different:

Starting stats

Special abilities

Resources

Characters

Quest lines

Dragon relationships

The player should feel that choosing a different house changes the game.

13. PROGRESSION

Add:

Player XP

Player levels

Dragon XP

Dragon levels

Unlockable dragons

Unlockable locations

Achievements

Story milestones

Create at least 10 achievements.

Examples:

First Blood

Dragon Rider

Conqueror

Master of the Realm

Beast Tamer

14. CHRONICLE / STORY LOG

Create a Chronicle section that records:

Completed quests

Important decisions

Battles

Territories captured

Characters encountered

Dragons unlocked

Major story events

Make the player's journey feel persistent.

15. INVENTORY

Create an inventory system with:

Weapons

Armor

Dragon items

Food

Gold-related rewards

Quest items

Allow items to be collected and used where appropriate.

16. SAVE GAME

Use browser local storage for the core game state.

Save:

Player name

House

Dragon

Resources

Level

Quests

Decisions

Relationships

Territories

Inventory

Achievements

Add:
“SAVE GAME”
“NEW GAME”
“CONTINUE”

Do not require an account.

17. GAME FEEDBACK

Every important action should provide clear feedback.

Examples:

Quest completed

Gold gained

Reputation increased

Dragon bond increased

Territory captured

New dragon unlocked

Character relationship changed

Use elegant notification panels/toasts rather than browser alert popups.

18. RESPONSIVE DESIGN

The game must work properly on:

Desktop

Laptop

Tablet

Mobile browser

On smaller screens, convert navigation into a mobile-friendly menu without breaking gameplay.

19. QUALITY REQUIREMENTS

Before considering the build complete, verify that:

No broken links exist.

No navigation button is dead.

No placeholder text remains.

No empty sections exist.

All 5 houses are visible and selectable.

All 10 dragons are visible in the Dragon Hall.

Map locations are interactive.

Quests can be started and completed.

Battles can actually be played.

Resources update.

Player choices affect game state.

Progress persists after refreshing the browser.

New Game resets the game correctly.

Continue restores saved progress.

The game can be played from beginning to end without developer intervention.

20. FINAL EXPERIENCE

The final result should feel like a polished fantasy strategy/adventure game website, not an AI-generated template.

The player experience should be:

START
→ Choose House
→ Create Player
→ Choose Dragon
→ Enter Realm
→ Explore Map
→ Meet Characters
→ Complete Quests
→ Make Choices
→ Fight Battles
→ Gain Resources
→ Capture Territories
→ Unlock Dragons
→ Progress Story
→ Build Reputation
→ Become Ruler of the Seven Kingdoms

Build the entire core experience now with functional interactions and coherent game state. Prioritize completeness, usability, visual quality and actual gameplay over adding unnecessary features.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dragon-kingdoms-quest.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f0d16009-7b5c-4433-bf84-93cfa0b3270f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
