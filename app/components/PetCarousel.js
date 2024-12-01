"use client";

import Image from "next/image";

const pets = [
  { id: 1, name: "Fluffy", type: "Cat", image: "/images/Fluffy.jpg" },
  { id: 2, name: "Buddy", type: "Dog", image: "/images/Buddy.jpg" },
  { id: 3, name: "Hoppy", type: "Rabbit", image: "/images/Hoppy.jpg" },
  { id: 4, name: "Tweety", type: "Bird", image: "/images/Tweety.jpg" },
];

export default function PetCarousel() {
  return (
    <div className="w-full overflow-hidden relative">
      <div className="flex animate-marquee">
        {[...pets, ...pets, ...pets].map((pet, index) => (
          <div
            key={`${pet.id}-${index}`}
            className="flex-shrink-0 w-48 h-48 mx-4 relative"
          >
            <Image
              src={pet.image}
              alt={pet.name}
              width={192}
              height={192}
              className="rounded-lg object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
              <h3 className="text-sm font-semibold">{pet.name}</h3>
              <p className="text-xs">{pet.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
