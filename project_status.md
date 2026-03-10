# Project Status

> 86 scaffold files exist. 8 data JSONs implemented. 9 app/ screens have placeholder UI.  
> **Phases 1–2 implemented. Phase 3+ rebuilds the app incrementally — each phase adds a playable vertical slice.**

---

## Phase 1 — Types & Utilities ✅

> Foundation. No project dependencies. Everything else depends on this.

- [x] `src/types/game.types.ts` — Phase, SubPhase, GameState, Vote, BalanceScore, FullMoonState, WinResult, LocalizedText, GameConfig (+ TimerConfig, AIConfig, ScalingConfig)
- [x] `src/types/player.types.ts` — Alignment, Role (19), NightActionType (15), ImportanceTier, PlayerRole
- [x] `src/types/role.types.ts` — RoleDefinition, NightActionConfig, TargetRule, ValidTargets, ZombieState, RoleDistribution, RolesData
- [x] `src/types/personality.types.ts` — PersonalityType (6), PerceptionDepth, VotingStyle, PlayerPersonality (17 stats), PersonalityDefinition, PersonalitiesData
- [x] `src/types/chat.types.ts` — ActionType (7), Channel, IndirectTarget, RoleClaim, ChatEvent, Message
- [x] `src/types/event.types.ts` — EventTiming, NightEchoEventId (14), NightEchoEvent, LastWishActionType (4), LastWishActionConfig, LastWish, FullMoonStage, PendingEvent, NightEchoEventsData, LastWishData
- [x] `src/types/memory.types.ts` — InteractionRecord, Relationship, KnownRole, NightResult, EventWitnessed, VoteRecord, GossipHint, PlayerMemory
- [x] `src/utils/probability.ts` — rollProbability(), weightedRandom(), shuffleArray(), clamp(), randomInt(), randomElement()
- [x] `src/utils/weightCalculator.ts` — applyDecay(), calculateDirectWeight(), calculateIndirectWeight(), combineScore(), applyEmotionalModifier(), normalizeWeight()
- [x] `src/utils/balanceScore.ts` — calculateRatio(), getImbalance(), mapToStage(), getLosingFaction()
- [x] `src/utils/formatters.ts` — setLocale(), getLocale(), localize(), formatPlayerName(), formatPhase(), formatRole(), formatAlignment(), formatTime(), formatDeathMessage(), formatVoteResult(), formatEventTitle()

**Phase 1 complete.** All interfaces defined. Utility functions testable in isolation. `tsc --noEmit` passes with zero errors.

---

## Phase 2 — State Management ✅

> Depends on: **Phase 1**  
> In-memory state managers. Each one reads/writes game data.

- [x] `src/state/GameState.ts` — init(), getState(), getConfig(), updatePhase(), advanceDay(), markPlayerDead(), markPlayerZombie(), updateFullMoon(), setGameOver(), reset()
- [x] `src/state/PlayerState.ts` — initializePlayers(), getPlayer(), getPersonality(), getAllAlivePlayers(), updatePlayerStatus(), getRoleDistribution(), getPlayersByAlignment(), getHumanPlayer(), reset()
- [x] `src/state/ChatState.ts` — addChatEvent(), addMessage(), getEventsByDay(), getMessagesByChannel(), getEventsForPlayer(), getRecentEvents(), getRecentMessages(), reset()
- [x] `src/state/EventState.ts` — addPendingEvent(), getPendingByTiming(), markDelivered(), getUndelivered(), setLastWish(), getLastWish(), clearLastWish(), clearDeliveredEvents(), clearNightEvents(), reset()
- [x] `src/state/MemoryManager.ts` — initMemory(), getMemory(), updateRelationships(), applyDayDecay(decay=0.70), addNightResult(), addKnownRole(), addEventWitnessed(), addVoteRecord(), addGossipHint(), freezeMemory(), getRelationshipScore(), reset()

**Phase 2 complete.** Can create a game, assign players, store state. `tsc --noEmit` passes with zero errors.

