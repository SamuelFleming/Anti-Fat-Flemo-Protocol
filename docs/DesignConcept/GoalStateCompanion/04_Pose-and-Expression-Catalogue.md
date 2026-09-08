# GoalStateCompanion — Pose and Expression Catalogue

**Status:** Decided (Phase 3, ticket 3004). Gives every important resolved composition from
`03_State-Composition-Rules.md` §8 a canonical **static** pose/expression so reduced-motion users
and static fallbacks still communicate meaning (charter §4.10, §13, §14).

**Component:** `GoalStateCompanion` (static visual language)
**Purpose:** Renderer-independent stance / weight / limb / face descriptions — not rigging or clip
names.

Silhouette, material, and face inventory follow `01_Character-Visual-Language.md`. Composition IDs
follow `03_State-Composition-Rules.md` §8.

---

## 1. Description Conventions

Each entry specifies:

- **Stance / weight** — where the body sits over the feet
- **Torso** — uprightness, squash/stretch (bounded; never body-composition change)
- **Arms** — mitten-like terminations; no finger posing
- **Legs / feet** — soft base contact
- **Face** — eyes / mouth / optional brows from the 3001 inventory
- **Accent** — optional small coral / lavender / lime cue
- **Composition source** — which 3003 rule(s) produce it
- **Must not read as** — misinterpretation guardrails

All poses are readable at dashboard centre-column size. Animation (3005) elaborates these; it must
not be the sole carrier of meaning.

---

## 2. Catalogue

### `mannequin` — no data / uninstantiated

| Aspect | Spec |
|---|---|
| Stance | Centred, feet parallel, no lean |
| Torso | Rest proportions, fully upright but soft — not rigid military, not slumped |
| Arms | Hang symmetrically at sides, slightly away from torso |
| Legs | Straight soft cylinders; no bounce implied |
| Face | Eyes open, default rounded; mouth a flat short line; no brows raised or knitted |
| Accent | None; base moss at **reduced saturation / softer contrast** |
| Source | `dataState = no-data` (3003 §6; 3006) |
| Must not read as | Sad, abandoned, punished, asleep, or "broken" |

This is the **only** deliberately under-expressive identity pose. Distinct from `low-fuel` and
`under-moved`.

---

### `balanced` — within range + adequate Move

| Aspect | Spec |
|---|---|
| Stance | Easy centred weight; tiny natural asymmetry allowed |
| Torso | Rest height; comfortable upright |
| Arms | Relaxed at sides or one arm with a soft idle bend |
| Legs | Soft standing base |
| Face | Soft/content eyes; small smile |
| Accent | Optional quiet lime if `goalProgress = ahead` (secondary) |
| Source | Default priority-7 path; `balanced` composition |
| Must not read as | Celebratory mascot cheer or blank mannequin |

---

### `mildly-full` — over-target intake

| Aspect | Spec |
|---|---|
| Stance | Slight rearward weight; grounded |
| Torso | **Slight** soft outward squash at midsection (bounded); otherwise upright |
| Arms | One or both mitten-hands loosely near / framing midsection (optional, subtle) |
| Legs | Firm base, less spring |
| Face | Soft eyes; mouth flat-to-soft (full-soft) or tiny content line (full-content) |
| Accent | Optional small coral cheek/chest accent |
| Source | Posture priority 2; bodyForm from nutrition |
| Must not read as | Shame, bloating caricature, or permanent size change |

---

### `over-full` — significantly over target

| Aspect | Spec |
|---|---|
| Stance | More rearward / settled than `mildly-full` |
| Torso | Noticeable but still **bounded** midsection squash; shoulders slightly rounded forward |
| Arms | Clearer hand-near-torso cue than mildly-full |
| Legs | Planted; minimal lift |
| Face | full-soft or full-effort (if Move also high); never angry or disgusted |
| Accent | Soft coral accent allowed |
| Source | Posture priority 1 |
| Must not read as | Mockery, sickness, or "you failed" |

---

### `exertion` — high Move

| Aspect | Spec |
|---|---|
| Stance | Wider soft base; weight ready / slightly forward |
| Torso | Tall; mild expansion on implied inhale hold |
| Arms | Slightly out from body or mid-recovery hang |
| Legs | Soft athletic stand (no joint bends required — squash language only) |
| Face | effort-content: alert eyes, slightly open or effort mouth |
| Accent | Optional lavender accent; light sweat sheen if effects on |
| Source | Posture priority 4 |
| Must not read as | Exhausted collapse or competitive "PR flex" |

