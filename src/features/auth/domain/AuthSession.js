export class AuthSession {
  constructor({ user = null, session = null, isAnonymous = false } = {}) {
    this.user = user;
    this.session = session;
    this.isAnonymous = Boolean(isAnonymous);
    this.userId = user?.id ?? "";
    this.email = user?.email ?? "";
    Object.freeze(this);
  }
}

export function createAuthSession(data = {}) {
  const user = data.user ?? data.session?.user ?? null;
  const isAnonymous = Boolean(user?.is_anonymous ?? data.session?.user?.is_anonymous);
  return new AuthSession({
    user,
    session: data.session ?? null,
    isAnonymous
  });
}
