import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { VerifyToken } from "@/app/utils/verifyToken";

/**
 * @route ~/api/users/logout
 * @description user logout
 * @access private
 */

export async function POST(request: NextRequest) {
  try {
    const VerifyUser = VerifyToken(request);

    if (VerifyUser === null) {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 403 });
    }

    const Cookie = await cookies();

    Cookie.delete("token");

    return NextResponse.json(
      { message: "User Logged Out Successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
