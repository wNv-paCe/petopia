import { db, auth } from "@/app/_utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Generic function to get pets with multiple conditions
const getPets = async (conditions = []) => {
  try {
    const petsRef = collection(db, "pets");
    const q = conditions.length > 0 ? query(petsRef, ...conditions) : petsRef;
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
};

// Get all unique cities from pets collection
export const getAvailableCities = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "pets"));
    const citiesSet = new Set();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.city) {
        citiesSet.add(data.city); // Ensure uniformity in case
      }
    });

    return Array.from(citiesSet).sort();
  } catch (error) {
    console.error("Error fetching available cities:", error);
    throw error;
  }
};

// Searching pets with category and city
export async function searchPets(category, city) {
  try {
    const petsCollection = collection(db, "pets");
    const filters = [];

    // Add category filter
    if (category && category !== "all") {
      filters.push(where("category", "==", category));
    }

    // Add city filter
    if (city && city.trim() !== "all cities") {
      // Exclude default 'all cities' and keep case format as in the database
      const formattedCity = city
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
      filters.push(where("city", "==", formattedCity));
    }

    // Apply filters to query
    const petsQuery = filters.length
      ? query(petsCollection, ...filters)
      : petsCollection;

    const querySnapshot = await getDocs(petsQuery);

    // Map results to array
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error searching pets:", error);
    throw error;
  }
}

// Get the pets list of the current user from the database
export const getUserPets = async (category = null) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const conditions = [where("userId", "==", currentUser.uid)];
    if (category) {
      conditions.push(where("category", "==", category));
    }

    return await getPets(conditions);
  } catch (error) {
    console.error("Error fetching user pets:", error);
    throw error;
  }
};

// Get all pets from the database
export const getAllPets = async () => {
  try {
    return await getPets();
  } catch (error) {
    console.error("Error fetching all pets:", error);
    throw error;
  }
};

// Add a new pet to the database
export const addNewPet = async (newPet) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const petsRef = collection(db, "pets");

    const newPetData = {
      ...newPet,
      email: currentUser.email, // Ensure email is attached
      userId: currentUser.uid, // Attach the user ID
      source: "user",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(petsRef, newPetData);
    return { id: docRef.id, ...newPetData };
  } catch (error) {
    console.error("Error adding new pet:", error);
    throw error;
  }
};

// Update an existing pet in the database
export const updatePet = async (petId, updatedData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const petDocRef = doc(db, "pets", petId);
    await updateDoc(petDocRef, updatedData);

    console.log("Pet updated successfully:", updatedData);
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
};

// Delete a pet from the database
export const deletePet = async (petId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const petDocRef = doc(db, "pets", petId);
    await deleteDoc(petDocRef);

    console.log("Pet deleted successfully.");
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw error;
  }
};

// Get pets by category
export const getPetsByCategory = async (category) => {
  try {
    const condition = where("category", "==", category);
    return await getPets([condition]);
  } catch (error) {
    console.error(`Error fetching pets in category ${category}:`, error);
    throw error;
  }
};

// Get third-party pets only
export const getThirdPartyPets = async (category = null) => {
  try {
    const conditions = [where("source", "==", "third-party")];
    if (category) {
      conditions.push(where("category", "==", category));
    }

    return await getPets(conditions);
  } catch (error) {
    console.error("Error fetching third-party pets:", error);
    throw error;
  }
};
