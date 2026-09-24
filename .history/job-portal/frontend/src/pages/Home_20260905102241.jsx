import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home()
    {
      const [jobs, setJobs] = useState([]);
      const [loading, setLoading] = useState(true);
      
      //search in job category-----
      const [search, setSearch] = useState('');
      const [category, setCategory] = useState('');
      const [location, setLocation] = useState('');
      const [jobType, setJobType] = useState('');

    };