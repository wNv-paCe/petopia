"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PetList from "@/app/components/PetList";
import AddPetModal from "@/app/components/AddPetModal";
import EditPetModal from "@/app/components/EditPetModal";
import {
  getUserPets,
  addNewPet,
  updatePet,
  deletePet,
} from "@/app/_services/petService";

export default function MyPostsPage() {
  const [pets, setPets] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [category, setCategory] = useState("");

  // Get the user's pets when the page loads
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userPets = await getUserPets(category || null);
        setPets(userPets);
      } catch (error) {
        console.error("Error fetching user pets:", error);
      }
    };
    fetchPets();
  }, [category]);

  // Add a new pet
  const handleAddPet = async (newPet) => {
    try {
      const addedPet = await addNewPet({
        ...newPet,
      });
      setPets((prev) => [...prev, addedPet]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding new pet:", error);
    }
  };

  // Edit an existing pet
  const handleEditPet = async (petId, updatedPet) => {
    try {
      await updatePet(petId, {
        ...updatedPet,
      });
      setPets((prev) =>
        prev.map((pet) => (pet.id === petId ? { ...pet, ...updatedPet } : pet))
      );
      setIsEditModalOpen(false);
      setSelectedPet(null);
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  // Delete a pet
  const handleDeletePet = async (petId) => {
    try {
      await deletePet(petId);
      setPets((prev) => prev.filter((pet) => pet.id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            My Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category selections */}
          <div className="mb-4">
            <label htmlFor="category" className="block font-medium mb-2">
              Filter by Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* List of pets */}
          <PetList
            pets={pets}
            isEditable={true}
            onEdit={(petId) => {
              const petToEdit = pets.find((pet) => pet.id === petId);
              setSelectedPet(petToEdit);
              setIsEditModalOpen(true);
            }}
            onRemove={handleDeletePet}
          />
          <Button
            variant="destructive"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4"
          >
            Add New Pet
          </Button>
        </CardContent>
      </Card>

      <AddPetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPet}
      />

      {selectedPet && (
        <EditPetModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPet(null);
          }}
          pet={selectedPet}
          onSave={handleEditPet}
        />
      )}
    </div>
  );
}
