# android/app/proguard-rules.pro
# ==============================================================================
# R8 / PROGUARD OPTIMIZATION & SHRINKING RULES FOR GOOGLE MOBILE ADS SDK
# ==============================================================================

# 1. Keep Google Mobile Ads SDK public classes and interfaces
-keep class com.google.android.gms.ads.** { *; }
-keep interface com.google.android.gms.ads.** { *; }

# 2. Keep AdMob mediation adapters
-keep class com.google.ads.mediation.** { *; }
-keep interface com.google.ads.mediation.** { *; }

# 3. Preserve essential annotation attributes required for reflection
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# 4. Suppress non-critical warnings from optional Google Play Services dependencies
-dontwarn com.google.android.gms.ads.**
-dontwarn com.google.ads.mediation.**

# 5. Standard Flutter framework rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.**  { *; }
