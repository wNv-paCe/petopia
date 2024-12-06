"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditPetModal({ isOpen, onClose, pet, onSave }) {
  const [name, setName] = useState(pet?.name || "");
  const [breed, setBreed] = useState(pet?.breed || "");
  const [age, setAge] = useState(pet?.age || "");
  const [city, setCity] = useState(pet?.city || "");
  const [category, setCategory] = useState(pet?.category || "other");
  const [description, setDescription] = useState(pet?.description || "");
  const [imageUrl, setImageUrl] = useState(pet?.imageUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(pet?.name || "");
      setBreed(pet?.breed || "");
      setAge(pet?.age || "");
      setCity(pet?.city || "");
      setCategory(pet?.category || "");
      setDescription(pet?.description || "");
      setImageUrl(pet?.imageUrl || "");
    }
  }, [isOpen, pet]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !breed.trim() || !age || !city.trim() || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    // Capitalize the first letter of the name, city and breed
    const formattedName = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    const formattedCity = city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    const formattedBreed = breed
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    try {
      setIsSubmitting(true);
      await onSave(pet.id, {
        name: formattedName,
        breed: formattedBreed,
        age: Number(age),
        city: formattedCity,
        category,
        description,
        imageUrl,
      });
      alert("Pet information updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving pet information:", error);
      alert("Failed to update pet information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pet Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pet Name"
            required
          />
          <Input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Breed"
            required
          />
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            required
          />
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            required
          />
          <div>
            <label htmlFor="category" className="block font-medium">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short description of the pet"
              className="resize-none"
            />
          </div>
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
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
