"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleUsernameLogin(event) {
    event.preventDefault();
    setError(null);

    // TODO: Implement Firebase authentication
    console.log("Login with username and password");
  }

  async function handleGoogleLogin() {
    setError(null);

    // TODO: Implement Firebase Google authentication
    console.log("Login with Google");
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleUsernameLogin} className="space-y-4">
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="border-pink-300 focus:border-pink-500"
          />
        </div>
        <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
          Login
        </Button>
      </form>
      <div className="flex justify-between text-sm mt-4">
        <Link href="/forgot-password" className="text-pink-600 hover:underline">
          Forgot Password?
        </Link>
        <Link href="/signup" className="text-pink-600 hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
      >
        Login with Google
      </Button>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
