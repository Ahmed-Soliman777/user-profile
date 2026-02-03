import { prisma } from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { LoginUserDTO } from "@/app/utils/dtos";
import { LoginUserSchema } from "@/app/utils/schema";
import bcrypt from "bcryptjs";
import { JWTPayload } from "@/app/utils/types";
import { SetCookie } from "@/app/utils/generateToken";

/**
 * @route ~/api/users/login
 * @description user login
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDTO;

    const validation = LoginUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const CheckUser = await prisma.user.findUnique({
      where: { Email: body.Email },
    });

    if (!CheckUser) {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 400 },
      );
    }

    const password = await bcrypt.compare(body.Password, CheckUser.Password);

    if (!password) {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 400 },
      );
    }

    const payload: JWTPayload = {
      id: CheckUser.id,
      Email: CheckUser.Email,
    };

    const token = SetCookie(payload);

    return NextResponse.json(
      {
        message: `Welcome back ${CheckUser.FirstName} ${CheckUser.LastName} `,
      },
      { status: 200, headers: { "Set-Cookie": token } },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
