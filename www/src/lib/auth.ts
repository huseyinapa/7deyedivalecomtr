import { User } from "@/types";
import { SignJWT, jwtVerify } from "jose";
import Cookies from "js-cookie";

interface SessionPayload {
  user: User;
  expires: Date;
  [key: string]: any;
}

const secretKey = "stark";
const key = new TextEncoder().encode(secretKey);

/**
 * Encrypts a payload using JWT
 * @param payload - Data to encrypt
 * @returns JWT token
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + 3600)
    .sign(key);
}

/**
 * Decrypts a JWT token
 * @param input - JWT token
 * @returns Decrypted payload
 */
export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as unknown as SessionPayload;
}

/**
 * Creates a user session and sets the cookie
 * @param user - User data
 * @returns Session token
 */
export async function login(user: User): Promise<string> {
  const expires = new Date(Date.now() + 3600 * 1000);
  const session = await encrypt({ user, expires });

  Cookies.set("session", session, { expires, sameSite: "strict" });
  return session;
}

/**
 * Removes the session cookie
 */
export async function logout(): Promise<void> {
  Cookies.remove("session");
}

/**
 * Gets the current session
 * @returns Session payload or null if no session
 */
export async function getSession(): Promise<SessionPayload | null> {
  const session = Cookies.get("session");
  console.log(session);
  if (!session) return null;
  return await decrypt(session);
}

/**
 * Gets the current session token
 * @returns Session token or null if no session
 */
export async function getToken(): Promise<string | null> {
  const session = Cookies.get("session");
  if (!session) return null;
  return session;
}

/**
 * Updates the session with a new expiration time
 * @returns New session token
 */
export async function updateSession(): Promise<string | undefined> {
  const session = Cookies.get("session");

  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 3600 * 1000);

  const newSession = await encrypt(parsed);
  Cookies.set("session", newSession, {
    expires: parsed.expires,
    sameSite: "strict",
  });

  return newSession;
}

// Token'ın geçerliliğini kontrol et
export async function validateToken(token: string): Promise<boolean> {
  try {
    const payload = await decrypt(token);
    const now = new Date();
    return payload.expires > now;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}
