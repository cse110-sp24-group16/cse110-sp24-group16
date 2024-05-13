import {
  isPhoneNumber,
  isEmail,
  isStrongPassword,
  isDate,
  isHexColor,
} from "../tmp/tmp.js";

// Tests for isPhoneNumber
test("isPhoneNumber - should return true for valid phone number: 123-456-7890", () => {
  expect(isPhoneNumber("123-456-7890")).toBe(true);
});

test("isPhoneNumber - should return true for valid phone number: (123) 456-7890", () => {
  expect(isPhoneNumber("(123) 456-7890")).toBe(true);
});

test("isPhoneNumber - should return false for invalid phone number: 12345", () => {
  expect(isPhoneNumber("12345")).toBe(false);
});

test("isPhoneNumber - should return false for invalid phone number: phone-number", () => {
  expect(isPhoneNumber("phone-number")).toBe(false);
});

// Tests for isEmail
test("isEmail - should return true for valid email: test@example.com", () => {
  expect(isEmail("test@example.com")).toBe(true);
});

test("isEmail - should return true for valid email: user@site.org", () => {
  expect(isEmail("user@site.org")).toBe(true);
});

test("isEmail - should return false for invalid email: invalid-email", () => {
  expect(isEmail("invalid-email")).toBe(false);
});

test("isEmail - should return false for invalid email: user.name@domain.co.uk", () => {
  expect(isEmail("user.name@domain.co.uk")).toBe(false); // More than 3 characters
});

// Tests for isStrongPassword
test("isStrongPassword - should return true for strong password: Abc1234", () => {
  expect(isStrongPassword("Abc1234")).toBe(true);
});

test("isStrongPassword - should return true for strong password: Secure_Pass", () => {
  expect(isStrongPassword("Secure_Pass")).toBe(true);
});

test("isStrongPassword - should return false for weak password: abc", () => {
  expect(isStrongPassword("abc")).toBe(false); // Less than 4 characters
});

test("isStrongPassword - should return false for weak password: 1Password", () => {
  expect(isStrongPassword("1Password")).toBe(false); // First character not a letter
});

// Tests for isDate
test("isDate - should return true for valid date: 12/25/2023", () => {
  expect(isDate("12/25/2023")).toBe(true);
});

test("isDate - should return true for valid date: 3/4/2024", () => {
  expect(isDate("3/4/2024")).toBe(true);
});

test("isDate - should return false for invalid date: 12-25-2023", () => {
  expect(isDate("12-25-2023")).toBe(false); // Incorrect separator
});

test("isDate - should return false for invalid date: 400/13/2023", () => {
  expect(isDate("400/13/2023")).toBe(false); // Invalid day/month but valid regex
});

// Tests for isHexColor
test("isHexColor - should return true for valid hex color: #a1c", () => {
  expect(isHexColor("#a1c")).toBe(true);
});

test("isHexColor - should return true for valid hex color: #aabbcc", () => {
  expect(isHexColor("#aabbcc")).toBe(true);
});

test("isHexColor - should return false for invalid hex color: xyz", () => {
  expect(isHexColor("xyz")).toBe(false);
});

test("isHexColor - should return false for invalid hex color: #1234", () => {
  expect(isHexColor("#1234")).toBe(false); // Incorrect length
});
