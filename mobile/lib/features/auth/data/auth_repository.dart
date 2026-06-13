import 'dart:async';
import 'dart:io';

import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../app/app_config.dart';
import '../domain/auth_failure.dart';
import 'auth_callback_handler.dart';

class AuthRepository {
  AuthRepository({
    required AppConfig config,
    required SupabaseClient supabaseClient,
  })  : _config = config,
        _client = supabaseClient,
        _callbackHandler = AuthCallbackHandler(client: supabaseClient);

  final AppConfig _config;
  final SupabaseClient _client;
  final AuthCallbackHandler _callbackHandler;

  Session? get currentSession => _client.auth.currentSession;

  User? get currentUser => _client.auth.currentUser;

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  Future<void> initialize() => Future<void>.value();

  Future<void> signInWithGoogle() async {
    try {
      _assertRedirectConfiguration();

      final opened = await _client.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: _config.authRedirectUrl,
        authScreenLaunchMode: LaunchMode.externalApplication,
        scopes: 'email profile',
      );

      if (!opened) {
        throw const AuthFailure(
          'Google sign-in was cancelled before the browser opened.',
          code: 'cancelled',
        );
      }
    } on AuthException catch (error) {
      throw _failureFromAuthException(error);
    } on SocketException catch (error) {
      throw AuthFailure(
        'Network connection failed. Check your internet connection.',
        code: 'network_error',
        cause: error,
      );
    } on TimeoutException catch (error) {
      throw AuthFailure(
        'The sign-in request timed out. Try again.',
        code: 'timeout',
        cause: error,
      );
    } on AuthFailure {
      rethrow;
    } on Object catch (error) {
      throw AuthFailure(
        'Sign-in could not be completed. Try again.',
        cause: error,
      );
    }
  }

  Future<void> signOut() async {
    try {
      await _client.auth.signOut();
    } on AuthException catch (error) {
      throw _failureFromAuthException(error);
    } on SocketException catch (error) {
      throw AuthFailure(
        'Network connection failed. Check your internet connection.',
        code: 'network_error',
        cause: error,
      );
    } on Object catch (error) {
      throw AuthFailure('Logout failed. Try again.', cause: error);
    }
  }

  Future<void> handleAuthCallback(Uri uri) {
    return _callbackHandler.handleCallback(uri);
  }

  void _assertRedirectConfiguration() {
    if (_config.hasExpectedAuthRedirect) {
      return;
    }

    throw AuthFailure(
      'OAuth redirect URL must be ${AppConfig.defaultAuthRedirectUrl}.',
      code: 'redirect_uri_mismatch',
    );
  }

  AuthFailure _failureFromAuthException(AuthException error) {
    final normalized = error.message.toLowerCase();

    if (normalized.contains('redirect_uri_mismatch')) {
      return AuthFailure(
        'Google sign-in is blocked because ${_config.authRedirectUrl} is not '
        'allowed in Supabase.',
        code: 'redirect_uri_mismatch',
        cause: error,
      );
    }

    if (normalized.contains('invalid_credentials')) {
      return AuthFailure(
        'Google credentials were rejected. Check the Supabase Google provider '
        'configuration.',
        code: 'invalid_credentials',
        cause: error,
      );
    }

    if (normalized.contains('cancel')) {
      return AuthFailure(
        'Google sign-in was cancelled.',
        code: 'cancelled',
        cause: error,
      );
    }

    return AuthFailure(error.message, cause: error);
  }
}
