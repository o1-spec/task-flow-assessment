import { z } from "zod";

const dueDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid due date")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
    message: "Choose a valid due date",
  });

const taskFields = {
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title must be 120 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(3000, "Description must be 3,000 characters or fewer"),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  dueDate: dueDateSchema,
};

export const taskCreateSchema = z.object({
  ...taskFields,
  status: taskFields.status.default("TODO"),
});

export const taskUpdateSchema = z
  .object(taskFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field must be provided");

export type TaskInput = z.infer<typeof taskCreateSchema>;
