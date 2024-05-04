import React from 'react';

const Loader = () => {
    return (
        <div>
            <div className="flex items-center justify-center h-screen max-h-4">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
        </div>
    );
}

export default Loader;