---

## Phase 3 — Playable Shell (App on Phone)

> Depends on: **Phases 1–2**  
> Goal: **Start the game, get a role, open the chat, send messages.** App runs on your phone. No AI yet — just the human player in a lobby with empty AI seats.

### Step 1 — Game initialization + role assignment
- [ ] `src/engine/BalanceCalculator.ts` — calculateBalance() — basic balance scoring (needed by role distribution)
- [ ] Minimal `src/hooks/useGameLoop.ts` — startGame(playerCount): inits GameState, PlayerState, assigns roles, exposes gameState + humanPlayer

### Step 2 — Shared UI components
- [ ] `src/components/shared/PlayerAvatar.tsx` — player icon with alive/dead indicator
- [ ] `src/components/shared/RoleCard.tsx` — flip-to-reveal role card (name, alignment, ability)
- [ ] `src/components/shared/Timer.tsx` — countdown timer (used across phases)
- [ ] `src/components/shared/FactionBanner.tsx` — Town/Mafia/Neutral colored banner

### Step 3 — Lobby screen (real)
- [ ] `src/components/lobby/PlayerCount.tsx` — player count slider (7–16)
- [ ] `src/components/lobby/RolePreview.tsx` — shows which roles will be in the game by tier
- [ ] `src/components/lobby/StartButton.tsx` — animated start button
- [ ] `app/index.tsx` — wire lobby components + useGameLoop.startGame → show RoleCard → navigate to /game/day

### Step 4 — Chat system (human only)
- [ ] Minimal `src/hooks/useChat.ts` — sendMessage(text), messages list, addMessage to ChatState (public channel only)
- [ ] `src/components/chat/ChatBubble.tsx` — single message bubble with player avatar
- [ ] `src/components/chat/ChatInput.tsx` — text input + send button
- [ ] `src/components/chat/PublicChat.tsx` — scrollable message list (FlatList) + ChatInput
- [ ] `app/game/day.tsx` — wire useChat + PublicChat, human can type messages and see them appear

### Step 5 — Basic navigation + layout
- [ ] `app/_layout.tsx` — wrap with game context provider, load settings
- [ ] `app/game/_layout.tsx` — consume context, route between game screens
- [ ] `app/settings.tsx` — basic settings (language, player count default) + AsyncStorage

**After Phase 3:** App runs on phone. You can start a game, see your role, open the chat and type messages. AI players exist but are silent.

---

## Phase 4 — Template AI + Day Cycle

> Depends on: **Phase 3**  
> Goal: **AI players talk in the chat using pre-written templates. Basic day→vote→night flow works.** You see a living game — AI players accuse, defend, discuss. Voting produces a lynch.

### Step 1 — Template text provider
- [ ] `src/ai/providers/AITextProvider.ts` — AITextProvider interface (generateMessage, analyzeMessage, isAvailable)
- [ ] `src/ai/providers/TemplateProvider.ts` — picks templates from messageTemplates.json based on action × personality × intensity
- [ ] `src/ai/providers/AIProviderFactory.ts` — getProvider() returns TemplateProvider (only option for now)

### Step 2 — AI speaking logic
- [ ] `src/ai/PerceptionFilter.ts` — getFilteredMemory() — 3-level memory filtering
- [ ] `src/ai/SpeakProbability.ts` — shouldSpeak() — personality × role × trigger × cooldown
- [ ] `src/ai/MessageGenerator.ts` — selectMessageType() + generateMessage() using TemplateProvider

### Step 3 — AI voting logic
- [ ] `src/ai/VoteDecision.ts` — decideVote() — 8-step suspicion scoring
- [ ] Minimal `src/engine/WinChecker.ts` — checkWinConditions() — Town win + Mafia win only (skip Jester/Executioner/Zombie for now)

