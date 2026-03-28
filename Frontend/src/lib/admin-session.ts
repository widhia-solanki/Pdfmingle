import { createHmac, timingSafeEqual } from "crypto";
import { NextApiRequest } from "next";

export const ADMIN_SESSION_COOKIE_NAME = "pdfmingle_admin_session";
export const ADMIN_SESSION_DURATION_MS = 3 * 60 * 1000;

interface SessionPayload {
  email: string;
  expiresAt: number;
}

const toBase64Url = (value: string) => Buffer.from(value).toString("base64url");

const fromBase64Url = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const getAdminSecret = () => process.env.ADMIN_SESSION_SECRET ?? "";

export const getAdminEmail = () => process.env.ADMIN_EMAIL ?? "";

export const getAdminPassword = () => process.env.ADMIN_PASSWORD ?? "";

export const isAdminAuthConfigured = () =>
  Boolean(getAdminEmail() && getAdminPassword() && getAdminSecret());

const signValue = (value: string) =>
  createHmac("sha256", getAdminSecret()).update(value).digest("base64url");

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const verifyAdminCredentials = (email: string, password: string) => {
  if (!isAdminAuthConfigured()) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const expectedEmail = getAdminEmail().trim().toLowerCase();

  return safeEqual(normalizedEmail, expectedEmail) && safeEqual(password, getAdminPassword());
};

export const createAdminSessionToken = () => {
  const payload: SessionPayload = {
    email: getAdminEmail(),
    expiresAt: Date.now() + ADMIN_SESSION_DURATION_MS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
};

export const parseCookieHeader = (cookieHeader?: string) => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, item) => {
    const [name, ...valueParts] = item.trim().split("=");

    if (!name) {
      return cookies;
    }

    cookies[name] = decodeURIComponent(valueParts.join("="));
    return cookies;
  }, {});
};

export const getAdminSessionTokenFromRequest = (request: NextApiRequest) => {
  const cookies = parseCookieHeader(request.headers.cookie);
  return cookies[ADMIN_SESSION_COOKIE_NAME] ?? "";
};

export const verifyAdminSessionToken = (token: string) => {
  if (!token || !isAdminAuthConfigured()) {
    return null;
  }

  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (!safeEqual(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

    if (payload.email !== getAdminEmail() || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

const getBaseCookieAttributes = () => {
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Strict${secureFlag}`;
};

export const createAdminSessionCookie = (token: string) =>
  `${ADMIN_SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${Math.floor(
    ADMIN_SESSION_DURATION_MS / 1000
  )}; ${getBaseCookieAttributes()}`;

export const clearAdminSessionCookie = () =>
  `${ADMIN_SESSION_COOKIE_NAME}=; Max-Age=0; ${getBaseCookieAttributes()}`;
