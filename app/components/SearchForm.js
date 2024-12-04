"use client";

import { useState, useRef, useEffect } from "react";
import petData from "../api/PetData.json";

export default function SearchForm() {
    const [data, setData] = useState(petData.animals); 
    const [searchText, setSearchText] = useState(''); 
    const [spayedNeutered, setSpayedNeutered] = useState(false); 
    const [houseTrained, setHouseTrained] = useState(false); 
    const [specialNeeds, setSpecialNeeds] = useState(false); 
    const [shotsCurrent, setShotsCurrent] = useState(false); 
    const [children, setChildren] = useState(false); 
    const [dogs, setDogs] = useState(false); 
    const [cats, setCats] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    const checkboxesRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (showCheckboxes) {
            checkboxesRef.current.style.maxHeight = `${checkboxesRef.current.scrollHeight}px`;
        } else {
            checkboxesRef.current.style.maxHeight = '0';
        }
    }, [showCheckboxes]);

    useEffect(() => {
        const anyCheckboxChecked = spayedNeutered || houseTrained || specialNeeds || shotsCurrent || children || dogs || cats;
        setShowCheckboxes(anyCheckboxChecked || document.activeElement === inputRef.current);
    }, [spayedNeutered, houseTrained, specialNeeds, shotsCurrent, children, dogs, cats]);

    const handleSearch = () => { 
        console.log('searchText:', searchText);

        if (!searchText && !spayedNeutered && !houseTrained && !specialNeeds && !shotsCurrent && !children && !dogs && !cats) {
            setError('Enter a search term or check a box to continue.');
            setResults([]);
            return;
        }

        setError('');

        const filteredResults = data.filter(animal => 
            (searchText ?
                animal.type.toLowerCase().includes(searchText.toLowerCase()) ||
                animal.name.toLowerCase().includes(searchText.toLowerCase()) ||
                animal.breeds.primary.toLowerCase().includes(searchText.toLowerCase()) ||
                animal.breeds.secondary.toLowerCase().includes(searchText.toLowerCase()) ||
                animal.gender.toLowerCase().includes(searchText.toLowerCase()) ||
                animal.age.toLowerCase().includes(searchText.toLowerCase()) ||
                animal.contact.address.city.toLowerCase().includes(searchText.toLowerCase()) ||
                animal.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())) 
            : true) &&
            (!spayedNeutered || animal.attributes.spayed_neutered) && 
            (!houseTrained || animal.attributes.house_trained) && 
            (!specialNeeds || animal.attributes.special_needs) && 
            (!shotsCurrent || animal.attributes.shots_current) && 
            (!children || animal.environment.children) && 
            (!dogs || animal.environment.dogs) && 
            (!cats || animal.environment.cats)
        ); 
        setResults(filteredResults); 
        console.log('filteredResults:', filteredResults);
    };

    const handleShowCheckboxes = () => {
        setShowCheckboxes(true);
    };

    const handleHideCheckboxes = () => {
        if (
            !spayedNeutered &&
            !houseTrained &&
            !specialNeeds &&
            !shotsCurrent &&
            !children &&
            !dogs &&
            !cats
        )
            setShowCheckboxes(false);
    };

    return ( 
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-2xl fixed top-1/4 left-1/2 transform -translate-x-1/2 z-10">
                <h1 className="text-3xl text-center font-bold text-pink-600 mb-5">Petopia</h1>
                <div className="relative mb-5">
                    <input
                        className="w-full p-2 pr-20 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onFocus={handleShowCheckboxes}
                        onBlur={handleHideCheckboxes}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <button
                        className="absolute right-0 top-0 h-full px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-r-md"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div
                    ref={checkboxesRef}
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: '0' }}
                >
                    <div className="bg-white rounded-md shadow-md p-4 flex">
                        <div className="w-1/2 pr-2">
                            <h3 className="font-semibold mb-2">Attributes</h3>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" checked={spayedNeutered} onChange={e => setSpayedNeutered(e.target.checked)} className="mr-2" />
                                    Spayed/Neutered
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" checked={houseTrained} onChange={e => setHouseTrained(e.target.checked)} className="mr-2" />
                                    House Trained
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" checked={specialNeeds} onChange={e => setSpecialNeeds(e.target.checked)} className="mr-2" />
                                    Special Needs
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" checked={shotsCurrent} onChange={e => setShotsCurrent(e.target.checked)} className="mr-2" />
                                    Shots Current
                                </label>
                            </div>
                        </div>
                        <div className="w-1/2 pl-2">
                            <h3 className="font-semibold mb-2">Environment</h3>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" checked={children} onChange={e => setChildren(e.target.checked)} className="mr-2" />
                                    Good with Children
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" checked={dogs} onChange={e => setDogs(e.target.checked)} className="mr-2" />
                                    Good with Dogs
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" checked={cats} onChange={e => setCats(e.target.checked)} className="mr-2" />
                                    Good with Cats
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}
            </div>
            
            <div> {results.map((animal, index) => (
                <div key={index}> 
                    <h2>{animal.name}</h2> 
                    <p>{animal.age} - {animal.breeds.primary} - {animal.breeds.secondary} - {animal.type}</p> 
                    <p>{animal.description}</p>
                    <p>Date Posted: {animal.published_at}</p>
                    <h2>Attributes</h2>
                    <p>Spayed/Neutered: {animal.attributes.spayed_neutered ? 'Yes' : 'No'}</p>
                    <p>House Trained: {animal.attributes.house_trained ? 'Yes' : 'No'}</p>
                    <p>Special Needs: {animal.attributes.special_needs ? 'Yes' : 'No'}</p>
                    <p>Shots Current: {animal.attributes.shots_current ? 'Yes' : 'No'}</p>
                    <h2>Environment</h2>
                    <p>Good with Children: {animal.environment.children ? 'Yes' : 'No'}</p>
                    <p>Good with Dogs: {animal.environment.dogs ? 'Yes' : 'No'}</p>
                    <p>Good with Cats: {animal.environment.cats ? 'Yes' : 'No'}</p>
                    <h2>Contact Information</h2>
                    <p>Email: {animal.contact.email}</p>
                    <p>Phone: {animal.contact.phone}</p>
                    <h2>Location</h2>
                    <p>Address: {animal.contact.address.street}</p> 
                    <p>City: {animal.contact.address.city}</p>
                    <p>Province: {animal.contact.address.province}</p>
                    <p>Postal Code: {animal.contact.address.zip}</p>
                </div> 
            ))} 
            </div> 
        </div> 
    );
}