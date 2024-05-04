import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import axios from "axios";
import url from "../utils/url";
import Reload from "./Reload";

function ProfilePage({ id }) {
    const [user, setUser] = useState({
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                var res = await axios.get(`${url}/user/${id}`);
                // console.log(res);
                setUser(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
        // Do something after fetching data
        console.log(user);
    }, [id]);

    useEffect(() => {
        if (user.id) {
            setLoading(false);
        }
    }, [user, 500]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="mx-auto bg-black p-8 border border-gray-300 shadow-lg rounded-md">
                <h1 className="text-2xl font-semibold text-white mr-4">User Profile</h1>
                <div className="mt-4 border-b border-gray-300 flex flex-row justify-between">
                    <h2 className="text-lg font-semibold text-white mr-4">Name</h2>
                    <p className="text-white">{user.name}</p>
                </div>
                <div className="mt-4 border-b border-gray-300 flex flex-row justify-between">
                    <h2 className="text-lg font-semibold text-white mr-4">Email</h2>
                    <p className="text-white">{user.email}</p>
                </div>
                <div className="mt-4 border-b border-gray-300 flex flex-row justify-between">
                    <h2 className="text-lg font-semibold text-white mr-4">Role</h2>
                    <p className="text-white">{user.memberType}</p>
                </div>
                <div className="mt-4 border-b border-gray-300 flex flex-row justify-between">
                    <h2 className="text-lg font-semibold text-white mr-4">Address</h2>
                    <p className="text-white">{user.address}</p>
                </div>
                <div className="mt-4 border-b border-gray-300 flex flex-row justify-between">
                    <h2 className="text-lg font-semibold text-white mr-4">Phone</h2>
                    <p className="text-white">{user.phone}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;