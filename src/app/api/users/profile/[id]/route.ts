import { prisma } from "@/app/lib/prisma";
import { UpdateUserDTO } from "@/app/utils/dtos";
import { UpdateUserSchema } from "@/app/utils/schema";
import { RouteProps } from "@/app/utils/types";
import { VerifyToken } from "@/app/utils/verifyToken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @route ~/api/users/profile/:id
 * @description user profile
 * @access private
 */

export async function GET(request: NextRequest, props: RouteProps) {
  try {
    const { id } = await props.params;
    const CheckUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        FirstName: true,
        LastName: true,
        Email: true,
        CreateAt: true,
        Image: true,
        Posts: true,
      },
    });

    if (!CheckUser) {
      return NextResponse.json(
        { message: "Invalid user ID!" },
        { status: 400 },
      );
    }

    const VerifyUser = VerifyToken(request);

    if (VerifyToken === null || VerifyUser?.id !== CheckUser.id) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    return NextResponse.json({ profile: CheckUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

/**
 * @route ~/api/users/profile/:id
 * @description delete profile
 * @access private
 */

export async function DELETE(request: NextRequest, props: RouteProps) {
  try {
    const { id } = await props.params;
    const CheckUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!CheckUser) {
      return NextResponse.json(
        { message: "Invalid user ID!" },
        { status: 400 },
      );
    }

    const VerifyUser = VerifyToken(request);

    if (VerifyToken === null || VerifyUser?.id !== CheckUser.id) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });

    return NextResponse.json(
      { message: "Profile Deleted Successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

/**
 * @route ~/api/users/profile/:id
 * @description update profile
 * @access private
 */

export async function PUT(request: NextRequest, props: RouteProps) {
  try {
    const { id } = await props.params;
    const CheckUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!CheckUser) {
      return NextResponse.json(
        { message: "Invalid user ID!" },
        { status: 400 },
      );
    }

    const VerifyUser = VerifyToken(request);

    if (VerifyToken === null || VerifyUser?.id !== CheckUser.id) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    const body = (await request.json()) as UpdateUserDTO;

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
      where: { id: parseInt(id) },
      data: {
        FirstName: body.FirstName,
        LastName: body.LastName,
        Email: body.Email,
        Password: body.Password,
        Image: body.Image,
      },
    });

    return NextResponse.json(
      { message: "Profile Updated Successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
