# Global Error Notifications Design Spec

**Date:** 2026-03-18

## Goal

Introduce a global macOS-inspired error notification system for Portfolio OS so app-level errors are displayed consistently in the top-right corner with a shared visual language, timing model, and interaction contract.

## Product Scope

### Included in V1

- Global error notifications rendered above app content
- A single notification shape, size, spacing, and animation style
- Automatic dismissal after 5 seconds
- Vertical stacking in the top-right corner
- First integrations for:
  - `Notes`
  - `Mail`
- A shared app-facing API to publish notifications from any app

### Explicitly Out of Scope for V1

- Success notifications
- Informational notifications
- Persistent notification history
- Notification center drawer
- Manual per-notification snooze states
- Cross-session persistence

## Product Rules

- The notification system is global, not scoped to one app.
- V1 handles `error` notifications only.
- Notifications must appear in the top-right area of the desktop UI.
- All notifications share the same footprint and visual structure.
- Notifications are only shown after real user-facing failures or action-triggered errors.
- A notification disappears automatically after 5 seconds.
- Multiple notifications stack vertically in arrival order.
- The system must be reusable by any Portfolio OS app through a shared API.

## Architecture

The feature should be built as a global React notification layer mounted high in the app tree. A single provider owns notification state, timers, and dismissal logic. Apps such as `Notes` and `Mail` publish errors through a shared hook rather than rendering their own ad-hoc error UI.

This approach keeps the visual language centralized while letting app code stay focused on domain behavior. It also gives the app one place to control stacking, layout, auto-dismiss timing, accessibility, and future evolution.

## UI Design

### Placement

- Notifications appear in the top-right corner of the desktop shell
- They sit above app windows rather than inside one app pane
- They stack with fixed spacing and a stable offset from the viewport edge

### Visual Language

- Compact macOS-inspired cards
- Shared width and consistent internal padding
- Rounded corners, soft border, and subtle translucent background
- Clear text hierarchy:
  - title
  - message
  - optional app/source label
- Error-only styling in V1, without per-app color variants

### Motion

- Soft entrance animation
- Soft exit animation after dismissal
- No aggressive bounce or exaggerated motion

## Behavior

### Notification Lifecycle

1. An app detects an action-triggered or user-relevant failure
2. The app calls the shared notification API
3. The global center renders the error in the top-right stack
4. The notification auto-dismisses after 5 seconds

### Trigger Rules

Use the global notification center for:

- failed note publication
- failed mail submission
- server-side or network failures the user should understand
- cooldown or action rejection states that are user-facing and actionable

Do not use it for:

- empty states
- passive informational copy
- long-lived blocking views that need dedicated inline UI

## API Contract

The provider should expose a simple API such as:

```ts
pushError({
  title: string,
  message: string,
  source?: string,
})
```

Design constraints:

- the app does not manage timers manually
- the provider generates ids and handles removal
- the API is intentionally small for V1

## Integration Strategy

### Notes

- replace transient inline error rendering for publication failures
- keep structural editor state local
- surface cooldown and publication failures through the notification system

### Mail

- replace send-error messaging that should behave like a global macOS alert
- keep form validation local if the error is field-specific
- use notifications for server/network/send failures

## Accessibility

- notifications should remain readable with strong contrast
- the container should use appropriate live-region semantics for errors
- dismissal timing should not prevent the user from noticing the message
- content must remain concise and scannable

## Frontend State

The provider should manage:

- notification queue
- ids
- timestamps
- auto-dismiss timers
- remove/dismiss actions

Apps should manage only their own failure detection and call into the provider.

## Testing Strategy

### Notification Center

- pushing a notification renders it
- notifications stack correctly
- a notification disappears after 5 seconds
- multiple notifications maintain stable order

### Notes Integration

- failed publish triggers a global notification
- cooldown-triggered failure publishes one error notification
- Notes no longer relies on local transient error rendering for these cases

### Mail Integration

- failed send triggers a global notification
- network/server error paths publish the expected title/message

## Future Evolution

Possible later additions:

- success and info variants
- manual close button
- grouped notifications by app
- notification history center
- richer animations and app icons
