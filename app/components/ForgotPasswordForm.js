"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../_utils/firebase";

export default function ForgotPasswordForm() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send password reset email");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="bg-background"
        />
      </div>
      {error && <p className="text-destructive text-center">{error}</p>}
      {success && (
        <p className="text-green-500 dark:text-green-400 text-center">
          Password reset instructions have been sent to your email.
        </p>
      )}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Reset Password
      </Button>
    </form>
  );
}
