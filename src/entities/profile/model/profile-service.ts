import { createHash } from "node:crypto";
import type { AuthGuardResult, AuthResult, Profile, PublicProfile } from "./types";

const mockProfiles: Profile[] = [
  {
    id: "profile-1",
    name: "민수",
    passwordHash: hashPassword("1234"),
  },
  {
    id: "profile-2",
    name: "지현",
    passwordHash: hashPassword("1111"),
  },
];

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function listProfiles(): Promise<Profile[]> {
  return mockProfiles;
}

export async function listPublicProfiles(): Promise<PublicProfile[]> {
  const profiles = await listProfiles();
  return profiles.map(({ id, name }) => ({ id, name }));
}

export async function verifyProfilePassword(profileId: string, password: string): Promise<AuthResult> {
  const profiles = await listProfiles();
  const profile = profiles.find((item) => item.id === profileId);

  if (!profile) {
    return {
      success: false,
      errorMessage: "선택한 프로필을 찾을 수 없습니다.",
    };
  }

  if (profile.passwordHash !== hashPassword(password)) {
    return {
      success: false,
      errorMessage: "비밀번호가 올바르지 않습니다.",
    };
  }

  return {
    success: true,
    redirectTo: "/calendar",
  };
}

export function requireAuth(profileId: string | null): AuthGuardResult {
  if (!profileId) {
    return {
      authorized: false,
      redirectTo: "/login",
    };
  }

  return {
    authorized: true,
  };
}

