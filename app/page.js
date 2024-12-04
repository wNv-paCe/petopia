import Link from "next/link";
import { Button } from "@/components/ui/button";
import PetCarousel from "./components/PetCarousel";
import AboutUs from "./components/AboutUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 flex justify-between items-center bg-card shadow-sm">
        <Link href="/" className="text-3xl font-bold text-primary">
          Petopia
        </Link>
        <Link href="/login">
          <Button className="bg-primary hover:bg-primary/90 text-secondary-foreground">
            Log In
          </Button>
        </Link>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
          Our Adorable Pets
        </h2>
        <PetCarousel />
        <AboutUs />
      </main>
      <footer className="mt-12 py-6 bg-muted text-center text-muted-foreground">
        <p>&copy; 2023 Petopia. All rights reserved.</p>
      </footer>
    </div>
  );
}
