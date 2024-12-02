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

    const handleSearch = () => { 
        const filteredResults = data.filter(animal => 
            (searchText ?
                animal.type.toLowerCase().includes(searchText.toLowerCase()) ||
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
    };

    return ( 
        <div> 
            <h1>Pet Search</h1> 
            <input type="text" placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)} />

            <div> 
                <h3>Attributes</h3> 
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

            <div> 
                <h3>Environment</h3> 
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

            <button onClick={handleSearch}>Search</button> 
            <div> {results.map((animal, index) => ( 
                <div key={index}> 
                    <h2>{animal.name}</h2> 
                    <p>{animal.age} - {animal.breeds.primary} - {animal.breeds.secondary} - {animal.type}</p> 
                    <p>{animal.description}</p>
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