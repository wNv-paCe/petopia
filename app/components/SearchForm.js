"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvailableCities } from "@/app/_services/petService"; // 确保引入的是正确的函数

export default function SearchForm({ onSearch, onReset }) {
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const fetchedCities = await getAvailableCities(); // 调用 getAvailableCities 方法
        setCities(fetchedCities.length > 0 ? fetchedCities : ["Default City"]);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities(["Default City"]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  const handleSearch = () => {
    const filters = {
      category: category === "all" ? "" : category,
      city: city === "all" ? "" : city.toLowerCase(),
    };
    if (onSearch) onSearch(filters);
  };

  const handleReset = () => {
    setCategory("all");
    setCity("all");
    if (onReset) onReset();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      {/* Category Filter */}
      <div>
        <Label htmlFor="category">Pet Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              All Categories
            </SelectItem>
            <SelectItem key="dog" value="dog">
              Dog
            </SelectItem>
            <SelectItem key="cat" value="cat">
              Cat
            </SelectItem>
            <SelectItem key="rabbit" value="rabbit">
              Rabbit
            </SelectItem>
            <SelectItem key="bird" value="bird">
              Bird
            </SelectItem>
            <SelectItem key="other" value="other">
              Other
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      <div>
        <Label htmlFor="city">City</Label>
        <Select
          value={city}
          onValueChange={setCity}
          disabled={loadingCities || cities.length === 0}
        >
          <SelectTrigger id="city">
            <SelectValue
              placeholder={loadingCities ? "Loading cities..." : "Select city"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              All Cities
            </SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <div className="flex items-end">
        <Button
          onClick={handleSearch}
          className="w-full"
          disabled={loadingCities}
        >
          {loadingCities ? "Loading..." : "Search"}
        </Button>
      </div>

      {/* Reset Button */}
      <div className="flex items-end">
        <Button onClick={handleReset} variant="secondary" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  );
}
