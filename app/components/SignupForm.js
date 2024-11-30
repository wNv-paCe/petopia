"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    // TODO: Implement Firebase signup
    console.log("Sign up new user");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          required
          className="border-pink-300 focus:border-pink-500"
        />
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="border-pink-300 focus:border-pink-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="border-pink-300 focus:border-pink-500"
        />
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
        Sign Up
      </Button>
      <div className="text-center text-sm">
        <Link href="/login" className="text-pink-600 hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </form>
  );
}
