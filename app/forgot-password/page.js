import ForgotPasswordForm from "../components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Forgot Password
        </h1>
        <ForgotPasswordForm />
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
