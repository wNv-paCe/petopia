import { useState, useEffect } from "react";
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
import { updateProfile } from "firebase/auth";
import { useUserAuth } from "@/app/_utils/auth-context";

export default function EditUsernameModal({
  isOpen,
  onClose,
  onUpdate,
  currentUsername,
}) {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUserAuth();

  // Reset input value and error when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewUsername(currentUsername || ""); // Ensure the default is an empty string if undefined
      setError("");
    }
  }, [currentUsername, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new username is empty
    if (!newUsername.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    // Prevent saving if username hasn't changed
    if (newUsername.trim() === currentUsername) {
      setError("New username must be different.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Update username in Firestore using the provided onUpdate
      await onUpdate(newUsername.trim());

      // Update Firebase Authentication display name
      await updateProfile(auth.currentUser, {
        displayName: newUsername.trim(),
      });

      // Update user state in auth-context
      setUser((prevUser) => ({
        ...prevUser,
        displayName: newUsername.trim(),
        username: newUsername.trim(),
      }));

      alert("Username updated successfully!");

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Failed to update username:", error);
      setError("Failed to update username. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewUsername(currentUsername || ""); // Reset input value
    setError(""); // Clear error message
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Username</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New username"
            className="mb-4"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
