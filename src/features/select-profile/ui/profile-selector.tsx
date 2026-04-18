"use client";

import styled from "@emotion/styled";
import type { PublicProfile } from "@/entities/profile/model/types";

type ProfileSelectorProps = {
  profiles: PublicProfile[];
  selectedProfileId: string | null;
  onSelect: (profileId: string) => void;
};

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

const ItemButton = styled.button<{ $selected: boolean }>`
  border: 1px solid ${({ $selected }) => ($selected ? "#111827" : "#d1d5db")};
  background: ${({ $selected }) => ($selected ? "#eef3ff" : "#ffffff")};
  color: #111827;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export function ProfileSelector({ profiles, selectedProfileId, onSelect }: ProfileSelectorProps) {
  return (
    <List>
      {profiles.map((profile) => (
        <ItemButton
          key={profile.id}
          type="button"
          $selected={selectedProfileId === profile.id}
          onClick={() => onSelect(profile.id)}
        >
          {profile.name}
        </ItemButton>
      ))}
    </List>
  );
}

