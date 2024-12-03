"use client";

import { useState } from "react";
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

    return ( 
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center"> 
            
            <div className="">
                <h1 className="text-3xl text-center font-bold text-pink-600 mb-5">Petopia</h1> 
                <input className="mb-5" type="text" placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)} />
            </div>

            <div className="text-center flex flex-col mb-5"> 
                <h3 className="mb-5">Attributes</h3> 
                <div className="flex flex-col items-start">
                    <label> 
                        <input type="checkbox" checked={spayedNeutered} onChange={e => setSpayedNeutered(e.target.checked)} /> 
                        Spayed/Neutered 
                    </label> 
                    <label> 
                        <input type="checkbox" checked={houseTrained} onChange={e => setHouseTrained(e.target.checked)} /> 
                        House Trained 
                    </label> 
                    <label> 
                        <input type="checkbox" checked={specialNeeds} onChange={e => setSpecialNeeds(e.target.checked)} /> 
                        Special Needs 
                    </label> 
                    <label> 
                        <input type="checkbox" checked={shotsCurrent} onChange={e => setShotsCurrent(e.target.checked)} /> 
                        Shots Current 
                    </label> 
                </div>
            </div> 

            <div className="text-center flex flex-col mb-5"> 
                <h3 className="mb-5">Environment</h3> 
                <div className="flex flex-col items-start">
                    <label> 
                        <input type="checkbox" checked={children} onChange={e => setChildren(e.target.checked)} /> 
                        Good with Children 
                    </label> 
                    <label> 
                        <input type="checkbox" checked={dogs} onChange={e => setDogs(e.target.checked)} /> 
                        Good with Dogs 
                    </label> 
                    <label> 
                        <input type="checkbox" checked={cats} onChange={e => setCats(e.target.checked)} /> 
                        Good with Cats 
                    </label>
                </div>
            </div>

            <button className="p-2 pl-4 pr-4 rounded-md bg-pink-500 hover:bg-pink-600 text-white" onClick={handleSearch}>Search</button> 
            
            {error && <p className="text-red-500">{error}</p>}
            
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