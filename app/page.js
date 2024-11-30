import Link from "next/link";
import { Button } from "@/components/ui/button";
import PetCarousel from "./components/PetCarousel";
import AboutUs from "./components/AboutUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-pink-50">
      <header className="p-4 flex justify-between items-center bg-white shadow-sm">
        <Link
          href="/"
          className="text-3xl font-bold text-pink-600 hover:text-pink-700"
        >
          Petopia
        </Link>
        <Link href="/login">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            Log In
          </Button>
        </Link>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-pink-700">
          Our Adorable Pets
        </h2>
        <PetCarousel />
        <AboutUs />
      </main>
      <footer className="mt-12 py-6 bg-pink-100 text-center text-pink-600">
        <p className="text-sm">&copy; 2023 Petopia. All rights reserved.</p>
      </footer>
    </div>
  );
}
