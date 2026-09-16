import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "./auth-validation";

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const valid = registerSchema.parse({
      name: "Alex Morgan",
      email: "alex@example.com",
      password: "SuperSecretPassword123!",
      confirmPassword: "SuperSecretPassword123!",
    });
    expect(valid.email).toBe("alex@example.com");
    expect(valid.name).toBe("Alex Morgan");
  });

  it("normalizes email to lowercase", () => {
    const valid = registerSchema.parse({
      name: "Alex Morgan",
      email: "ALEX@Example.COM",
      password: "SuperSecretPassword123!",
      confirmPassword: "SuperSecretPassword123!",
    });
    expect(valid.email).toBe("alex@example.com");
  });

  it("rejects short passwords under 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Alex Morgan",
      email: "alex@example.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-matching confirmation passwords", () => {
    const result = registerSchema.safeParse({
      name: "Alex Morgan",
      email: "alex@example.com",
      password: "SuperSecretPassword123!",
      confirmPassword: "DifferentPassword123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("rejects invalid emails", () => {
    const result = registerSchema.safeParse({
      name: "Alex Morgan",
      email: "not-an-email",
      password: "SuperSecretPassword123!",
      confirmPassword: "SuperSecretPassword123!",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const valid = loginSchema.parse({
      email: "alex@example.com",
      password: "Password123!",
      rememberMe: true,
    });
    expect(valid.email).toBe("alex@example.com");
    expect(valid.rememberMe).toBe(true);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "alex@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts valid password change", () => {
    const valid = changePasswordSchema.parse({
      currentPassword: "OldPassword123!",
      newPassword: "BrandNewPassword123!",
      confirmNewPassword: "BrandNewPassword123!",
    });
    expect(valid.newPassword).toBe("BrandNewPassword123!");
  });

  it("rejects non-matching new passwords", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPassword123!",
      newPassword: "BrandNewPassword123!",
      confirmNewPassword: "DifferentPassword123!",
    });
    expect(result.success).toBe(false);
  });
});
