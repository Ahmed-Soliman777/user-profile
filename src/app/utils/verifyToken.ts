import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { NextRequest } from "next/server";

export function VerifyToken(request: NextRequest): JWTPayload | null {
  try {
    const JwtToken = request.cookies.get("token");

    const token = JwtToken?.value as string;

    if (!token) return null;

    const UserPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JWTPayload;

    return UserPayload;
  } catch (error) {
    return null;
  }
}

export function verifyTokenForPage(token: string): JWTPayload | null {
  try {
    const userPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JWTPayload;

    if (!userPayload) {
      return null;
    }

    return userPayload;
  } catch (error) {
    return null;
  }
}
