"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PetList from "@/app/components/PetList";
import SearchForm from "@/app/components/SearchForm";
import { searchPets } from "@/app/_services/petService";
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} from "@/app/_services/favoriteService";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch user favorites on page load
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userFavorites = await getUserFavorites();
        setFavorites(userFavorites.map((fav) => fav.petId)); // Extract pet IDs
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Handle search with category and city
  const handleSearch = async ({ category, city }) => {
    try {
      // Use searchPets function to fetch filtered pets
      const results = await searchPets(category, city);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching pets:", error);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (pet) => {
    if (!pet || !pet.id) {
      console.error("Invalid pet data:", pet);
      return;
    }
    try {
      if (favorites.includes(pet.id)) {
        await removeFavorite(pet.id);
        setFavorites((prev) => prev.filter((id) => id !== pet.id)); // Remove from local state
      } else {
        await addFavorite(pet);
        setFavorites((prev) => [...prev, pet.id]); // Add to local state
      }
    } catch (error) {
      console.error("Error toggling favorite:", error.message || error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Search Pets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchForm onSearch={handleSearch} />
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PetList
              pets={searchResults}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
