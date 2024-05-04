import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useGetSearchResults } from '../../hooks/useGetter';
import { useState } from 'react';
import axios from 'axios';
import url from '../../utils/url';
import Loader from '../../components/Loader';

const Search = () => {
    const cookie = document.cookie;
    if (!cookie) {
        navigate("/");
    }
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [temp_results, settempResults] = useState([]);

    const handleSubmit = async () => {
        try {
            var res = await axios.get(`${url}/search/${search}`);
            settempResults(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setResults(temp_results);
        console.log(results);
    }, [temp_results]);
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1>Search</h1>
                <div className="flex flex-col items-center justify-center">
                    <input type="text" placeholder="Search" className="border border-gray-400 p-3 m-2" onChange={(e) => setSearch(e.target.value)} />
                    <button className="bg-blue-500 text-white p-2 rounded m-2" onClick={handleSubmit}>Search</button>
                    <div className="flex flex-col items-center justify-center p-4">
                        <h3>Search Results</h3>
                        <div className="flex flex-col items-center justify-center">
                            {/* Results here */}
                            {results.length > 0 ? results.map((result) => {
                                return (
                                    <div key={result.id} className="flex flex-col items-center justify-center border border-gray-400 p-4 m-2">
                                        <h3>{result.title}</h3>
                                        <h4>{result.author}</h4>
                                        <p>{result.ISBN}</p>
                                        <p>{result.publisher}</p>
                                    </div>
                                );
                            }) : <>No Results</>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;
