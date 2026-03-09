// =============================================================================
// FILE: LastWishBanner.tsx
// PURPOSE: Last Wish event display after lynch — shows action effect
// LOCATION: src/components/voting/LastWishBanner.tsx
// =============================================================================

// TODO(APPROACH): Displays the Last Wish event after a lynch (40% chance).
// Shows which action type was triggered and its effect:
//   - Reveal Evidence: "Evidence reveals PlayerX may be [alignment]"
//   - Force Public Vote: "A forced re-vote has been triggered!"
//   - Expose Alignment: "The lynched player was [alignment]"
//   - Curse: "PlayerY has been cursed and silenced!"
//
// Collaborating files:
// - src/types/event.types.ts          — LastWish interface
// - src/hooks/useEvents.ts            — provides Last Wish event data
// - src/engine/LastWishEngine.ts      — produces the event
// - src/components/voting/VoteResult.tsx — shown before this banner
// - app/game/vote.tsx                 — parent screen

// TODO: Define LastWishBannerProps (lastWish: LastWish | null)
// TODO: Implement LastWishBanner component
// TODO: Handle each of 4 action types with appropriate display
// TODO: Show "No Last Wish" gracefully (component not rendered)
// TODO(LOW): Add dramatic reveal animation
