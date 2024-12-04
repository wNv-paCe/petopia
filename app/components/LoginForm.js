"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const { googleSignIn, loginWithEmail } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const result = await loginWithEmail(email, password);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-destructive text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-background/90"
        >
          Login
        </Button>
      </form>
      <div className="flex justify-between text-sm mt-4">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot Password?
        </Link>
        <Link href="/signup" className="text-primary hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full border-input bg-background hover:bg-accent hover:text-accent-foreground"
      >
        Login with Google
      </Button>
    </div>
  );
}
