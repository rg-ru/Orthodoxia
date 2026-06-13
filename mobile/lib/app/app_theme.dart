import 'package:flutter/material.dart';

class AppTheme {
  static const Color background = Color(0xFFFFFFFF);
  static const Color surface = Color(0xFFF6F5F4);
  static const Color primaryText = Color(0xFF000000);
  static const Color secondaryText = Color(0xFF615D59);
  static const Color border = Color(0xFFDFDCD9);
  static const Color accent = Color(0xFF2383E2);

  static const Color darkBackground = Color(0xFF191919);
  static const Color darkSurface = Color(0xFF242424);
  static const Color darkSecondaryText = Color(0xFFB0B0B0);

  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Inter',
      scaffoldBackgroundColor: background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: accent,
        brightness: Brightness.light,
        surface: surface,
      ),
      textTheme: _textTheme(primaryText, secondaryText),
      cardTheme: _cardTheme(surface),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: accent,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryText,
          minimumSize: const Size.fromHeight(48),
          side: const BorderSide(color: border),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  static ThemeData dark() {
    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Inter',
      scaffoldBackgroundColor: darkBackground,
      colorScheme: ColorScheme.fromSeed(
        seedColor: accent,
        brightness: Brightness.dark,
        surface: darkSurface,
      ),
      textTheme: _textTheme(Colors.white, darkSecondaryText),
      cardTheme: _cardTheme(darkSurface),
    );
  }

  static TextTheme _textTheme(Color primary, Color secondary) {
    return TextTheme(
      headlineLarge: TextStyle(
        fontSize: 32,
        height: 1.2,
        fontWeight: FontWeight.w600,
        color: primary,
      ),
      headlineMedium: TextStyle(
        fontSize: 24,
        height: 1.25,
        fontWeight: FontWeight.w600,
        color: primary,
      ),
      headlineSmall: TextStyle(
        fontSize: 20,
        height: 1.3,
        fontWeight: FontWeight.w600,
        color: primary,
      ),
      bodyLarge: TextStyle(fontSize: 16, height: 1.5, color: primary),
      bodyMedium: TextStyle(fontSize: 16, height: 1.5, color: primary),
      bodySmall: TextStyle(fontSize: 14, height: 1.45, color: secondary),
      labelLarge: const TextStyle(fontSize: 16, height: 1.2),
    );
  }

  static CardThemeData _cardTheme(Color color) {
    return CardThemeData(
      color: color,
      elevation: 2,
      shadowColor: const Color.fromRGBO(0, 0, 0, 0.08),
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }
}
