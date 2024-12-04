"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/_utils/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditUsernameModal from "./EditUsernameModal";
import EditPasswordModal from "./EditPasswordModal";

export default function ProfilePage() {
  const [user, setUser] = useState(() => ({
    username: "Anonymous",
    email: "",
  }));
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user data from Firestore on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUser({
              username: userData.username || "Anonymous",
              email: auth.currentUser.email,
            });
          } else {
            setUser({
              username: auth.currentUser.displayName || "Anonymous",
              email: auth.currentUser.email,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to fetch user data. Please try again.");
      }
    };
    fetchUserData();
  }, []);

  const handleUsernameUpdate = async (newUsername) => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    try {
      // Update username in Firestore
      await updateDoc(userDocRef, {
        username: newUsername,
      });

      // Update local state
      setUser((prevUser) => ({
        ...prevUser,
        username: newUsername,
      }));

      // Show success message
      setSuccessMessage("Username updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error updating username in Firestore:", error);
      setErrorMessage("Failed to update username. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const handlePasswordUpdate = async (newPassword) => {
    try {
      await auth.currentUser.updatePassword(newPassword);
      setIsEditingPassword(false);
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("Failed to update password. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="text-destructive text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500">{successMessage}</div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Username</h3>
            <p>{user.username}</p>
          </div>
          <Button onClick={() => setIsEditingUsername(true)}>Edit</Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Email</h3>
          <p>{user.email}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Password</h3>
            <p>••••••••</p>
          </div>
          <Button onClick={() => setIsEditingPassword(true)}>Edit</Button>
        </div>
      </CardContent>

      <EditUsernameModal
        isOpen={isEditingUsername}
        onClose={() => setIsEditingUsername(false)}
        onUpdate={handleUsernameUpdate}
        currentUsername={user.username}
      />

      <EditPasswordModal
        isOpen={isEditingPassword}
        onClose={() => setIsEditingPassword(false)}
        onUpdate={handlePasswordUpdate}
      />
    </Card>
  );
}
