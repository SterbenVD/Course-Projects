import React from 'react';

const Home_Admin = () => {
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl mb-4">Admin Home</h1>
            {/* Buttons of Create User, Update User, Delete User. On click, they should redirect to the respective pages */}
            <div className="flex flex-row space-x-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/admin/create_user'}>
                    Create User
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/admin/update_user'}>
                    Update User
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"  onClick={() => window.location.href = '/admin/delete_user'}>
                    Delete User
                </button>
            </div>
        </div>
    );
}

export default Home_Admin;
