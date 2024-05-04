import React from "react";
import Navbar from "../components/Navbar";

function About() {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="flex min-h-screen flex-col items-center justify-between p-24">
                    <h1 className="text-4xl font-bold">About LIBMGMTSYS</h1>
                    <p className="text-2xl">This is a library management system built with Next.js, Prisma and Tailwind CSS.</p>
                    <p className="text-lg"> Created for SWE course</p>
                    <p className="text-lg">By: </p>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg">Vishal Vijay Devadiga (CS21BTECH11061) </p>
                        <p className="text-lg">Jayachandra Naidu (Do Later) </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold">Features</h2>
                        <div className="flex flex-col items-center justify-center p-4">
                            <h3 className="text-xl font-bold">Members</h3>
                            <p>View Books and reserve them</p>
                            <p>View profile</p>
                            <p>Request for books</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4">
                            <h3 className="text-xl font-bold">Admin</h3>
                            <p>Add, Edit, Delete Members </p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4">
                            <h3 className="text-xl font-bold">Librarian</h3>
                            <p>Add, Edit, Delete Books</p>
                            <p>Issue Books</p>
                            <p>Fine Members</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;