### Step 4 — Discussion + voting orchestration
- [ ] `src/engine/AIEngine.ts` — runDiscussionTurn() (loop: for each AI → shouldSpeak? → generateMessage → addChatEvent), runVoteTurn() (collect AI votes)
- [ ] `src/engine/ChatAnalyzer.ts` — analyzeMessage() — parse human text into structured ChatEvent (keyword-based, no LLM)
- [ ] Minimal `src/engine/PhaseManager.ts` — advanceSubPhase() for day flow: discussion → trial → voting → lynch_resolution

### Step 5 — Voting UI
- [ ] `src/hooks/useVoting.ts` — castVote(targetId), collectAIVotes(), result
- [ ] `src/components/voting/VotePanel.tsx` — guilty / innocent / abstain buttons
- [ ] `src/components/voting/VoteCard.tsx` — individual vote display
- [ ] `src/components/voting/VoteResult.tsx` — tally + outcome (lynch or acquit)
- [ ] `app/game/vote.tsx` — wire useVoting + VotePanel + VoteResult

### Step 6 — Day→Night→Day loop
- [ ] Update `src/hooks/useChat.ts` — integrate AIEngine.runDiscussionTurn() into chat flow
- [ ] Update `src/hooks/useGameLoop.ts` — full day cycle: discussion → vote → night (skip) → morning (skip) → next day
- [ ] `app/game/night.tsx` — minimal night screen (shows "Night falls..." + auto-advance timer)
- [ ] `app/game/morning.tsx` — minimal morning screen (shows "A new day begins" + advance)

**After Phase 4:** Full day cycle works. AI players discuss using templates, you vote, someone gets lynched. Night/morning are placeholder transitions. Game feels alive.

---

## Phase 5 — Night Actions + Events + Full Game Loop

> Depends on: **Phase 4**  
> Goal: **Complete game loop — night actions resolve, events fire, win conditions checked. A full game can be played start to finish.**

### Step 1 — Night action engine
- [ ] `src/ai/NightDecision.ts` — selectTarget() — role-specific night action logic (19 roles)
- [ ] `src/engine/ResolutionEngine.ts` — resolveNight() — 7-phase resolution order
- [ ] `src/hooks/useNightActions.ts` — submitAction(targetId), validTargets, AI actions collected

### Step 2 — Night UI
- [ ] `src/components/night/NightAction.tsx` — human role-specific action selector (target picker)
- [ ] `src/components/night/ResolutionLog.tsx` — private resolution summary (what happened to you)
- [ ] `src/components/chat/MafiaChat.tsx` — private Mafia-only chat channel
- [ ] `src/components/chat/SilencedOverlay.tsx` — overlay when player is silenced
- [ ] Update `app/game/night.tsx` — wire useNightActions + NightAction + MafiaChat (if Mafia role)

### Step 3 — Morning report + events
- [ ] `src/engine/NightEchoEngine.ts` — selectEvents() — E01–E14, max 2/night, weighted random
- [ ] `src/engine/FullMoonEngine.ts` — checkFullMoon(), determineStage() — balance-based activation
- [ ] `src/engine/LastWishEngine.ts` — checkLastWish(), selectAction() — 40% on lynch, 4 action types
- [ ] `src/ai/EventReaction.ts` — reactToEvent() — Night Echo → memory impact + speak trigger
- [ ] `src/hooks/useMorningReport.ts` — reportItems (deaths, events, Full Moon), advance
- [ ] `src/hooks/useEvents.ts` — pendingEvents, deliverEvent, activeOverlay

### Step 4 — Morning + event UI
- [ ] `src/components/night/MorningReport.tsx` — sequential death/event reveals
- [ ] `src/components/events/NightEchoBanner.tsx` — echo event display
- [ ] `src/components/events/FullMoonOverlay.tsx` — Full Moon splash + stage announcement
- [ ] `src/components/events/ZombieIndicator.tsx` — zombie infection badge
- [ ] `src/components/voting/LastWishBanner.tsx` — Last Wish action reveal
- [ ] `src/components/shared/MayorBadge.tsx` — Mayor ×2 vote indicator
- [ ] Update `app/game/morning.tsx` — wire useMorningReport + MorningReport + FullMoonOverlay

