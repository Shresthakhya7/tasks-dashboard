import z from "zod";

export const nameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters");

export const emailSchema = z
    .string()
    .email("Please enter a valid email address");

export const phoneSchema = z
    .string()
    .trim()
    .regex(
        /^(98|97)\d{8}$/,
        "Phone number must be a valid number"
    );

export const salarySchema = z
    .number()
    .min(1000, "Salary must be at least 1,000")
    .max(500000, "Salary cannot exceed 500,000");