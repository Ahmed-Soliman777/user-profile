import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { VerifyToken } from "@/app/utils/verifyToken";
import { UpdatePost } from "@/app/utils/schema";
import { UpdatePostDTO } from "@/app/utils/dtos";
import { RouteProps } from "@/app/utils/types";

/**
 * @route ~/api/posts/:id
 * @description update post
 * @access private
 */

export async function PUT(request: NextRequest, props: RouteProps) {
  try {
    const { id } = await props.params;

    const userPayload = VerifyToken(request);

    const user = await prisma.user.findUnique({
      where: { id: userPayload?.id },
    });

    if (userPayload === null || userPayload.id !== user?.id) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    const body = (await request.json()) as UpdatePostDTO;

    const validation = UpdatePost.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        TextContent: body.TextContent,
        Files: body.Files,
      },
    });

    return NextResponse.json(
      { message: "Post updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

/**
 * @route ~/api/posts/:id
 * @description delete post
 * @access private
 */

export async function DELETE(request: NextRequest, props: RouteProps) {
  try {
    const { id } = await props.params;

    const userPayload = VerifyToken(request);

    const user = await prisma.user.findUnique({
      where: { id: userPayload?.id },
    });

    if (userPayload === null || userPayload.id !== user?.id) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

/**
 * @route ~/api/posts/:id
 * @description get post
 * @access private
 */

export async function GET(request: NextRequest, props: RouteProps) {
  try {
    const { id } = await props.params;

    const userPayload = VerifyToken(request);

    const user = await prisma.user.findUnique({
      where: { id: userPayload?.id },
    });

    if (userPayload === null || userPayload.id !== user?.id) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    return NextResponse.json({ post: post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
