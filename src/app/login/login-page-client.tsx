"use client";

import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import type { PublicProfile } from "@/entities/profile/model/types";
import { LoginPanel } from "@/widgets/login-panel/ui/login-panel";
import { authenticateProfile } from "./actions";

type LoginPageClientProps = {
  profiles: PublicProfile[];
};

const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export function LoginPageClient({ profiles }: LoginPageClientProps) {
  const router = useRouter();

  return (
    <Page>
      <LoginPanel
        profiles={profiles}
        onLogin={({ profileId, password }) => authenticateProfile(profileId, password)}
        onSuccess={(redirectTo) => router.push(redirectTo)}
      />
    </Page>
  );
}

