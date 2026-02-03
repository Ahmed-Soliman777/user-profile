import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

export function GenerateToken(payload: JWTPayload): string {
  const privateKey = process.env.JWT_SECRET as string;

  const token = jwt.sign(payload, privateKey, {
    expiresIn: "1d",
  });

  return token;
}

export function SetCookie(payload: JWTPayload): string {
  const token = GenerateToken(payload);

  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cookie;
}
