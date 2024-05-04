import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import url from "../utils/url";
import { useNavigate } from "react-router-dom";
import { delete_cookie } from "../utils/auth";

function LoginPage() {
    delete_cookie("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/login`, { "email": email, "password": password });
            if (response.data.success) {
                document.cookie = response.data.token;
                navigate("/home");
            }
            else {
                alert(response.data.error);
            }
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log(document.cookie);
        delete_cookie("");
    }, []);

    return (
        // Sticky Navbar
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-400 p-3 m-2" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-400 p-3 m-2" />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded m-2" onClick={handleSubmit}>Login</button>
                </form>
            </div>
        </>
    );
}

export default LoginPage;