import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../app/app_config.dart';
import '../domain/auth_failure.dart';

class AuthCallbackHandler {
  const AuthCallbackHandler({required SupabaseClient client}) : _client = client;

  final SupabaseClient _client;

  Future<void> handleCallback(Uri uri) async {
    final failure = failureFromUri(uri);
    if (failure != null) {
      throw failure;
    }

    if (!isAuthCallback(uri)) {
      return;
    }

    final code = _value(uri, 'code');
    if (code == null || code.isEmpty || _client.auth.currentSession != null) {
      return;
    }

    await _client.auth.exchangeCodeForSession(code);
  }

  bool isAuthCallback(Uri uri) {
    return uri.scheme == AppConfig.authCallbackScheme &&
        uri.host == AppConfig.authCallbackHost;
  }

  AuthFailure? failureFromUri(Uri uri) {
    if (!isAuthCallback(uri)) {
      return null;
    }

    final error = _value(uri, 'error');
    final errorCode = _value(uri, 'error_code') ?? error;
    final description = _value(uri, 'error_description');

    if (error == null && errorCode == null && description == null) {
      return null;
    }

    return AuthFailure(
      _messageForCode(errorCode, description),
      code: errorCode,
    );
  }

  static String? _value(Uri uri, String key) {
    final queryValue = uri.queryParameters[key];
    if (queryValue != null && queryValue.isNotEmpty) {
      return queryValue;
    }

    if (uri.fragment.isEmpty) {
      return null;
    }

    return Uri.splitQueryString(uri.fragment)[key];
  }

  static String _messageForCode(String? code, String? description) {
    final normalized = '${code ?? ''} ${description ?? ''}'.toLowerCase();

    if (normalized.contains('redirect_uri_mismatch')) {
      return 'Google sign-in is blocked because the redirect URL is not '
          'allowed in Supabase.';
    }

    if (normalized.contains('invalid_credentials')) {
      return 'Google credentials were rejected. Check the Supabase Google '
          'provider configuration.';
    }

    if (normalized.contains('cancel')) {
      return 'Google sign-in was cancelled.';
    }

    return description?.isNotEmpty == true
        ? description!
        : 'Google sign-in could not be completed.';
  }
}
