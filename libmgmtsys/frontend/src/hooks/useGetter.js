import { useState, useEffect } from "react";
import axios from "axios";
import url from "../utils/url";
import { useSearchParams, useParams } from "react-router-dom";

export function useGetBook() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [book, setBook] = useState({
        id: "",
        title: "",
        author: "",
        ISBN: "",
        publisher: "",
        copies: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/book/${params.id}`);
                setBook(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return book;
}

export function useGetFine() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [fine, setFine] = useState({
        id: "",
        userId: "",
        amount: "",
        reason: "",
        date: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/fine/${params.id}`);
                setFine(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return fine;
}

export function useGetRequest() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [request, setRequest] = useState({
        id: "",
        userId: "",
        request_name: "",
        request_status: "",
        created_at: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/request/${params.id}`);
                setRequest(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return request;
}

export function useGetReserve() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [reserve, setReserve] = useState({
        id: "",
        userId: "",
        bookId: "",
        reserve_status: "",
        created_at: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/reserve/${params.id}`);
                setReserve(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return reserve;
}

export function useGetIssue() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [issue, setIssue] = useState({
        id: "",
        userId: "",
        bookId: "",
        issue_status: "",
        created_at: "",
        deadline: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/issue/${params.id}`);
                setIssue(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return issue;
}

export function useGetVoteCount() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [voteCount, setVoteCount] = useState({
        id: "",
        bookId: "",
        count: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/vote/${params.id}`);
                setVoteCount(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return voteCount;
}

export function useGetSearchResults() {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/search/${search}`);
                setSearchResults(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [search]);
    return [searchResults, setSearch];
}