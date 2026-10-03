# Google Mobile Ads (AdMob) COPPA & Families Policy Integration for Kids Drawing App

A production-grade, Google Play Families Policy and COPPA-compliant Google Mobile Ads (AdMob) architecture for a Flutter kids' drawing and coloring application. This implementation pairs a child-safe drawing studio with an exportable Flutter codebase (`ad_helper.dart`, `main.dart`, `AndroidManifest.xml`) and an interactive compliance workbench to test and verify ad behaviors.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed based on your requirements and Phase 1 specifications:

- **Ad Format Strategy**: Both **Rewarded Video** (rewarded completion for bonus coloring packs) and **Standard Interstitial** (level/page transition flow) are integrated with distinct parental gate verification flows.
- **Banner Ad Placement**: Strict **Bottom-Anchored Container** with dedicated physical padding ($16\text{px}$ minimum separator buffer), safe-area insets, and clear visual partition outside the interactive canvas touch boundary to prevent accidental toddler touches.
- **Parental Gate Architecture**: Arithmetic challenge modal (randomized single/double-digit addition e.g. "What is 7 + 4?") with 4 multi-choice number options, designed to allow adults through while preventing toddlers from triggering or viewing unauthorized ad impressions.
- **Active Drawing Interstitial Guard**: Interstitial and rewarded ads are strictly blocked whenever a child is actively drawing (stroke-in-progress or continuous drawing session) to prevent surprise pop-ups that ruin toddler artwork and violate Play Families UX requirements.

---

## 1. Overview & Core Concept

### What It Delivers
1. **Flutter Production Codebase**:
   - `lib/ad_helper.dart`: Production-ready Flutter singleton wrapping `google_mobile_ads: ^5.2.0` with COPPA `tagForChildDirectedTreatment: TagForChildDirectedTreatment.yes`, `maxAdContentRating: MaxAdContentRating.g`, `tagForUnderAgeOfConsent: TagForUnderAgeOfConsent.yes`, and Non-Personalized Ads (`{'npa': '1'}`).
   - `lib/main.dart`: Complete Flutter entry point with asynchronous `MobileAds.instance.initialize()`, `WidgetsFlutterBinding.ensureInitialized()`, safe banner widget embedding, and Parental Gate state management.
   - `android/app/src/main/AndroidManifest.xml`: Android manifest snippet with the `com.google.android.gms.ads.APPLICATION_ID` metadata tag and Google Play Families declaration guidelines.
2. **Interactive Kids Studio & Compliance Workbench**:
   - Fully interactive kids' drawing canvas (vibrant kid-friendly brushes, rainbow colors, neon glow, stamps, undo/clear) running side-by-side with the Flutter source code viewer.
   - Real-time AdMob compliance simulator displaying the bottom banner buffer, parental gate challenge modal, ad load/impression state machine, and stroke-detection blocker.
   - One-click Ad Unit ID configurator allowing live testing with Google official test IDs (`ca-app-pub-3940256099942544/...`) or immediate substitution with production AdMob App IDs and Ad Unit IDs.

### Target Audience & Persona
- **Mobile App Developers & Publishers**: Building child-directed games and educational apps subject to Google Play Families Policy, FTC COPPA, and GDPR-K regulations.
- **Young Children & Parents**: Providing a playful, friction-free creative drawing environment without deceptive ad placements or predatory tracking.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ Toddler Drawing Flow ]
Child selects color/brush ──> Draws on canvas (Ad triggers suppressed mid-stroke) ──> Saves or switches page

[ Bonus Content Unlock Flow ]
Tap Locked Coloring Page (e.g., "Dino Adventure")
         │
         ▼
[ Parental Gate Dialog ] ──(Incorrect answer)──> Shake animation & refresh question
         │ (Correct answer by adult)
         ▼
[ Ad Load & Presentation ]
  • Rewarded Video Ad: Plays kid-safe G-rated ad ──> Grants bonus unlock badge
  • Interstitial Ad: Clean transition ad between coloring packs
