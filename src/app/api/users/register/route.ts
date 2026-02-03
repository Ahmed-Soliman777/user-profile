import { prisma } from "@/app/lib/prisma";
import { CreateUserDTO } from "@/app/utils/dtos";
import { CreateUserSchema } from "@/app/utils/schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { JWTPayload } from "@/app/utils/types";
import { SetCookie } from "@/app/utils/generateToken";

/**
 * @route ~/api/users/register
 * @description create a new user
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserDTO;

    const validation = CreateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { Email: body.Email } });

    if (user) {
      return NextResponse.json(
        { message: "This email already exists!!!🙄" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(body.Password, salt);

    const CreateNewUser = await prisma.user.create({
      data: {
        FirstName: body.FirstName,
        LastName: body.LastName,
        Password: hashedPassword,
        Email: body.Email,
      },
      select: {
        id: true,
        FirstName: true,
        LastName: true,
        Email: true,
      },
    });

    const payload: JWTPayload = {
      id: CreateNewUser.id,
      Email: CreateNewUser.Email,
    };

    const cookie = SetCookie(payload);

    return NextResponse.json(
      { message: "user created successfully", CreateNewUser },
      { status: 201, headers: { "Set-Cookie": cookie } },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
