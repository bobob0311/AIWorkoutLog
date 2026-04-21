import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAuth } from "@/entities/profile/model/profile-service";
import { AUTH_COOKIE_NAME, getSessionFromCookie } from "@/shared/lib/auth-cookie";
import { AnalyticsCompareClientPage } from "./page.client";

export default async function AnalyticsComparePage() {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore.get(AUTH_COOKIE_NAME));
  const guard = requireAuth(session?.profileId ?? null);

  if (!guard.authorized) {
    redirect(guard.redirectTo ?? "/login");
  }

  return <AnalyticsCompareClientPage />;
}
