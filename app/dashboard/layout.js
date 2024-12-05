"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }) {
  const { user, firebaseSignOut } = useUserAuth();
  const router = useRouter();

  // check if user is logged in
  useEffect(() => {
    if (!user) {
      // if user is not logged in, redirect to login page
      router.push("/login");
    }
  }, [user, router]);

  // handle logout
  const handleLogout = async () => {
    try {
      await firebaseSignOut();
      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const username = user?.username || user?.displayName || user?.email || "User";

  // if user is not loaded yet, show loading message
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background flex relative ${inter.className}`}
    >
      {/* Left Part - Navigation Bar */}
      <nav className="w-64 bg-card text-card-foreground shadow-md flex flex-col">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-primary">Welcome</h2>
          <p className="text-lg font-normal text-primary">{username}</p>
        </div>
        <ul className="space-y-2 p-4 flex-grow">
          <li>
            <Link href="/dashboard/search">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary hover:bg-accent"
              >
                Search
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary hover:bg-accent"
              >
                Profile
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/my-posts">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary hover:bg-accent"
              >
                My Posts
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/favorites">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary hover:bg-accent"
              >
                Favorites
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary hover:bg-accent"
              >
                Settings
              </Button>
            </Link>
          </li>
        </ul>
        <div className="p-4 mt-auto">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </nav>

      {/* Right Part */}
      <main className="flex-1 p-8 bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}
