"use server";

import { cookies } from "next/headers";
import { verifyProfilePassword } from "@/entities/profile/model/profile-service";
import { AUTH_COOKIE_NAME, serializeAuthSession } from "@/shared/lib/auth-cookie";

export async function authenticateProfile(profileId: string, password: string) {
  const result = await verifyProfilePassword(profileId, password);

  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, serializeAuthSession(profileId), {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });
  }

  return result;
}