---

### `high-exertion` — very-high Move

| Aspect | Spec |
|---|---|
| Stance | Wider; more forward; "just finished something big" |
| Torso | Expanded breath hold / stronger breath silhouette |
| Arms | Recovery hang or brief stretch suggestion in static form (one arm raised soft arc is OK) |
| Legs | Planted wide soft base |
| Face | effort-* (alert / open mouth); if also low-fuel → effort-tired |
| Accent | Lavender + visible sweat sheen cue |
| Source | Posture priority 3; effects from very-high |
| Must not read as | Infinite celebration ("more Move = happier forever") — this is exertion/recovery |

---

### `low-fuel` — firm late/low nutrition

| Aspect | Spec |
|---|---|
| Stance | Slight inward / narrower base |
| Torso | Mild vertical tuck / compact (bounded); not a collapse |
| Arms | Closer to torso; less expansive |
| Legs | Soft, less spring |
| Face | low-fuel: softer/narrower eyes; flat or slightly downturned mouth **without** sadness melodrama; optional concern brows |
| Accent | None or very soft coral (intake cue), never punitive red wash |
| Source | Posture priority 5; firm time only |
| Must not read as | Abandoned mannequin, depression, or hunger diagnosis of the user |

---

### `under-moved` — firm low Move, nutrition OK

| Aspect | Spec |
|---|---|
| Stance | Narrower, quieter than balanced |
| Torso | Upright but less open |
| Arms | Closer hang; no stretch |
| Legs | Soft parallel stand |
| Face | attentive (open, not smiling hard); not disappointed |
| Accent | None |
| Source | Posture priority 6 |
| Must not read as | Laziness insult, punishment, or no-data mannequin |

---

### `partial-nutrition-only`

| Aspect | Spec |
|---|---|
| Stance / torso / arms / face | Use the nutrition-appropriate pose (`balanced` / `mildly-full` / `over-full` / `low-fuel`) |
| Exertion cues | **Absent** — no sweat, no heavy-breath silhouette, no wide athletic base |
| Accent | Coral only if nutrition story is active |
| Source | 3003 §6 partial |
| Must not read as | A full complete-day story |

---

### `partial-movement-only`

| Aspect | Spec |
|---|---|
| Stance / breath / effects | Use movement-appropriate pose (`balanced` / `exertion` / `high-exertion` / `under-moved`) |
| Body form | Rest proportions only — no fullness/tuck from inventing calories |
| Accent | Lavender only if Move story is active |
| Source | 3003 §6 partial |
| Must not read as | Calorie judgement |

---

### `milestone` — quiet goal celebration

| Aspect | Spec |
|---|---|
| Base | Start from `balanced` |
| Stance | Slightly more open / upright |
| Face | Pleased: soft eyes + clearer small smile |
| Accent | Soft lime highlight (head tuft or chest) |
| Source | 3003 §5.4 / §7 temporary or held ahead-of-trajectory quiet accent |
| Must not read as | Confetti mascot explosion or pet reward for logging |

---

## 3. Face Token → Features Map

| Face token | Eyes | Mouth | Brows |
|---|---|---|---|
| `blank-neutral` | Default open | Flat short line | Rest |
| `content` | Soft/content | Small smile | Rest |
| `pleased` | Soft/content, slightly brighter | Clearer smile | Rest / lightly raised |
| `attentive` | Open / alert | Flat-to-soft | Rest |
| `concern-soft` | Softer | Flat | Optional slight knit |
| `low-fuel` | Softer / narrower | Flat / slight downturn (subtle) | Optional concern |
| `effort-content` | Wide/alert | Slightly open | Rest |
| `effort-tired` | Softer alert | Slightly open or flat | Optional knit |
| `full-soft` | Soft | Flat-to-soft | Rest |
| `full-content` | Soft | Small smile | Rest |
| `full-effort` | Alert | Slightly open | Rest |

---

## 4. Accessibility Notes

- Every animated behaviour in 3005 must land on one of these static poses under
  `prefers-reduced-motion`.
- Colour accents are reinforcement only; posture + face carry meaning without colour.
- No-data must remain visually distinct from negative/low states (`mannequin` ≠ `low-fuel`).

---

## 5. Implementation Freedom

Exact millimetre offsets, mesh morph weights, and accent motif art are free in production
(3007/3009+) as long as the readable differences above remain: mannequin vs balanced vs full vs
exertion vs low-fuel vs under-moved vs milestone.
