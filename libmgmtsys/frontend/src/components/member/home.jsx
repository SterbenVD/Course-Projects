import React from 'react';

const Home_Member = () => {

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl text-white">Member Home</h1>
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl text-white mt-4 mb-4">Book Management</h2>
                {/* Buttons of Search Book, Issue Book, Return Book. On click, they should redirect to the respective pages */}
                <div className="flex flex-row space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/member/search_book'}>
                        Search Book
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/member/reserve_book'}>
                        Reserve Book
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/member/return_book'}>
                        Return Book
                    </button>
                </div>
                <h2 className="text-2xl text-white mt-4 mb-4">Requests</h2>
                {/* Buttons of View Requests. On click, they should redirect to the respective pages */}
                <div className="flex flex-row space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/member/view_requests'}>
                        View Requests
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/member/add_request'}>
                        Add Request
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/member/edit_request'}>
                        Edit Request
                    </button>
                </div>
            </div>

        </div>

    );
}

export default Home_Member;
