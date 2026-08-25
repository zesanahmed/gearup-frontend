import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
