"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordForm() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    // TODO: Implement Firebase password reset
    console.log("Request password reset");
    setSuccess(true);
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
          className="border-pink-300 focus:border-pink-500"
        />
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && (
        <p className="text-green-500 text-center">
          Password reset instructions have been sent to your email.
        </p>
      )}
      <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
        Reset Password
      </Button>
    </form>
  );
}
