import { z } from "zod";

export const SendEmailSchema = z
  .object({
    to: z.string().email("Invalid recipient email"),
    subject: z.string().min(1, "Subject is required").max(200),
    body: z.string().max(5000).optional(),
    html: z.string().max(50000).optional(),
    from_name: z.string().max(100).optional(),
    reply_to: z.string().email().optional(),
  })
  .refine((data) => data.body || data.html, {
    message: "At least one of body or html is required",
  });

export const CreateApiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(64),
});

export const UpdateUserLimitSchema = z.object({
  userId: z.string().min(1),
  dailyLimit: z.number().min(1).max(1000),
});
