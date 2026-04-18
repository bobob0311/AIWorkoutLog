import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const AUTH_COOKIE_NAME = "health-log-session";

export type AuthSession = {
  profileId: string;
};

export function serializeAuthSession(profileId: string): string {
  return JSON.stringify({ profileId });
}

export function parseAuthSession(value: string | undefined): AuthSession | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AuthSession>;
    if (!parsed.profileId) {
      return null;
    }
    return { profileId: parsed.profileId };
  } catch {
    return null;
  }
}

export function getSessionFromCookie(cookie: RequestCookie | undefined): AuthSession | null {
  return parseAuthSession(cookie?.value);
}

