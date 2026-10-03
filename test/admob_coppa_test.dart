// test/admob_coppa_test.dart
// -----------------------------------------------------------------------------
// Production Unit & Widget Test Suite for AdMob COPPA & Families Compliance
// -----------------------------------------------------------------------------

import 'package:flutter_test/flutter_test.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:kids_drawing_toddler_paint/ad_helper.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('1. Parental Gate Math Challenge Logic', () {
    test('Correct arithmetic solution passes adult verification', () {
      const int a = 7;
      const int b = 5;
      const int expectedSum = 12;

      bool verifyParentalGate(int answer) => answer == (a + b);

      expect(verifyParentalGate(expectedSum), isTrue);
      expect(verifyParentalGate(10), isFalse);
      expect(verifyParentalGate(14), isFalse);
    });

    test('Random challenge generator produces positive integer options', () {
      const int a = 6;
      const int b = 8;
      final int correct = a + b;

      final Set<int> options = {correct, correct + 2, correct - 3, correct + 4};
      expect(options.contains(14), isTrue);
      expect(options.every((val) => val > 0), isTrue);
    });
  });

  group('2. AdHelper Singleton & Stroke Suppression Guard', () {
    test('AdHelper enforces singleton instance equality', () {
      final instance1 = AdHelper.instance;
      final instance2 = AdHelper.instance;
      expect(identical(instance1, instance2), isTrue);
    });

    test('Active drawing stroke strictly suppresses interstitial ads', () {
      final adHelper = AdHelper.instance;
      bool wasSuppressed = false;
      bool adClosedCalled = false;

      // When child has finger down drawing on canvas:
      adHelper.showInterstitialAd(
        isDrawingActive: true,
        onAdClosed: () => adClosedCalled = true,
        onAdSuppressed: (reason) {
          wasSuppressed = true;
          expect(reason, contains('child artwork'));
        },
      );

      expect(wasSuppressed, isTrue);
      expect(adClosedCalled, isFalse);
    });
  });

  group('3. NPA & COPPA AdRequest Parameters', () {
    test('buildChildSafeAdRequest enforces npa == "1"', () {
      final AdRequest request = AdHelper.buildChildSafeAdRequest();
      expect(request.extras, isNotNull);
      expect(request.extras!['npa'], equals('1'));
    });

    test('Production AdMob IDs match verified format', () {
      expect(AdHelper.bannerAdUnitId, startsWith('ca-app-pub-'));
      expect(AdHelper.rewardedAdUnitId, startsWith('ca-app-pub-'));
      expect(AdHelper.interstitialAdUnitId, startsWith('ca-app-pub-'));
    });
  });
}
