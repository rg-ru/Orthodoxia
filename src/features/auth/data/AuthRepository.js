import { getSupabaseClient } from "../../../shared/supabaseClient.js?v=16";
import { createAuthSession } from "../domain/AuthSession.js?v=16";

export class AuthRepository {
  constructor({ clientFactory = getSupabaseClient } = {}) {
    this.clientFactory = clientFactory;
  }

  async getSession() {
    const client = this.clientFactory();
    const { data, error } = await client.auth.getSession();
    throwIfError(error);
    return createAuthSession(data);
  }

  onAuthStateChange(callback) {
    const client = this.clientFactory();
    const { data } = client.auth.onAuthStateChange((event, session) => {
      callback(event, createAuthSession({ session }));
    });
    return data.subscription;
  }

  async signInWithEmail(email, options = {}) {
    const client = this.clientFactory();
    const { data, error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: options.shouldCreateUser ?? true,
        emailRedirectTo: options.emailRedirectTo ?? getDefaultRedirectUrl()
      }
    });
    throwIfError(error);
    return data;
  }

  async verifyEmailOtp({ email, token }) {
    const client = this.clientFactory();
    const { data, error } = await client.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: "email"
    });
    throwIfError(error);
    return createAuthSession(data);
  }

  async signUpWithPassword({ email, password, displayName = "" }) {
    const client = this.clientFactory();
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim()
        },
        emailRedirectTo: getDefaultRedirectUrl()
      }
    });
    throwIfError(error);
    return createAuthSession(data);
  }

  async signInWithPassword({ email, password }) {
    const client = this.clientFactory();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    throwIfError(error);
    return createAuthSession(data);
  }

  async signInWithGoogle(options = {}) {
    return this.signInWithOAuth("google", options);
  }

  async signInWithOAuth(provider, options = {}) {
    const client = this.clientFactory();
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: options.redirectTo ?? getDefaultRedirectUrl()
      }
    });
    throwIfError(error);
    return data;
  }

  async signInAnonymously(metadata = {}) {
    const client = this.clientFactory();
    const { data, error } = await client.auth.signInAnonymously({
      options: {
        data: {
          account_mode: "guest",
          ...metadata
        }
      }
    });
    throwIfError(error);
    return createAuthSession(data);
  }

  async signOut() {
    const client = this.clientFactory();
    const { error } = await client.auth.signOut();
    throwIfError(error);
  }
}

function getDefaultRedirectUrl() {
  if (globalThis.location?.protocol === "file:") {
    return "https://rg-ru.github.io/Orthodoxia/";
  }

  return globalThis.location?.origin
    ? `${globalThis.location.origin}${globalThis.location.pathname}`
    : undefined;
}

function throwIfError(error) {
  if (error) {
    throw error;
  }
}

export const authRepository = new AuthRepository();
