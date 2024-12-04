"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { db, auth } from "@/app/_utils/firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Description } from "@radix-ui/react-dialog";
import {
  deleteUser,
  EmailAuthCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackTitle.trim() || !feedbackDescription.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackRef = collection(db, "feedbacks");
      await addDoc(feedbackRef, {
        userId: auth.currentUser?.uid || "Anonymous",
        email: auth.currentUser?.email || "Anonymous",
        title: feedbackTitle.trim(),
        description: feedbackDescription.trim(),
        createdAt: Timestamp.now(),
      });

      alert("Thank you for your feedback!");
      setFeedbackTitle("");
      setFeedbackDescription("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("No user is currently logged in.");
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      // Step 1: Check if Google account
      const isGoogleUser = currentUser.providerData.some(
        (provider) => provider.providerId === "google.com"
      );

      if (!isGoogleUser) {
        // Step 2: Re-authenticate user
        const credentials = EmailAuthProvider.credential(
          currentUser.email,
          prompt("Please enter your password to confirm account deletion.")
        );

        await reauthenticateWithCredential(currentUser, credentials);
      }

      // Step 3: Delete Firestore user data
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);

      // Step 4: Delete Firebase Authentication user
      await deleteUser(currentUser);

      alert("Your account has been deleted.");
    } catch (error) {
      console.error("Error deleting account: ", error.message || error);
      if (error.code === "auth/requires-recent-login") {
        alert("Please re-login to delete your account.");
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About the App</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Version: 1.0.0</p>
          <h3 className="mt-4 font-semibold">Terms of Service</h3>
          <p className="text-sm text-muted-foreground">
            Petopia is an information exchange platform. We do not guarantee the
            accuracy or authenticity of the data provided. Users are responsible
            for verifying information and making their own judgments. Petopia is
            not liable for any decisions made based on the information provided
            through our platform.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            We value your input to improve our service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description"
              value={feedbackDescription}
              onChange={(e) => setFeedbackDescription(e.target.value)}
              required
            />
            <div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Send Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose between light and dark mode.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>Dark Mode</span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete your account?
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
