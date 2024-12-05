import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { auth } from "@/app/_utils/firebase";

export default function AddPetModal({ isOpen, onClose, onAdd }) {
  const [petInfo, setPetInfo] = useState({
    name: "",
    breed: "",
    age: "",
    imageUrl: "",
    city: "",
    description: "",
    email: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill the email field if the user is logged in
  useEffect(() => {
    if (auth.currentUser) {
      setPetInfo((prev) => ({ ...prev, email: auth.currentUser.email }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (
      !petInfo.name ||
      !petInfo.breed ||
      !petInfo.age ||
      !petInfo.city ||
      !petInfo.category
    ) {
      setError("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (petInfo.age <= 0) {
      setError("Age must be a positive number.");
      setIsSubmitting(false);
      return;
    }

    try {
      await onAdd({ ...petInfo, userId: auth.currentUser.uid, source: "user" });
      setPetInfo({
        name: "",
        breed: "",
        age: "",
        imageUrl: "",
        city: "",
        description: "",
        email: auth.currentUser?.email || "",
        category: "",
      });
      onClose();
    } catch (err) {
      console.error("Error adding pet:", err);
      setError("Failed to add pet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Pet Name</Label>
            <Input
              id="name"
              name="name"
              value={petInfo.name}
              onChange={handleChange}
              placeholder="e.g., Buddy"
              required
            />
          </div>
          <div>
            <Label htmlFor="breed">Breed</Label>
            <Input
              id="breed"
              name="breed"
              value={petInfo.breed}
              onChange={handleChange}
              placeholder="e.g., Golden Retriever"
              required
            />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={petInfo.age}
              onChange={handleChange}
              placeholder="e.g., 2"
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={petInfo.city}
              onChange={handleChange}
              placeholder="e.g., New York"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={petInfo.category}
              onChange={handleChange}
              required
              className="border rounded-md w-full p-2"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={petInfo.description}
              onChange={handleChange}
              placeholder="Add a short description of the pet"
              className="resize-none"
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={petInfo.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL here"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={petInfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Pet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
