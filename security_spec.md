# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Strict Ownership Isolation**: Every document under `/users/{userId}` and `/users/{userId}/sync/{syncId}` belongs strictly to the authenticated, email-verified user whose `request.auth.uid == userId` and `data.ownerId == request.auth.uid`.
2. **No Directory Enumeration**: `allow list` is `false` on both `/users/{userId}` and `/users/{userId}/sync/{syncId}` so no user can list or scrape other users' documents.
3. **Master Gate**: Writes and reads on `/users/{userId}/sync/{syncId}` verify that the parent `/users/{userId}` document exists and its `ownerId` matches `request.auth.uid`.
4. **Canonical Sync Document ID**: Only `syncId == 'challenge_v1'` is permitted under `/users/{userId}/sync/{syncId}` to prevent arbitrary document proliferation.
5. **Immutable Identity & Creation Timestamps**: `ownerId` and `createdAt` cannot change after creation, and `createdAt` / `updatedAt` must equal `request.time`.
6. **Strict Schema & Bounds**: Unknown keys are rejected via `hasAll` + `hasOnly` on create and `affectedKeys().hasOnly(...)` on update; strings, maps, and arrays have strict max sizes.

## 2. The "Dirty Dozen" Attack Payloads

1. **Unauthenticated Read**: Anonymous/unauthenticated client reads `/users/userA/sync/challenge_v1` -> `PERMISSION_DENIED`.
2. **Unverified Email Write**: Authenticated user with `email_verified: false` creates `/users/userA` -> `PERMISSION_DENIED`.
3. **Cross-User Read (IDOR)**: `userB` reads `/users/userA/sync/challenge_v1` -> `PERMISSION_DENIED`.
4. **Identity Spoofing on Create**: `userA` creates `/users/userA` with `ownerId: "userB"` -> `PERMISSION_DENIED`.
5. **Shadow / Ghost Field Injection**: `userA` creates `/users/userA/sync/challenge_v1` with extra key `isAdmin: true` -> `PERMISSION_DENIED`.
6. **Client Timestamp Forgery**: `userA` writes `createdAt` or `updatedAt` with a past timestamp instead of `request.time` -> `PERMISSION_DENIED`.
7. **Immutable Field Mutation**: `userA` updates `/users/userA/sync/challenge_v1` changing `createdAt` or `ownerId` -> `PERMISSION_DENIED`.
8. **Path Variable Poisoning**: `userA` writes to `/users/userA/sync/../../other` or `/users/userA/sync/arbitrary_id` -> `PERMISSION_DENIED`.
9. **Oversized DisplayName Exhaustion**: `userA` sets `profile.displayName` to 500 characters (> 100) -> `PERMISSION_DENIED`.
10. **Invalid Enum Poisoning**: `userA` sets `settings.theme: "hacker"` -> `PERMISSION_DENIED`.
11. **Array Type Poisoning**: `userA` sets `repEvents: ["not-an-object"]` -> `PERMISSION_DENIED`.
12. **Blanket User List Scraping**: Authenticated `userA` queries `collection(db, 'users')` -> `PERMISSION_DENIED`.
