import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../utils/auth';
import axios from 'axios';
import url from '../utils/url';
import Navbar from '../components/Navbar';
import ProfilePage from '../components/Profile';
import Loader from '../components/Loader';

const Profile = () => {
    const navigate = useNavigate();
    const [profile_id, setProfileId] = useState("");
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
                    console.log(id);
                    setProfileId(id);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
            
        }
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [profile_id, 500]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
            </>
        );
    }

    return (
        <>
            <Navbar />
            {/* Profile Page only after authentication */}
            <ProfilePage id={profile_id} />
        </>
    );
}

export default Profile;