### Step 5 — Win conditions + Game Over
- [ ] Update `src/engine/WinChecker.ts` — all 6 win conditions (+ Jester, Executioner, Zombie)
- [ ] Update `src/hooks/useGameLoop.ts` — check win after lynch + after night, trigger game over
- [ ] Update `src/engine/PhaseManager.ts` — full cycle: morning → discussion → midday → trial → voting → lynch → mafia_chat → night_actions → resolution
- [ ] `app/game/result.tsx` — wire WinResult + FactionBanner + role reveals + game stats

**After Phase 5:** A complete game from start to finish. You start in the lobby, get a role, discuss with AI, vote, act at night, see morning reports, events fire, and the game ends with a winner. Template AI handles all text.

---

## Phase 6 — Smart AI (API Providers)

> Depends on: **Phase 5**  
> Goal: **AI players generate real, contextual messages via Gemma API. Chat analysis understands intent. Much smarter conversations.**

### Step 1 — Prompt engineering
- [ ] `src/ai/prompts/promptUtils.ts` — formatRelationships(), formatKnownRoles(), truncateContext()
- [ ] `src/ai/prompts/messagePrompt.ts` — buildMessagePrompt() — role + memory + personality → prompt string
- [ ] `src/ai/prompts/analysisPrompt.ts` — buildAnalysisPrompt() — raw text → structured ChatEvent prompt

### Step 2 — API provider
- [ ] `src/ai/providers/GemmaAPIProvider.ts` — Gemma-3-4b-it via Google AI API (generateMessage + analyzeMessage)
- [ ] Update `src/ai/providers/AIProviderFactory.ts` — add GemmaAPIProvider to fallback chain (API → Template)
- [ ] Update `src/engine/ChatAnalyzer.ts` — use AIProvider.analyzeMessage() for smarter parsing

### Step 3 — Settings + API key management
- [ ] Update `app/settings.tsx` — AI provider selector (Template / API), API key input, model config
- [ ] Secure API key storage via expo-secure-store

**After Phase 6:** AI players speak with contextual, generated text. Conversations feel natural. Falls back to templates if API is unavailable.

---

## Phase 7 — Local AI (Gemma On-Device)

> Depends on: **Phase 6**  
> Goal: **Run Gemma-3-1b-it locally on the phone via MediaPipe. Fully offline play. Best experience.**

### Step 1 — Model management
- [ ] Model download UI — download Gemma-3-1b-it weights (~1.2 GB), progress bar, storage check
- [ ] Model cache manager — check if downloaded, delete, update

### Step 2 — Local inference
- [ ] `src/ai/providers/GemmaLocalProvider.ts` — MediaPipe LLM Task API integration, on-device inference
- [ ] Update `src/ai/providers/AIProviderFactory.ts` — full fallback chain: Local → API → Template

### Step 3 — Settings + model management UI
- [ ] Update `app/settings.tsx` — AI provider selector with Local option, model download/delete, storage info

**After Phase 7:** Fully offline play. No internet needed after model download. Best quality AI on-device.

---

## Dependency Map

```
Phase 1: Types + Utils               ✅ DONE
    ↓
Phase 2: State Management            ✅ DONE
    ↓
Phase 3: Playable Shell              ← App on phone, lobby, role, chat (human only)
    ↓
Phase 4: Template AI + Day Cycle     ← AI talks with templates, voting, day loop
    ↓
Phase 5: Night + Events + Full Game  ← Night actions, events, win conditions, complete loop
    ↓
Phase 6: Smart AI (API)              ← Gemma API for real text generation
    ↓
Phase 7: Local AI (Gemma On-Device)  ← Fully offline with MediaPipe
```

Each phase delivers a **playable increment**. After Phase 3 the app runs on your phone. After Phase 4 AI players are chatting. After Phase 5 the full game works end to end.
