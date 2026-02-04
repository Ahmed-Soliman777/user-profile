/**
 * @route ~/api/users/profile/:id
 * @description update profile
 * @access private
 */

import { prisma } from "@/app/lib/prisma";
import { UpdateUserDTO } from "@/app/utils/dtos";
import { UpdateUserSchema } from "@/app/utils/schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateUserDTO;

    const CheckUser = await prisma.user.findUnique({
      where: { Email: body.Email },
    });

    if (!CheckUser) {
      return NextResponse.json(
        { message: "Invalid user Email!" },
        { status: 400 },
      );
    }

    const validation = UpdateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    if (body.Password) {
      const salt = await bcrypt.genSalt(10);
      body.Password = await bcrypt.hash(body.Password as string, salt);
    }

    await prisma.user.update({
      where: { Email: body.Email },
      data: {
        Email: body.Email,
      },
    });

    return NextResponse.json(
      { message: "Password Has Been Reset Successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
