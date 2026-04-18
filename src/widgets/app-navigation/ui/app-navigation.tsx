"use client";

import Link from "next/link";
import styled from "@emotion/styled";

type NavigationKey = "calendar" | "analytics" | "detail";

type AppNavigationProps = {
  current: NavigationKey;
  date?: string;
};

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
`;

const LinkRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: ${({ $active }) => ($active ? "none" : "1px solid #d1d5db")};
  background: ${({ $active }) => ($active ? "#111827" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
`;

const Current = styled.strong`
  font-size: 14px;
  color: #111827;
`;

function getCurrentLabel(current: NavigationKey) {
  if (current === "calendar") return "달력";
  if (current === "analytics") return "통계";
  return "날짜 상세";
}

export function AppNavigation({ current, date }: AppNavigationProps) {
  return (
    <Nav aria-label="앱 주요 이동">
      <LinkRow>
        <NavLink href="/calendar" $active={current === "calendar"}>
          달력
        </NavLink>
        <NavLink href="/analytics" $active={current === "analytics"}>
          통계
        </NavLink>
        {date ? (
          <NavLink href={`/calendar/${date}`} $active={current === "detail"}>
            {date} 기록
          </NavLink>
        ) : null}
      </LinkRow>
      <Current aria-label="현재 화면">{getCurrentLabel(current)}</Current>
    </Nav>
  );
}
