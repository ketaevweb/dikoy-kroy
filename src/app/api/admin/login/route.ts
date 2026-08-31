// Вход в админку: сверяем пароль с ADMIN_PASSWORD, ставим HttpOnly-cookie
// с хешем. Сам пароль в куке не хранится, срок жизни — 12 часов.

import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";

const bodySchema = z.object({
  password: z.string().min(1).max(200),
});

function adminToken(password: string): string {
  return createHash("sha256").update(`dk-admin:${password}`).digest("hex");
}

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Админка отключена — задайте ADMIN_PASSWORD" },
      { status: 404 }
    );
  }

  let password = "";
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    password = parsed.data.password;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  const match =
    a.length === b.length && timingSafeEqual(a, b);
  if (!match) {
    return NextResponse.json(
      { ok: false, error: "Неверный пароль" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("dk_admin", adminToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
