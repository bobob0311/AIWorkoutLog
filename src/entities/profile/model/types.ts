export type Profile = {
  id: string;
  name: string;
  passwordHash: string;
};

export type SelectedProfile = {
  profileId: string;
  name: string;
};

export type LoginAttempt = {
  profileId: string;
  password: string;
};

export type AuthResult = {
  success: boolean;
  errorMessage?: string;
  redirectTo?: string;
};

export type PublicProfile = Pick<Profile, "id" | "name">;

export type AuthGuardResult = {
  authorized: boolean;
  redirectTo?: string;
};

