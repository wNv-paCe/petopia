import LoginForm from "../components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Welcome to Petopia
        </h1>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          <Link href="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
