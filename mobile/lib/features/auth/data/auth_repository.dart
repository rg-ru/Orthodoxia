import 'dart:async';
import 'dart:io';

import 'package:google_sign_in/google_sign_in.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../app/app_config.dart';
import '../domain/auth_failure.dart';

class AuthRepository {
  AuthRepository({
    required AppConfig config,
    required SupabaseClient supabaseClient,
    GoogleSignIn? googleSignIn,
  })  : _config = config,
        _client = supabaseClient,
        _googleSignIn = googleSignIn ?? GoogleSignIn.instance;

  static const List<String> _googleScopes = <String>[
    'openid',
    'email',
    'profile',
  ];

  final AppConfig _config;
  final SupabaseClient _client;
  final GoogleSignIn _googleSignIn;
  bool _googleInitialized = false;

  Session? get currentSession => _client.auth.currentSession;

  User? get currentUser => _client.auth.currentUser;

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  Future<void> initialize() async {
    if (!_config.hasNativeGoogleConfiguration) {
      return;
    }

    try {
      await _googleSignIn.initialize(
        clientId: _config.googleIosClientId.isEmpty
            ? null
            : _config.googleIosClientId,
        serverClientId: _config.googleWebClientId,
      );
      _googleInitialized = true;
    } on Object catch (error) {
      throw AuthFailure(
        'Google Sign-In could not be initialized.',
        cause: error,
      );
    }
  }

  Future<void> signInWithGoogle() async {
    try {
      if (_googleInitialized && _googleSignIn.supportsAuthenticate()) {
        await _signInWithNativeGoogle();
        return;
      }

      await _client.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: _config.authRedirectUrl,
        authScreenLaunchMode: LaunchMode.externalApplication,
      );
    } on AuthException catch (error) {
      throw AuthFailure(error.message, cause: error);
    } on GoogleSignInException catch (error) {
      throw AuthFailure(
        error.description ?? 'Google sign-in was cancelled or failed.',
        cause: error,
      );
    } on SocketException catch (error) {
      throw AuthFailure(
        'Network connection failed. Check your internet connection.',
        cause: error,
      );
    } on TimeoutException catch (error) {
      throw AuthFailure(
        'The sign-in request timed out. Try again.',
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
      if (_googleInitialized) {
        await _googleSignIn.signOut();
      }
    } on AuthException catch (error) {
      throw AuthFailure(error.message, cause: error);
    } on SocketException catch (error) {
      throw AuthFailure(
        'Network connection failed. Check your internet connection.',
        cause: error,
      );
    } on Object catch (error) {
      throw AuthFailure('Logout failed. Try again.', cause: error);
    }
  }

  Future<void> _signInWithNativeGoogle() async {
    final googleUser = await _googleSignIn.authenticate();
    final googleAuth = googleUser.authentication;
    final idToken = googleAuth.idToken;
    final authorization =
        await googleUser.authorizationClient.authorizationForScopes(
              _googleScopes,
            ) ??
            await googleUser.authorizationClient.authorizeScopes(_googleScopes);

    final accessToken = authorization.accessToken;

    if (idToken == null || idToken.isEmpty) {
      throw const AuthFailure('Google did not return an ID token.');
    }

    if (accessToken.isEmpty) {
      throw const AuthFailure('Google did not return an access token.');
    }

    await _client.auth.signInWithIdToken(
      provider: OAuthProvider.google,
      idToken: idToken,
      accessToken: accessToken,
    );
  }
}
