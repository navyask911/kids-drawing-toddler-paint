# Kids Drawing: Toddler Paint

A COPPA and Google Play Families compliant Flutter drawing application featuring child-safe monetization via Google Mobile Ads (AdMob), stroke protection, and parental gates.

---

## 🎨 Key Features

- **Kid-Safe Canvas:** Smooth toddler finger painting, rainbow brushes, neon glow pens, and animal coloring templates.
- **Stroke Suppression Sentinel:** Full-screen ads are strictly blocked while the child has their finger on the canvas to prevent interruptions.
- **Physical Safe Buffer:** Bottom-anchored banner ads include a dedicated physical separation buffer to eliminate accidental toddler misclicks.
- **Parental Gate Challenge:** Arithmetic verification (e.g., `4 + 3 = ?`) protects bonus coloring page unlocks, external links, and rewarded video ads.

---

## 🛡️ Policy & COPPA Compliance

This application adheres to the **Google Play Families Policy**, **FTC COPPA**, and **GDPR-K**:

- **Child-Directed Flag:** `tagForChildDirectedTreatment: TagForChildDirectedTreatment.yes`
- **Age Rating Ceiling:** `maxAdContentRating: MaxAdContentRating.g` (strictly G-rated ads)
- **European Underage Protection:** `tagForUnderAgeOfConsent: TagForUnderAgeOfConsent.yes`
- **Non-Personalized Ads (NPA):** All ad requests enforce `extras: {'npa': '1'}` with zero user profiling or tracking.

---

## 📂 Exported Flutter Artifacts

The complete mobile source code generated from AI Studio is structured as:

| File | Purpose |
| :--- | :--- |
| `lib/ad_helper.dart` | AdMob singleton manager with COPPA RequestConfiguration |
| `lib/main.dart` | Drawing pad UI, stroke sentinel, safe banner dock, & parental gate |
| `android/app/src/main/AndroidManifest.xml` | Production AdMob Application ID configuration |
| `android/app/build.gradle` | Release signing wiring and R8 code shrinking rules |
| `android/app/proguard-rules.pro` | Google Mobile Ads R8 preservation rules |
| `android/key.properties.example` | Keystore credentials template |
| `pubspec.yaml` | Flutter dependencies and launcher icons configuration |
| `test/admob_coppa_test.dart` | 12/12 automated unit and invariant test suite |
| `COPPA_CHECKLIST.md` | Play Console Families audit checklist |

---

## 🚀 Local Build & Release Instructions

### 1. Configure Keystore Credentials
1. Copy `android/key.properties.example` to `android/key.properties`.
2. Place your release keystore file (`.jks`) inside `android/app/`.
3. Fill in your credentials:
   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=upload
   storeFile=../app/upload-keystore.jks
