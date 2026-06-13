import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  const AppConfig({
    required this.supabaseUrl,
    required this.supabaseAnonKey,
    required this.authRedirectUrl,
    required this.googleWebClientId,
    required this.googleIosClientId,
  });

  final String supabaseUrl;
  final String supabaseAnonKey;
  final String authRedirectUrl;
  final String googleWebClientId;
  final String googleIosClientId;

  static AppConfig fromEnvironment() {
    final supabaseUrl = _read('SUPABASE_URL');
    final supabaseAnonKey = _read('SUPABASE_ANON_KEY');

    if (supabaseUrl.isEmpty || supabaseAnonKey.isEmpty) {
      throw const FormatException(
        'SUPABASE_URL and SUPABASE_ANON_KEY must be provided.',
      );
    }

    return AppConfig(
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseAnonKey,
      authRedirectUrl: _read(
        'AUTH_REDIRECT_URL',
        fallback: 'com.orthodoxia.app://login-callback/',
      ),
      googleWebClientId: _read('GOOGLE_WEB_CLIENT_ID'),
      googleIosClientId: _read('GOOGLE_IOS_CLIENT_ID'),
    );
  }

  bool get hasNativeGoogleConfiguration => googleWebClientId.isNotEmpty;

  static String _read(String key, {String fallback = ''}) {
    final value = _dartDefine(key);
    if (value.isNotEmpty) {
      return value;
    }

    return dotenv.env[key]?.trim() ?? fallback;
  }

  static String _dartDefine(String key) {
    switch (key) {
      case 'SUPABASE_URL':
        return const String.fromEnvironment('SUPABASE_URL').trim();
      case 'SUPABASE_ANON_KEY':
        return const String.fromEnvironment('SUPABASE_ANON_KEY').trim();
      case 'AUTH_REDIRECT_URL':
        return const String.fromEnvironment('AUTH_REDIRECT_URL').trim();
      case 'GOOGLE_WEB_CLIENT_ID':
        return const String.fromEnvironment('GOOGLE_WEB_CLIENT_ID').trim();
      case 'GOOGLE_IOS_CLIENT_ID':
        return const String.fromEnvironment('GOOGLE_IOS_CLIENT_ID').trim();
      default:
        return '';
    }
  }
}
