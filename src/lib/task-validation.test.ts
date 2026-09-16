import { describe, expect, it } from "vitest";
import { taskCreateSchema } from "./task-validation";

describe("taskCreateSchema", () => {
  it("accepts a valid task", () => {
    const value = taskCreateSchema.parse({
      title: "Ship task application",
      description: "Complete the implementation and verify the main user flows.",
      status: "IN_PROGRESS",
      dueDate: "2026-09-18",
    });
    expect(value.status).toBe("IN_PROGRESS");
  });

  it("rejects invalid input", () => {
    const result = taskCreateSchema.safeParse({
      title: "A",
      description: "no",
      status: "UNKNOWN",
      dueDate: "tomorrow",
    });
    expect(result.success).toBe(false);
  });
});
