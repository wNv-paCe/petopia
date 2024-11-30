"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const pets = [
  {
    id: 1,
    name: "Fluffy",
    type: "Cat",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "Buddy",
    type: "Dog",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "Hoppy",
    type: "Rabbit",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    name: "Tweety",
    type: "Bird",
    image: "/placeholder.svg?height=300&width=300",
  },
];

export default function PetCarousel() {
  const [currentPet, setCurrentPet] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPet((prev) => (prev + 1) % pets.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0 relative aspect-[16/9]">
        {pets.map((pet, index) => (
          <div
            key={pet.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentPet ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={pet.image}
              alt={pet.name}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <h3 className="text-xl font-semibold">{pet.name}</h3>
              <p className="text-sm">{pet.type}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
