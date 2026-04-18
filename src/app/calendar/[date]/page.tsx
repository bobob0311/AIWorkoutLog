import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAuth } from "@/entities/profile/model/profile-service";
import { AUTH_COOKIE_NAME, getSessionFromCookie } from "@/shared/lib/auth-cookie";
import { CalendarDetailClientPage } from "./client-page";

type CalendarDetailPageProps = {
  params: Promise<{ date: string }>;
};

export default async function CalendarDetailPage({ params }: CalendarDetailPageProps) {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore.get(AUTH_COOKIE_NAME));
  const guard = requireAuth(session?.profileId ?? null);

  if (!guard.authorized) {
    redirect(guard.redirectTo ?? "/login");
  }

  const { date } = await params;

  return <CalendarDetailClientPage date={date} />;
}
