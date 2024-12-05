import { db, auth } from "@/app/_utils/firebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Get the list of pets that the current user has favorited
 * Optionally, filter by category.
 * @param {string|null} category The category to filter by (optional)
 * @returns {Promise<Array>} List of favorite pets
 */
export const getUserFavorites = async (category = null) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const favoritesRef = collection(db, "favorites");
    const conditions = [where("userId", "==", currentUser.uid)];
    if (category) {
      conditions.push(where("category", "==", category));
    }

    const q =
      conditions.length > 1
        ? query(favoritesRef, ...conditions)
        : query(favoritesRef, conditions[0]);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

/**
 * Add a pet to the user's favorites
 * @param {Object} pet The pet to add to favorites
 * @returns {Promise<Object>} The added favorite pet
 */
export const addFavorite = async (pet) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const favoritesRef = collection(db, "favorites");

    // Check if pet is already in favorites
    const q = query(
      favoritesRef,
      where("userId", "==", currentUser.uid),
      where("petId", "==", pet.id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("This pet is already in your favorites.");
    }

    const favoriteData = {
      petId: pet.id,
      userId: currentUser.uid,
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      city: pet.city,
      category: pet.category, // No default value
      description: pet.description || "No description", // Add description field
      imageUrl: pet.imageUrl || "/",
      email: pet.email || "No email provided",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(favoritesRef, favoriteData);
    return { id: docRef.id, ...favoriteData };
  } catch (error) {
    console.error("Error adding favorite:", error.message || error);
    throw error;
  }
};

/**
 * Remove a favorite pet from the user's list of favorites
 * @param {string} favoriteId The ID of the favorite to remove
 * @returns {Promise<void>}
 */
export const removeFavorite = async (favoriteId) => {
  try {
    const favoriteDocRef = doc(db, "favorites", favoriteId);
    await deleteDoc(favoriteDocRef);
    console.log("Favorite removed successfully for favoriteId:", favoriteId);
  } catch (error) {
    console.error("Error removing favorite:", error.message || error);
    throw error;
  }
};
