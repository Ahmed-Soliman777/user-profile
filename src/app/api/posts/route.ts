import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { VerifyToken } from "@/app/utils/verifyToken";
import { CreatePostDTO } from "@/app/utils/dtos";
import { CreatePost } from "@/app/utils/schema";

/**
 * @route ~/api/users/posts
 * @description get user posts
 * @access private
 */

export async function GET(request: NextRequest) {
  try {
    const userPayload = VerifyToken(request);

    if (userPayload === null) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
      include: {
        Posts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }

    return NextResponse.json({ posts: user.Posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

/**
 * @route ~/api/users/posts
 * @description create user posts
 * @access private
 */

export async function POST(request: NextRequest) {
  try {
    const userPayload = VerifyToken(request);

    if (userPayload === null) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    const body = (await request.json()) as CreatePostDTO;

    const validation = CreatePost.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const post = await prisma.post.create({
      data: {
        TextContent: body.TextContent || "",
        Files: body.Files,
        userId: userPayload.id,
      },
    });

    return NextResponse.json(
      { message: "Post created successfully", post: post },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
