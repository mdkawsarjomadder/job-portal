import React, {useEffect, useState} from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


export default  function MyApplications()
{
    const navigate = useNavigate();
    const [applications, setApplication] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        fetchMyApplications();

    }, []);

    
}