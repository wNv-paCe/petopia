"use client";

import { useState, useEffect } from "react";

// Searching for Animal types

// Fetch animal types or breeds if available
async function fetchAnimalType(type) {
    const response = await fetch(`https://api.petfinder.com/v2/types/${type}`);
    const data = await response.json();
    if (data._links.breed !== undefined) {
        return data._links.breed.href; // URL for breeds endpoint
    }
    else {
        return data._links.self.href; // URL for animal type endpoint
    }
}

// Set Animal Type for display on front-end
export function AnimalType({ type }) {
    const [animalType, setAnimalType] = useState({});

    const loadAnimalType = async (type) => {
        const fetchedAnimalType = await fetchAnimalType(type);
        setAnimalType(fetchedAnimalType);
    }

    useEffect(() => {
        loadAnimalType(type);
    }, [type]);

    // TODO: Display animal type and allow user to select breed if available or browse animals
    return (
        <div>
            
        </div>
    );
}



