import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import url from '../utils/url';
import Loader from '../components/Loader';
import Home_Admin from '../components/admin/home';
import Home_Member from '../components/member/home';
import Home_Librarian from '../components/librarian/home';

function Home() {
    const navigate = useNavigate();
    const [profile_id, setProfileId] = useState("");
    const [memberType, setMemberType] = useState("");
    const [loading, setLoading] = useState(true);
    const cookie = document.cookie;
    useEffect(() => {
        if (cookie === "") {
            navigate("/");
        } else {
            const fetchData = async () => {
                try {
                    var res = await axios.post(`${url}/checkToken`, { "token": cookie });
                    var id = res.data.id;
                    var memberType = res.data.memberType;
                    setProfileId(id);
                    setMemberType(memberType);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [profile_id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
            </>
        );
    }

    if (memberType === "admin") {
        return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <Home_Admin />
            </div>
        </>
        );
    }

    if (memberType === "member") {
        return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <Home_Member />
            </div>
        </>
        );
    }

    if (memberType === "librarian") {
        return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <Home_Librarian />
            </div>
        </>
        );
    }
}

export default Home;