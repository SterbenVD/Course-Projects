import React from 'react';

const Reload = () => {


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Reloaded");
    }

    return (
        <button className="background-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Reload</button>
    );
}

export default Reload;
