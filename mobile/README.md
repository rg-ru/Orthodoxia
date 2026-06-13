# Orthodoxia Flutter Mobile

This folder contains the Flutter authentication foundation for Orthodoxia.

## Setup

The repository includes `mobile/.env` with the public Supabase URL and publishable anon key you provided. Before running:

```bash
cd mobile
flutter pub get
flutter run
```

The app reads Supabase configuration from environment values through `flutter_dotenv`, with `--dart-define` taking priority for production builds:

```bash
flutter build apk \
  --dart-define=SUPABASE_URL=https://txspopmkxaklvoufxmiz.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=sb_publishable_jIAPtPMw9qM0urofEyYSWg_mJLztHPA \
  --dart-define=AUTH_REDIRECT_URL=io.supabase.flutter://login-callback
```

The Supabase anon key is public client configuration. Do not use a `service_role` key in the Flutter app.

## Google Auth

Supabase hosted OAuth works with:

- Android package name: `com.orthodoxia.app`
- iOS bundle id: `com.orthodoxia.app`
- Flutter redirect URL: `io.supabase.flutter://login-callback`
- Google OAuth callback URL: `https://txspopmkxaklvoufxmiz.supabase.co/auth/v1/callback`

Add `io.supabase.flutter://login-callback` to Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs. Use this exact value with no trailing slash. The value in `AUTH_REDIRECT_URL`, the Android manifest scheme/host, and the iOS URL scheme must stay identical.

The Flutter app uses `supabase.auth.signInWithOAuth(OAuthProvider.google)` and opens Google sign-in in the external browser. Supabase Flutter listens for the deep link, exchanges the PKCE code, restores the session, and emits auth state changes.
