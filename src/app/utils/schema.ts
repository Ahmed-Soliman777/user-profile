import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
);

export const CreateUserSchema = z.object({
  FirstName: z
    .string({ error: "First name is required" })
    .min(2, { error: "First name have to be at least 2 chars" }),

  LastName: z
    .string({ error: "Last name is required" })
    .min(2, { error: "Last name have to be at least 2 chars" }),

  Email: z.email({ error: "Invalid mail" }),

  Password: z.string({ error: "Invalid Password" }).regex(passwordRegex, {
    message:
      "Password should be at least 8 length & includes a char, a symbol and a number",
  }),

  Image: z.string().optional(),
});

export const LoginUserSchema = z.object({
  Email: z.email({ error: "Invalid credentials!" }),
  Password: z.string({ error: "Invalid credentials!" }),
});

export const UpdateUserSchema = z.object({
  FirstName: z
    .string({ error: "First name is required" })
    .min(2, { error: "First name have to be at least 2 chars" })
    .optional(),

  LastName: z
    .string({ error: "Last name is required" })
    .min(2, { error: "Last name have to be at least 2 chars" })
    .optional(),

  Email: z.email({ error: "Invalid mail" }).optional(),

  Password: z
    .string({ error: "Invalid Password" })
    .regex(passwordRegex, {
      message:
        "Password should be at least 8 length & includes a char, a symbol and a number",
    })
    .optional(),

  Image: z.string().optional(),
});

export const CreatePost = z.object({
  TextContent: z.string().min(1).optional(),
  Files: z.array(z.string()).optional(),
});

export const UpdatePost = z.object({
  TextContent: z.string().min(1).optional(),
  Files: z.array(z.string()).optional(),
});
