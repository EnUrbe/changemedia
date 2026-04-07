export const ADMIN_SESSION_COOKIE = "cm_admin_session";

const DEFAULT_ADMIN_LOGIN_EMAIL = "admin@changemedia.com";
const DEFAULT_ADMIN_LOGIN_PASSWORD = "changemedia-admin";
const DEFAULT_ADMIN_SESSION_TOKEN = "changemedia-hardcoded-session";

function getConfiguredAdminEmail(): string {
  return (process.env.ADMIN_LOGIN_EMAIL ?? DEFAULT_ADMIN_LOGIN_EMAIL).trim().toLowerCase();
}

function getConfiguredAdminPassword(): string {
  return process.env.ADMIN_LOGIN_PASSWORD ?? DEFAULT_ADMIN_LOGIN_PASSWORD;
}

export function getHardcodedAdminSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? DEFAULT_ADMIN_SESSION_TOKEN;
}

export function getHardcodedAdminEmail(): string {
  return getConfiguredAdminEmail();
}

export function isHardcodedAdminCredential(email: string, password: string): boolean {
  return email.trim().toLowerCase() === getConfiguredAdminEmail() && password === getConfiguredAdminPassword();
}

export function isHardcodedAdminSession(token: string | null | undefined): boolean {
  if (!token) return false;
  return token === getHardcodedAdminSessionToken();
}
