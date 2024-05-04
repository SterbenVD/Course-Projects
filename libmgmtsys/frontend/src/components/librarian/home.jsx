import React from 'react';

const Home_Librarian = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl text-white">Welcome Librarian</h1>
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl text-white mt-4 mb-4">Book Management</h2>
                {/* Buttons of Add Book, Update Book, Delete Book. On click, they should redirect to the respective pages */}
                <div className="flex flex-row space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/librarian/add_book'}>
                        Add Book
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/librarian/update_book'}>
                        Update Book
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/librarian/delete_book'}>
                        Delete Book
                    </button>
                </div>
                <h2 className="text-2xl text-white mt-4 mb-4">Issues </h2>
                {/* Buttons of Issue Book, Return Book. On click, they should redirect to the respective pages */}
                <div className="flex flex-row space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/librarian/issue_book'}>
                        Issue Book
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/librarian/fine'}>
                        Fine
                    </button>
                </div>
                <h2 className="text-2xl text-white mt-4 mb-4">Requests</h2>
                {/* Buttons of View Requests. On click, they should redirect to the respective pages */}
                <div className="flex flex-row space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/librarian/view_requests'}>
                        View Requests
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/librarian/Edit Request'}>
                        Edit Request
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home_Librarian;
