import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function PetList({
  pets,
  favorites = [],
  onFavoriteToggle,
  onRemove,
  onEdit,
  isFavoriteList = false,
  isEditable = false,
}) {
  if (pets.length === 0) {
    return <p className="text-muted-foreground">No pets found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pets.map((pet) => (
        <Card key={pet.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={pet.imageUrl || "/placeholder.svg"}
                alt={pet.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <CardTitle className="text-lg font-semibold text-primary">
              {pet.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{pet.breed}</p>
            <p className="text-sm text-muted-foreground">{pet.age} years old</p>
            {pet.city && (
              <p className="text-sm text-muted-foreground">
                <strong>City:</strong> {pet.city}
              </p>
            )}
            {pet.email && (
              <p className="text-sm text-muted-foreground">
                <strong>Contact:</strong> {pet.email}
              </p>
            )}
            {pet.category && (
              <p className="text-sm text-muted-foreground">
                <strong>Category:</strong> {pet.category}
              </p>
            )}
            {pet.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                <strong>Description:</strong> {pet.description}
              </p>
            )}
            {pet.source && (
              <p className="text-xs text-muted-foreground italic">
                Source: {pet.source === "user" ? "user" : "Third-party"}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            {/* Favorite Toggle Button */}
            {onFavoriteToggle && (
              <Button
                variant={favorites.includes(pet.id) ? "secondary" : "default"}
                onClick={() => onFavoriteToggle(pet)}
                className="w-full"
              >
                {favorites.includes(pet.id) ? "Unfavorite" : "Favorite"}
              </Button>
            )}
            {/* Remove Button for Favorites */}
            {isFavoriteList && (
              <Button
                variant="destructive"
                onClick={() => {
                  console.log("Attempting to remove favorite with ID:", pet.id); // Debug
                  onRemove(pet.id); // Ensure `pet.id` is the correct `favoriteId`
                }}
                className="w-full"
              >
                Remove from Favorites
              </Button>
            )}
            {/* Edit Button */}
            {isEditable && (
              <Button
                variant="outline"
                onClick={() => onEdit(pet.id)}
                className="w-full"
              >
                Edit
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
