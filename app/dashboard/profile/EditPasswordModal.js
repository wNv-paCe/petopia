import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { auth } from "@/app/_utils/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function EditPasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // check if the current user is a Google user
  const isGoogleUser = auth.currentUser.providerData.some(
    (provider) => provider.providerId === "google.com"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (!newPassword.trim() || newPassword !== confirmPassword) {
      setErrorMessage("Password do not match or are empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // Reauthenticate the user if not Google user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      alert("Password updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage(
        error.code === "auth/wrong-password"
          ? "Incorrect current password."
          : "Failed to update password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPasswordResetEmail = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // Send password reset email
      await sendPasswordResetEmail(auth, auth.currentUser.email);

      alert(
        "A password reset email has been sent to your email address. Please follow the instructions to reset your password."
      );
      onClose();
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setErrorMessage("Failed to send password reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
        </DialogHeader>

        {isGoogleUser ? (
          // Google user interface
          <div className="space-y-4">
            <p className="text-sm">
              You are logged in with Google. To set a password, please use the
              "Send Reset Email" option below.
            </p>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSendPasswordResetEmail}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Email"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // normal user interface
          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="mb-4"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="mb-4"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mb-4"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
