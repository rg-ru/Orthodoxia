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
  --dart-define=SUPABASE_ANON_KEY=sb_publishable_jIAPtPMw9qM0urofEyYSWg_mJLztHPA
```

The Supabase anon key is public client configuration. Do not use a `service_role` key in the Flutter app.

## Google Auth

Supabase hosted OAuth works with:

- Android package name: `com.orthodoxia.app`
- iOS bundle id: `com.orthodoxia.app`
- Redirect URL: `com.orthodoxia.app://login-callback/`

Add the redirect URL to the Supabase Auth redirect allow list.

For native Google Sign-In with `google_sign_in`, provide:

- `GOOGLE_WEB_CLIENT_ID`
- `GOOGLE_IOS_CLIENT_ID` for iOS

When those values are present, the auth repository signs in with a Google ID token through Supabase. Otherwise it uses Supabase OAuth redirect flow.
