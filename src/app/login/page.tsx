import { listPublicProfiles } from "@/entities/profile/model/profile-service";
import { LoginPageClient } from "./login-page-client";

export default async function LoginPage() {
  const profiles = await listPublicProfiles();

  return <LoginPageClient profiles={profiles} />;
}

