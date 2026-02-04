import { POST } from "@/app/api/users/register/route";
import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn().mockResolvedValue("fake-salt"),
  hash: jest.fn().mockResolvedValue("hashed-password"),
}));

jest.mock("@/app/utils/generateToken", () => ({
  SetCookie: jest.fn().mockReturnValue("fake-cookie-string"),
}));

describe("POST /api/users/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if the email already exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      Email: "test@example.com",
    });

    const req = new NextRequest("http://localhost:3000/api/users/register", {
      method: "POST",
      body: JSON.stringify({
        FirstName: "John",
        LastName: "Doe",
        Email: "test@example.com",
        Password: "P@ssword123",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("This email already exists!!!🙄");
  });

  it("should create a new user successfully and return 201", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const mockUser = {
      id: 123,
      FirstName: "John",
      LastName: "Doe",
      Email: "new@example.com",
      Image: "profile.jpg",
    };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const req = new NextRequest("http://localhost:3000/api/users/register", {
      method: "POST",
      body: JSON.stringify({
        FirstName: "John",
        LastName: "Doe",
        Email: "new@example.com",
        Password: "P@ssword123",
        Image: "profile.jpg",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("user created successfully");
    expect(data.CreateNewUser).toEqual(mockUser);
    expect(response.headers.get("Set-Cookie")).toBe("fake-cookie-string");
  });

  it("should return 500 if an internal server error occurs", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB Connection Failed"),
    );

    const req = new NextRequest("http://localhost:3000/api/users/register", {
      method: "POST",
      body: JSON.stringify({
        FirstName: "John",
        LastName: "Doe",
        Email: "error@example.com",
        Password: "P@ssword123",
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});
