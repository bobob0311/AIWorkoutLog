"use client";

import styled from "@emotion/styled";

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const FieldWrap = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #374151;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 15px;
`;

export function PasswordField({ value, onChange }: PasswordFieldProps) {
  return (
    <FieldWrap>
      <span>비밀번호</span>
      <Input
        aria-label="비밀번호"
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="비밀번호를 입력하세요"
      />
    </FieldWrap>
  );
}

