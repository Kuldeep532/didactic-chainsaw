# Nexus Wave Technologies

Nexus Wave Technologies develops Nexus Plus and Geeta Nexus.

## Integration contract

The website and supported products use the shared Supabase project for services that have been explicitly wired to Supabase.

The website frontend is Astro-based and does not depend on the legacy Express API or Firebase frontend authentication.

## Naming

Use:
- Nexus Wave Technologies
- Nexus Plus
- Geeta Nexus

Do not use the retired company name in new user-facing content.


## Forum and community data model

The Forum feature uses `forum_categories` and `forum_posts` as its canonical discussion contract. Categories are admin-managed; verified members can submit moderated posts into existing categories.

Each published post should expose:
- `id`
- `title`
- `content`
- `published_at`
- `author_display_name`
- `post_type`

Recommended `post_type` values:
- `official`: published by an authorized team member.
- `community`: submitted by a verified member and approved by moderation.

Legacy `team_posts` may be retained during migration, but the web feed should read from `posts` once the Supabase migration/backfill is applied. Do not create a second public feed for the same content.

Recommended role values:
- `user`
- `moderator`
- `team_editor`
- `admin`

Privileged publishing and moderation must be enforced with Supabase Row Level Security and/or Edge Functions. A client-side role flag must never grant access.

Recommended community entities:
- `profiles`: public profile fields and role/verification status.
- `friendships`: requester, addressee, status.
- `conversations`: private conversation metadata.
- `conversation_members`: membership boundary for every conversation.
- `messages`: message rows protected by conversation membership.
- `posts`: the canonical community feed and moderation status.
- `verification_requests`: verification state and minimal review metadata.
- `women_safety_reports`: confidential safety submissions.
- `campaign_submissions`: volunteer contributions and evidence-review state.
- `women_safety_heroes`: reviewed monthly recognition records.

For gender-specific community rooms, enforce a membership-category policy at the server boundary rather than arbitrary client-side room selection. Do not infer gender from photographs, voices or biometric analysis. Store the minimum information required to operate the access policy and support an appeal/review path for mistakes.

For chat deletion, distinguish between:
- "delete for me": removes the conversation/message from the user's view where product policy permits.
- "delete for everyone": restricted operation with explicit rules and auditability.

Official publishing must be authorized by server-side role checks, not by hiding a button alone.


Forum category creation is restricted to administrators. Users may select an existing category and choose an audience scope (`all`, `female`, or `male`) when submitting a post. The web UI does not allow users to create categories.

## Community identity and permissions contract

### Public profile
Only the user's chosen public display name should be exposed in user lists, Forum cards, friend lists and chat surfaces. Do not expose email, phone, verification identifiers, private contact details or other account metadata through public community queries.

### Private chat gate
A private chat may be created only when both users have an accepted friendship relation in both directions. A chat request alone is not sufficient. Users can still report another profile without being friends.

### User reporting
Every user profile must expose a Report action. Reports are private moderation records and are submitted through a server-side RPC. A reported user does not receive the reporter's private details through the reporting record.

### Team application and verification
A user submits a team application from Join Our Team. The application is reviewed in the Admin Control Center. Only after approval should an authorized team-member record and role permissions be granted.

### Team role categories
Recommended roles:
- `team_member`: general approved contributor.
- `team_editor`: official publishing/content editing.
- `moderator`: Forum and community moderation.
- `safety_campaign`: Women Safety campaign contribution.
- `safety_content`: safety education and creative content.
- `forum_organizer`: community/forum organization.
- `accessibility_qa`: accessibility testing and QA.
- `admin`: full administrative control.

These roles are permissions, not public profile labels. Server-side RLS/Edge Functions must enforce them.

### Live contributor badge
A contributor report is submitted from the user's profile. An authorized reviewer approves it, which activates the public-safe `Trusted Contributor` badge. The badge must not expose the underlying report, evidence, email or private details.


## Private Support Hub contract

Women Safety reports may create a separate support case object. The case must not expose the reporter's ordinary profile to support staff by default.

Recommended entities:
- `support_cases`: random public-safe case ID, status, created_at, last_activity_at and contact preference.
- `support_case_tokens`: one-time or revocable invitation tokens; store only hashes of tokens where possible.
- `support_case_participants`: case-level membership for the reporter and approved support worker.
- `support_messages`: end-to-end or application-layer encrypted case messages with strict RLS.
- `support_voice_sessions`: ephemeral voice session metadata without publishing a phone number.

The support URL should contain a random opaque invitation token and never contain a user ID, email address or phone number. Once the token is redeemed, the user can enter a private chat or voice session when an approved support worker is available.

Support staff should see the minimum case context required for the active case, not the person's unrelated profile, friends, email, phone, or community activity. A separate emergency/escalation policy can allow disclosure only where legally or operationally required.

### Identity and account uniqueness

Do not promise that a normal browser/app/device can prove a unique real-world person by itself. For stronger account uniqueness, require verified phone authentication and an application-level device/account binding. Reject a second active account for the same verified phone identity, and add rate limits, CAPTCHA/risk checks and recovery rules. Treat device identifiers as risk signals rather than sole identity proof because devices can be reset, shared or spoofed.

The private support case should be linked to the authenticated account internally, but support staff should interact through the opaque case ID/token rather than the public profile.


## WebRTC private support contract

Private support voice uses WebRTC for real-time media. Supabase Realtime is the signaling layer only; audio/video media must not be stored in the public database.

Signaling channel:
- channel name: `support:<case_id>`
- messages: `offer`, `answer`, `ice-candidate`, `hangup`, `availability`
- channel access: only authenticated participants in `support_case_participants`
- never put a phone number, email address or normal profile ID in the signaling payload when an opaque case token can be used.

Client flow:
1. Reporter submits a private case.
2. Backend creates an opaque case code and revocable invitation token.
3. Support worker is assigned only after availability and gender-scope checks.
4. The app redeems the invitation and obtains case-level membership.
5. WebRTC offer/answer and ICE candidates are exchanged through the protected Realtime channel.
6. The voice session record stores status and timestamps, not raw audio.
7. Closing or revoking the case invalidates future signaling and token redemption.

The website may register the complaint and collect a required email when the user will not install the app. The website does not expose the active private conversation UI. Email should be used only for case notifications/invitation delivery and must never contain the complaint body.

