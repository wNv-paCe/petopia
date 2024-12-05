"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PetList from "@/app/components/PetList";
import {
  getUserFavorites,
  removeFavorite,
} from "@/app/_services/favoriteService";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError("");

      try {
        const userFavorites = await getUserFavorites(category || null);
        setFavorites(userFavorites);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [category]);

  const handleRemoveFavorite = async (favoriteId) => {
    if (!favoriteId) {
      console.error("Invalid favoriteId for removing favorite.");
      return;
    }

    try {
      await removeFavorite(favoriteId);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== favoriteId)
      );
      console.log("Favorite removed successfully:", favoriteId);
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove favorite. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          My Favorites
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Category Selection */}
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

        {/* List of favorites */}
        {loading ? (
          <p className="text-muted-foreground">Loading favorites...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : favorites.length === 0 ? (
          <p className="text-muted-foreground">
            You have no favorite pets yet.
          </p>
        ) : (
          <PetList
            pets={favorites}
            onRemove={handleRemoveFavorite}
            isFavoriteList={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
