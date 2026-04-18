"use client";

import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import type { AuthResult, LoginAttempt, PublicProfile } from "@/entities/profile/model/types";
import { ProfileSelector } from "@/features/select-profile/ui/profile-selector";
import { PasswordField } from "@/features/unlock-with-password/ui/password-field";

type LoginPanelProps = {
  profiles: PublicProfile[];
  onLogin: (attempt: LoginAttempt) => Promise<AuthResult>;
  onSuccess: (redirectTo: string) => void;
};

const Panel = styled.section`
  width: min(100%, 420px);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 14px;
  padding: 14px 16px;
  background: #111827;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #dc2626;
`;

export function LoginPanel({ profiles, onLogin, onSuccess }: LoginPanelProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(selectedProfileId && password.trim()) && !isSubmitting;
  }, [isSubmitting, password, selectedProfileId]);

  const handleSubmit = async () => {
    if (!selectedProfileId || !password.trim()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const result = await onLogin({
      profileId: selectedProfileId,
      password,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.errorMessage ?? "로그인에 실패했습니다.");
      return;
    }

    onSuccess(result.redirectTo ?? "/calendar");
  };

  return (
    <Panel>
      <div>
        <Title>운동 기록장</Title>
        <Description>프로필을 선택하고 비밀번호를 입력해 기록을 이어가세요.</Description>
      </div>

      <ProfileSelector
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        onSelect={setSelectedProfileId}
      />

      <PasswordField value={password} onChange={setPassword} />

      {errorMessage ? <ErrorText>{errorMessage}</ErrorText> : null}

      <SubmitButton type="button" disabled={!canSubmit} onClick={handleSubmit}>
        로그인
      </SubmitButton>
    </Panel>
  );
}

