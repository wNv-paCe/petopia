"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  // Here you would typically validate the user credentials against your database
  // For this example, we'll just check for a dummy username/password
  if (username === "user" && password === "password") {
    // Set a cookie to indicate the user is logged in
    cookies().set("user", username, { secure: true, httpOnly: true });
    redirect("/dashboard");
  }

  return { error: "Invalid username or password" };
}

export async function loginWithGoogle() {
  // Here you would typically implement Google OAuth flow
  // For this example, we'll just pretend it was successful
  const googleUser = { id: "123", name: "Google User" };

  if (googleUser) {
    cookies().set("user", googleUser.name, { secure: true, httpOnly: true });
    redirect("/dashboard");
  }

  return { error: "Failed to login with Google" };
}

export async function signup(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Here you would typically validate the input and create a new user in your database
  // For this example, we'll just do some basic checks
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  // In a real application, you would hash the password and save the user to your database here

  // Set a cookie to indicate the user is logged in
  cookies().set("user", username, { secure: true, httpOnly: true });
  redirect("/dashboard");
}

export async function requestPasswordReset(formData) {
  const email = formData.get("email");

  // Here you would typically:
  // 1. Check if the email exists in your database
  // 2. Generate a unique token for password reset
  // 3. Save the token in your database with an expiration time
  // 4. Send an email to the user with a link containing the token

  // For this example, we'll just pretend we've done all that
  console.log(`Password reset requested for email: ${email}`);

  // In a real application, you would use a proper email sending service
  // For now, we'll just return a success message
  return { success: true };
}