```

### Visual Identity & Layout
- **Aesthetic Direction**: Vibrant, joyful, high-contrast kid-friendly canvas paired with a clean, dark-mode developer inspector and code hub.
- **Color Palette**:
  - Dominant Neutral Canvas: Warm cream paper (`#FDFBF7`) for the drawing studio; deep slate (`#0F172A`) for developer inspectors and code viewer.
  - Playful Accent Palette: Primary kid blue (`#3B82F6`), sunny yellow (`#FBBF24`), cheerful coral (`#F43F5E`), and lime green (`#10B981`).
  - Compliance Safe Buffer: Crisp neutral border (`#E2E8F0`) framing the AdMob bottom banner with a subtle "Child-Safe Family Ad" regulatory label.
- **Ergonomics & Toddler Safety Rules**:
  - **No Overlap Zone**: Canvas `pointer-events` strictly isolated from banner touch area; bottom banner has an explicit `h-[60px]` height with $16\text{px}$ dead-zone spacer.
  - **Parental Gate Modal**: High-contrast, large touch targets ($56\text{px}$) with plain numbers to verify adult numeracy.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale | Alternatives Considered |
| :--- | :--- | :--- | :--- |
| **COPPA & GDPR Flags** | Set globally in `MobileAds.instance.updateRequestConfiguration` before `initialize()` | Enforces G-rating and child-directed status for every ad request across the entire app lifecycle before any banner or interstitial loads. | Setting flags per-request (risks accidental leaks or unconfigured ad instances). |
| **NPA Ad Requests** | `AdRequest(extras: {'npa': '1'})` on all ad requests | Required by Google Play Families Policy: ads must never use behavioral profiling or personalized tracking IDs. | Standard `AdRequest()` without extras (risks Google Play rejection). |
| **Banner Isolation** | Rigid bottom dock with $16\text{px}$ visual margin + explicit divider | Google Play enforces strict rules against placing ads where toddlers can accidentally tap them while drawing. | Floating overlay banner (prohibited by Play Families policy). |
| **Mid-Stroke Guard** | `isDrawingActive` flag checked before presenting any interstitial or rewarded ad | Prevents interrupting a child's creative flow, avoiding frustrated toddlers and accidental ad clicks. | Timer-based ad intervals (frequently interrupts active drawing). |

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Flutter App Architecture                         │
│                                                                        │
│   ┌─────────────────────┐                 ┌─────────────────────────┐  │
│   │    main.dart        │                 │     ad_helper.dart      │  │
│   │  - ensureInit()     │ ──────────────> │  - Singleton instance   │  │
│   │  - AdMob init()     │                 │  - RequestConfiguration │  │
│   └──────────┬──────────┘                 │    * COPPA: yes         │  │
│              │                            │    * G-Rating: g        │  │
│              ▼                            │    * UnderAgeConsent:yes│  │
│   ┌─────────────────────┐                 │  - NPA AdRequest extras │  │
│   │ KidsDrawingScreen   │                 │  - BannerAd loader      │  │
│   │  - Drawing Canvas   │                 │  - RewardedAd loader    │  │
│   │  - Stroke Listener  │ ──────────────> │  - InterstitialAd loader│  │
│   │  - Bottom Safe Area │                 └────────────┬────────────┘  │
│   └──────────┬──────────┘                              │               │
│              │                                         ▼               │
│              ▼                            ┌─────────────────────────┐  │
│   ┌─────────────────────┐                 │ Google Mobile Ads SDK   │  │
│   │ ParentalGateDialog  │ ──────────────> │ (AdMob Test / Prod IDs) │  │
│   │  - Math Challenge   │                 └─────────────────────────┘  │
│   └─────────────────────┘                                              │
└────────────────────────────────────────────────────────────────────────┘
```

### Interactive State Mapping
- `isDrawing`: Boolean toggled on pointer down and up; disables ad pop-ups.
- `parentalGateState`: Closed, Pending, Verified, Failed (with shake visual).
- `unlockedColoringPages`: Set of unlocked bonus coloring book IDs rewarded via ad views.
- `adMobConfig`: Reactive state holding test IDs vs. custom live production IDs, instantly updated in all exportable Flutter files.

---

## 5. Verification & Review Plan

1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to ensure clean TypeScript/React builds.
2. **COPPA / Policy Validation**: Verify that `tagForChildDirectedTreatment`, `maxAdContentRating: 'G'`, `tagForUnderAgeOfConsent`, and `npa: '1'` are documented and implemented across all code snippets and interactive demos.
3. **Interactive Testing**: Verify drawing strokes, undo/redo, color picking, math parental gate unlocking, and safe banner buffer rendering.
